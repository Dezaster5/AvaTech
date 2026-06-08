type ApiResult = {
  success?: boolean;
  error?: string;
  [key: string]: unknown;
};

export async function readApiResult(response: Response): Promise<ApiResult> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  const isHtml = text.trimStart().startsWith("<");

  return {
    success: false,
    error: isHtml
      ? "Сервер вернул HTML вместо JSON. Проверьте маршрут /api/bitrix в Nginx."
      : text || "Сервер вернул некорректный ответ.",
  };
}
