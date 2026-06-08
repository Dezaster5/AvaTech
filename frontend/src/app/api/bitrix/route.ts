const CONTACT_WEBHOOK = process.env.BITRIX_CONTACT_WEBHOOK;
const DEAL_WEBHOOK = process.env.BITRIX_DEAL_WEBHOOK;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const DJANGO_SUBMISSION_LOG_URL =
  process.env.DJANGO_SUBMISSION_LOG_URL ||
  (IS_PRODUCTION
    ? "http://backend:8000/api/contact/log/"
    : "http://127.0.0.1:8000/api/contact/log/");
const DJANGO_SUBMISSION_LOG_TOKEN =
  process.env.DJANGO_SUBMISSION_LOG_TOKEN || process.env.INTERNAL_API_TOKEN || "";

type LeadInput = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  message?: string;
  product?: string;
  website?: string;
  token?: string;
};

type BitrixResponse = {
  result?: number;
  error?: string;
  error_description?: string;
};

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const requestsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (requestsByIp.get(ip) ?? []).filter((t) => t > windowStart);
  recent.push(now);
  requestsByIp.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET || !token) return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    });
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return false;
  }
}

async function createBitrixContact(data: {
  name: string;
  phone: string;
  email: string;
}): Promise<BitrixResponse> {
  const response = await fetch(`${CONTACT_WEBHOOK}crm.contact.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        NAME: data.name,
        PHONE: [
          {
            VALUE: data.phone,
            VALUE_TYPE: "WORK",
          },
        ],
        EMAIL: data.email
          ? [
              {
                VALUE: data.email,
                VALUE_TYPE: "WORK",
              },
            ]
          : [],
      },
    }),
  });

  return response.json();
}

async function createBitrixDeal(data: {
  contactId: number;
  message: string;
}): Promise<BitrixResponse> {
  const response = await fetch(`${DEAL_WEBHOOK}crm.deal.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        TITLE: "Заявка с сайта AvaTech",
        CATEGORY_ID: 72,
        STAGE_ID: "C72:NEW",
        CONTACT_ID: data.contactId,
        COMMENTS: data.message,
        SOURCE_DESCRIPTION: "Сайт AvaTech",
      },
    }),
  });

  return response.json();
}

