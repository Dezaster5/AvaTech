// Определяет страну посетителя по его IP — чтобы в форме телефона
// сразу подставился нужный флаг и код страны.
// Используем бесплатный сервис geojs (без ключа, с поддержкой CORS).
// Если сервис недоступен — возвращаем "KZ" (Казахстан) по умолчанию.
export async function detectCountry(): Promise<string> {
  try {
    const res = await fetch("https://get.geojs.io/v1/ip/country.json");
    const data = await res.json();
    // Ожидаем двухбуквенный код страны, например "KZ".
    return typeof data?.country === "string" ? data.country : "KZ";
  } catch {
    return "KZ";
  }
}
