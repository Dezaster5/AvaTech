import type { LucideIcon } from "lucide-react";
import { Clock3, CreditCard, QrCode, ReceiptText, Smartphone, UsersRound } from "lucide-react";

export const PRODUCT_IMAGE_FALLBACK = "/avtch.jpeg";

export type ProductGalleryGroup = {
  title: string;
  description?: string;
  images: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  tagline: string;
  gallery: string[];
  description: string;
  features: string[];
  audience: string[];
  businessValue: string[];
  seoTitle: string;
  seoDescription: string;
  galleryGroups?: ProductGalleryGroup[];
  Icon: LucideIcon;
};

export const products: Product[] = [
  {
    id: "self-service-kiosk",
    slug: "self-service-kiosk",
    title: "Касса самообслуживания",
    shortDescription: "Продажа билетов гостям детских развлекательных парков без участия кассира.",
    tagline: "Быстрая продажа билетов без очередей и лишней нагрузки на кассу.",
    gallery: [
      "/assets/products/self-service-kiosk/КСО_1.png",
      "/assets/products/self-service-kiosk/КСО_2.png",
      "/assets/products/self-service-kiosk/КСО_3.png",
      "/assets/products/self-service-kiosk/КСО_4.png",
      "/assets/products/self-service-kiosk/КСО_5.png",
      "/assets/products/self-service-kiosk/КСО_6.jpeg",
      "/assets/products/self-service-kiosk/КСО_7.png",
      "/assets/products/self-service-kiosk/КСО_8.png"
    ],
    description:
      "Касса самообслуживания помогает гостям самостоятельно покупать билеты, выбирать услуги и оплачивать заказ без участия кассира. Решение снижает нагрузку на персонал, ускоряет обслуживание и делает вход в парк удобнее.",
    features: [
      "Самостоятельная покупка билетов",
      "Выбор услуг и тарифов",
      "Оплата без участия кассира",
      "Снижение очередей",
      "Интеграция с внутренними системами парка"
    ],
    audience: ["Детские развлекательные парки", "Семейные парки", "Сети развлечений", "Франчайзинговые партнёры"],
    businessValue: [
      "Меньше нагрузки на кассу",
      "Быстрее обслуживание гостей",
      "Выше пропускная способность",
      "Удобнее первый контакт гостя с парком"
    ],
    seoTitle: "Касса самообслуживания для парков | AvaTech",
    seoDescription:
      "Касса самообслуживания AvaTech помогает детским развлекательным паркам продавать билеты без участия кассира, снижать очереди и ускорять обслуживание гостей.",
    Icon: CreditCard
  },
  {
    id: "guest-mobile-app",
    slug: "guest-mobile-app",
    title: "Мобильное приложение для гостей",
    shortDescription:
      "Программа лояльности, покупка билетов, бронирование кабинок и цифровое взаимодействие с парком.",
    tagline: "Единая цифровая точка контакта между гостем и парком.",
    gallery: [
      "/assets/products/guest-mobile-app/Колесо фортуны.png",
      "/assets/products/guest-mobile-app/Смотреть прототип1.png",
      "/assets/products/guest-mobile-app/достижения.png",
      "/assets/products/guest-mobile-app/достижения-1.png",
      "/assets/products/guest-mobile-app/достижения-2.png"
    ],
    description:
      "Мобильное приложение помогает парку выстраивать постоянную коммуникацию с гостями: продавать билеты, запускать программу лояльности, отправлять уведомления, показывать акции и давать гостю удобный доступ к сервисам парка.",
    features: [
      "Покупка билетов",
      "Программа лояльности",
      "Бронирование кабинок или услуг",
      "Push-уведомления",
      "Цифровые промокоды",
      "История покупок и взаимодействий"
    ],
    audience: ["Детские развлекательные парки", "Семейные парки", "Сети развлечений", "Франчайзинговые партнёры"],
    businessValue: [
      "Больше повторных визитов",
      "Удобная коммуникация с гостем",
      "Рост продаж через цифровые каналы",
      "Развитие лояльности"
    ],
    seoTitle: "Мобильное приложение для парка развлечений | AvaTech",
    seoDescription:
      "Мобильное приложение AvaTech помогает паркам продавать билеты, запускать программу лояльности, бронировать услуги и выстраивать цифровую коммуникацию с гостями.",
    galleryGroups: [
      {
        title: "Убийца очередей",
        description: "Отдельный сценарий мобильного приложения для ускорения гостевого потока и цифрового сервиса.",
        images: [
          "/assets/products/guest-mobile-app/Убийца очередей/queue-buster_1.png",
          "/assets/products/guest-mobile-app/Убийца очередей/queue-buster_2.png",
          "/assets/products/guest-mobile-app/Убийца очередей/queue-buster_3.png"
        ]
      }
    ],
    Icon: Smartphone
  },
  {
    id: "hr-tech-app",
    slug: "hr-tech-app",
    title: "HR Tech-приложение для сотрудников",
    shortDescription: "Цифровой инструмент для сотрудников, внутренних процессов и коммуникации.",
    tagline: "Внутренняя платформа для команды, задач, обучения и коммуникации.",
    gallery: [
      "/assets/products/hr-tech-app/desktop.png",
      "/assets/products/hr-tech-app/Профиль.png",
      "/assets/products/hr-tech-app/Орг структура.png",
      "/assets/products/hr-tech-app/Карьерный рост.png",
      "/assets/products/hr-tech-app/Карьерный рост-1.png",
      "/assets/products/hr-tech-app/офиса.png",
      "/assets/products/hr-tech-app/AvatariyaAI.png",
      "/assets/products/hr-tech-app/HR Tech_2.png",
      "/assets/products/hr-tech-app/HR Tech_3.png"
    ],
    description:
      "HR Tech-приложение помогает управлять внутренними процессами: коммуникацией с сотрудниками, задачами, обучением, адаптацией, показателями и рабочими процессами. Продукт полезен для компаний, где важно быстро передавать информацию команде и контролировать операционную дисциплину.",
    features: [
      "Внутренние новости и уведомления",
      "Задачи для сотрудников",
      "Обучение и материалы",
      "Коммуникация внутри команды",
      "Отслеживание выполнения процессов",
      "Поддержка HR-операций"
    ],
    audience: ["Детские развлекательные парки", "Семейные парки", "Рестораны при парках", "Сетевые объекты"],
    businessValue: [
      "Быстрее адаптация сотрудников",
      "Меньше хаоса в коммуникациях",
      "Прозрачнее внутренние процессы",
      "Выше управляемость команды"
    ],
    seoTitle: "HR Tech-приложение для сотрудников | AvaTech",
    seoDescription:
      "HR Tech-приложение AvaTech помогает автоматизировать внутренние процессы, коммуникацию, обучение и управление сотрудниками.",
    Icon: UsersRound
  },
  {
    id: "mobile-pos",
    slug: "mobile-pos",
    title: "Мобильная касса",
    shortDescription: "Продажа услуг и билетов внутри парка с мобильного устройства.",
    tagline: "Продажи внутри парка без привязки к стационарной кассе.",
    gallery: [
      "/assets/products/mobile-pos/Список услуг.png",
      "/assets/products/mobile-pos/Скан.png",
      "/assets/products/mobile-pos/Страница гостя.png"
    ],
    description:
      "Мобильная касса позволяет сотрудникам продавать билеты, услуги и дополнительные продукты прямо внутри парка с мобильного устройства. Это удобно для активных зон, ресторанов, мероприятий и точек продаж, где стационарная касса не всегда подходит.",
    features: [
      "Продажа билетов с мобильного устройства",
      "Продажа дополнительных услуг",
      "Работа внутри парка",
      "Быстрый доступ к заказам",
      "Возможность интеграции с общей системой продаж"
    ],
    audience: ["Детские развлекательные парки", "Семейные парки", "Рестораны при парках", "Выездные и активные зоны"],
    businessValue: [
      "Больше точек продаж",
      "Быстрее обслуживание",
      "Гибкость для сотрудников",
      "Рост дополнительных продаж"
    ],
    seoTitle: "Мобильная касса для парков | AvaTech",
    seoDescription:
      "Мобильная касса AvaTech помогает продавать билеты, услуги и дополнительные продукты внутри парка с мобильного устройства.",
    Icon: ReceiptText
  },
  {
    id: "qr-restaurant",
    slug: "qr-restaurant",
    title: "QR-ресторан",
    shortDescription: "Заказ блюд в ресторане через QR без участия официанта.",
    tagline: "Цифровой заказ еды без очередей и лишней нагрузки на персонал.",
    gallery: [
      "/assets/products/qr-restaurant/qr_rest_1.png",
      "/assets/products/qr-restaurant/qr_rest_2.png",
      "/assets/products/qr-restaurant/menu_rest.png",
      "/assets/products/qr-restaurant/kassa_rest.png"
    ],
    description:
      "QR-ресторан позволяет гостям открыть меню через QR-код, выбрать блюда и оформить заказ без ожидания официанта. Решение ускоряет обслуживание, снижает нагрузку на персонал и делает ресторан внутри парка удобнее для семейных гостей.",
    features: [
      "QR-меню",
      "Самостоятельный выбор блюд",
      "Оформление заказа через телефон",
      "Снижение нагрузки на официантов",
      "Удобное обновление меню",
      "Интеграция с ресторанными процессами"
    ],
    audience: ["Рестораны при парках", "Семейные кафе", "Фуд-зоны", "Сети развлечений"],
    businessValue: [
      "Быстрее приём заказов",
      "Меньше очередей",
      "Выше удобство для гостей",
      "Проще управление меню"
    ],
    seoTitle: "QR-ресторан для парков и ресторанов | AvaTech",
    seoDescription:
      "QR-ресторан AvaTech позволяет гостям заказывать блюда через QR-код, снижает нагрузку на персонал и ускоряет обслуживание.",
    Icon: QrCode
  },
  {
    id: "avatracker",
    slug: "avatracker",
    title: "AvaTracker",
    shortDescription: "Трекинг сотрудников и автоматизация учёта рабочего времени.",
    tagline: "Контроль рабочего времени и прозрачность операционной дисциплины.",
    gallery: [
      "/assets/products/avatracker/Снимок экрана 2026-04-29 173254.png",
      "/assets/products/avatracker/photo_2026-04-29_17-27-07.jpg",
      "/assets/products/avatracker/photo_2026-04-29_17-27-13.jpg",
      "/assets/products/avatracker/photo_2026-04-29_17-27-17.jpg"
    ],
    description:
      "AvaTracker помогает автоматизировать учёт рабочего времени, отслеживать присутствие сотрудников и повышать прозрачность внутренних процессов. Решение подходит для парков, ресторанов и сетевых объектов, где важно понимать, кто, когда и где работает.",
    features: [
      "Учёт рабочего времени",
      "Трекинг сотрудников",
      "Фиксация смен",
      "Контроль присутствия",
      "Аналитика по рабочему времени",
      "Поддержка операционного управления"
    ],
    audience: ["Детские развлекательные парки", "Рестораны при парках", "Сетевые объекты", "Операционные команды"],
    businessValue: [
      "Прозрачный учёт смен",
      "Меньше ручного контроля",
      "Выше дисциплина",
      "Удобнее управление персоналом"
    ],
    seoTitle: "AvaTracker — учёт рабочего времени сотрудников | AvaTech",
    seoDescription:
      "AvaTracker помогает автоматизировать учёт рабочего времени, отслеживать сотрудников и повышать прозрачность операционных процессов.",
    Icon: Clock3
  }
];

export function getProductBySlug(slug?: string) {
  return products.find((product) => product.slug === slug);
}