async function logSubmissionToDjango(payload: {
  name: string;
  company?: string;
  phone: string;
  email: string;
  message: string;
  product?: string;
  ip_address: string;
  user_agent: string;
  bitrix_status: "success" | "failed";
  bitrix_contact_id?: number;
  bitrix_deal_id?: number;
  bitrix_contact_response?: unknown;
  bitrix_deal_response?: unknown;
  bitrix_error?: string;
  request_payload: unknown;
  api_response_payload: unknown;
}) {
  try {
    const response = await fetch(DJANGO_SUBMISSION_LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(DJANGO_SUBMISSION_LOG_TOKEN
          ? { "X-AvaTech-Internal-Token": DJANGO_SUBMISSION_LOG_TOKEN }
          : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("Django submission log failed", response.status, await response.text());
    }
  } catch (error) {
    console.warn("Django submission log request failed", error);
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "";

  if (isRateLimited(ip)) {
    return Response.json(
      { success: false, error: "Слишком много заявок. Подождите минуту и попробуйте снова." },
      { status: 429 },
    );
  }

  let data: LeadInput;
  try {
    data = await request.json();
  } catch {
    return Response.json({ success: false, error: "Некорректный запрос." }, { status: 400 });
  }

  if (data.website && data.website.trim() !== "") {
    return Response.json({ success: true });
  }

  const name = data.name?.trim();
  const company = data.company?.trim() || "";
  const phone = data.phone?.trim();
  const email = data.email?.trim() || "";
  const product = data.product?.trim();
  const message = [product ? `Интересует продукт: ${product}` : "", data.message?.trim() || ""]
    .filter(Boolean)
    .join("\n");
  const requestPayload = { name, company, phone, email, message, product };

  if (!name || !phone) {
    return Response.json({ success: false, error: "Укажите имя и телефон." }, { status: 400 });
  }

  if (!CONTACT_WEBHOOK || !DEAL_WEBHOOK) {
    console.error("Bitrix webhooks are not configured");
    const apiResponse = {
      success: false,
      error: "Bitrix24 не настроен. Проверьте BITRIX_CONTACT_WEBHOOK и BITRIX_DEAL_WEBHOOK в env.",
    };
    await logSubmissionToDjango({
      name,
      company,
      phone,
      email,
      message,
      product,
      ip_address: ip,
      user_agent: userAgent,
      bitrix_status: "failed",
      bitrix_error: "Bitrix webhooks are not configured",
      request_payload: requestPayload,
      api_response_payload: apiResponse,
    });
    return Response.json(apiResponse, { status: 500 });
  }

  if (IS_PRODUCTION && TURNSTILE_SITE_KEY && !TURNSTILE_SECRET) {
    console.error("Turnstile secret is not configured");
    const apiResponse = {
      success: false,
      error: "Turnstile не настроен. Проверьте TURNSTILE_SECRET_KEY в env.",
    };
    await logSubmissionToDjango({
      name,
      company,
      phone,
      email,
      message,
      product,
      ip_address: ip,
      user_agent: userAgent,
      bitrix_status: "failed",
      bitrix_error: "Turnstile secret is not configured",
      request_payload: requestPayload,
      api_response_payload: apiResponse,
    });
    return Response.json(apiResponse, { status: 500 });
  }

  if (TURNSTILE_SECRET) {
    const captchaOk = await verifyTurnstile(data.token, ip);
    if (!captchaOk) {
      const apiResponse = {
        success: false,
        error: "Не удалось подтвердить, что вы не робот. Обновите страницу и попробуйте снова.",
      };
      await logSubmissionToDjango({
        name,
        company,
        phone,
        email,
        message,
        product,
        ip_address: ip,
        user_agent: userAgent,
        bitrix_status: "failed",
        bitrix_error: "Turnstile verification failed",
        request_payload: requestPayload,
        api_response_payload: apiResponse,
      });
      return Response.json(apiResponse, { status: 403 });
    }
  }

  try {
    const contactResult = await createBitrixContact({ name, phone, email });
    const contactId = contactResult.result;

    if (!contactId) {
      console.error("Bitrix contact creation failed", contactResult);
      const apiResponse = { success: false, error: "Не удалось создать контакт в Bitrix24." };
      await logSubmissionToDjango({
        name,
        company,
        phone,
        email,
        message,
        product,
        ip_address: ip,
        user_agent: userAgent,
        bitrix_status: "failed",
        bitrix_contact_response: contactResult,
        bitrix_error: contactResult.error_description || contactResult.error || "Contact creation failed",
        request_payload: requestPayload,
        api_response_payload: apiResponse,
      });
      return Response.json(apiResponse, { status: 502 });
    }

    const dealResult = await createBitrixDeal({
      contactId,
      message,
    });

    if (!dealResult.result) {
      console.error("Bitrix deal creation failed", dealResult);
      const apiResponse = {
        success: false,
        error: "Контакт создан, но не удалось создать сделку в Bitrix24.",
      };
      await logSubmissionToDjango({
        name,
        company,
        phone,
        email,
        message,
        product,
        ip_address: ip,
        user_agent: userAgent,
        bitrix_status: "failed",
        bitrix_contact_id: contactId,
        bitrix_contact_response: contactResult,
        bitrix_deal_response: dealResult,
        bitrix_error: dealResult.error_description || dealResult.error || "Deal creation failed",
        request_payload: requestPayload,
        api_response_payload: apiResponse,
      });
      return Response.json(apiResponse, { status: 502 });
    }

    const apiResponse = {
      success: true,
      contactId,
      dealId: dealResult.result,
    };
    await logSubmissionToDjango({
      name,
      company,
      phone,
      email,
      message,
      product,
      ip_address: ip,
      user_agent: userAgent,
      bitrix_status: "success",
      bitrix_contact_id: contactId,
      bitrix_deal_id: dealResult.result,
      bitrix_contact_response: contactResult,
      bitrix_deal_response: dealResult,
      request_payload: requestPayload,
      api_response_payload: apiResponse,
    });
    return Response.json(apiResponse);
  } catch (error) {
    console.error("Bitrix request failed", error);
    const apiResponse = {
      success: false,
      error: "Не удалось отправить заявку в Bitrix24. Попробуйте позже.",
    };
    await logSubmissionToDjango({
      name,
      company,
      phone,
      email,
      message,
      product,
      ip_address: ip,
      user_agent: userAgent,
      bitrix_status: "failed",
      bitrix_error: error instanceof Error ? error.message : String(error),
      request_payload: requestPayload,
      api_response_payload: apiResponse,
    });
    return Response.json(apiResponse, { status: 500 });
  }
}
