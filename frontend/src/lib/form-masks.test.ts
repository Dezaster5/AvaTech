import { describe, it, expect } from "vitest";
import { sanitizeName, isValidEmail } from "./form-masks";

// Тесты для масок и проверок полей форм.

describe("sanitizeName — очистка имени", () => {
  it("убирает цифры", () => {
    expect(sanitizeName("Иван123")).toBe("Иван");
  });

  it("убирает спецсимволы, но оставляет буквы, пробел и дефис", () => {
    expect(sanitizeName("Анна-Мария @#$")).toBe("Анна-Мария ");
  });

  it("оставляет английские буквы", () => {
    expect(sanitizeName("John")).toBe("John");
  });

  it("пустую строку оставляет пустой", () => {
    expect(sanitizeName("")).toBe("");
  });
});

describe("isValidEmail — проверка email", () => {
  it("нормальный email — корректен", () => {
    expect(isValidEmail("user@company.kz")).toBe(true);
  });

  it("без @ — некорректен", () => {
    expect(isValidEmail("usercompany.kz")).toBe(false);
  });

  it("без домена после точки — некорректен", () => {
    expect(isValidEmail("user@company")).toBe(false);
  });

  it("с пробелом — некорректен", () => {
    expect(isValidEmail("user @company.kz")).toBe(false);
  });
});
