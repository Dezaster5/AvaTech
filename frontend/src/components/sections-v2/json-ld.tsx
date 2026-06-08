// Вставка структурированных данных Schema.org (JSON-LD) — помогает поисковикам
// понять, что это за организация/продукт, и показывать расширенные результаты.
// Рендерится как <script type="application/ld+json"> в разметке страницы.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // данные формируются на сервере из наших же объектов — безопасно
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
