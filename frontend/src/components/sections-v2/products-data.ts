import {
  type LucideIcon,
  Ticket,
  ListChecks,
  CreditCard,
  Gauge,
  Network,
  Heart,
  CalendarCheck,
  Bell,
  BadgePercent,
  History,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  QrCode,
  Target,
  Plug,
  Smartphone,
  PlusCircle,
  MapPin,
  Zap,
  UtensilsCrossed,
  Users,
  RefreshCw,
  Clock,
  ScanFace,
  UserCheck,
  Settings,
  Printer,
  Sparkles,
  FerrisWheel,
  Store,
  Building2,
} from "lucide-react";

// Одна функция продукта: заголовок + (опц.) короткое описание + иконка
export type ProductFeature = { title: string; desc?: string; icon: LucideIcon };
// Сегмент аудитории: подпись + иконка (картинки больше не используем)
export type Segment = { label: string; icon: LucideIcon };
// Бизнес-эффект: (опц.) цифра-акцент + подпись
export type Effect = { value?: string; label: string };

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  subtitle: string;
  whatItDoes: string;
  whatItDoesAccent?: string; // подстрока в whatItDoes, которую подсветить брендовым цветом
  features: ProductFeature[];
  audience: Segment[];
  effects: Effect[];
  integrations?: string[];
  mockup: { src: string; width: number; height: number; alt: string };
  gallery: string[]; // изображения для карусели «Интерфейсы»
};

// Расширенная аудитория под позиционирование V2 (бизнес с потоком гостей).
// Каждому сегменту — своя иконка по смыслу метки.
const AUDIENCE_V2: Segment[] = [
  { label: "Парки и развлекательные центры", icon: FerrisWheel },
  { label: "Рестораны и фуд-корты", icon: UtensilsCrossed },
  { label: "Ритейл и сервисные точки", icon: Store },
  { label: "Сети и франшиза", icon: Building2 },
];

export const PRODUCTS: Product[] = [
  // ───────────────────────── ЭТАЛОН (полный) ─────────────────────────
  {
    slug: "self-service-kiosk",
    name: "Касса самообслуживания",
    tagline: "Быстрая продажа без очередей и лишней нагрузки на кассу.",
    subtitle: "Современное решение для самостоятельной покупки билетов, услуг и товаров без участия кассира.",
    whatItDoes:
      "Ava CSI — касса самообслуживания нового поколения: все продажи и услуги собраны в одном терминале. Гость сам выбирает билеты и тарифы, оформляет покупку и оплачивает заказ без участия кассира — картой, Apple Pay, Google Pay или Kaspi QR. Решение снижает нагрузку на кассу, ускоряет обслуживание и делает первый контакт гостя с площадкой удобнее.",
    whatItDoesAccent:
      "оформляет покупку и оплачивает заказ без участия кассира",
    features: [
      { title: "Самостоятельная покупка", desc: "Гость сам выбирает билеты, тарифы и услуги — без очереди к кассиру.", icon: Ticket },
      //   (неразрывный пробел) связывает «и» с «тарифов», поэтому строка
      // в узкой карточке-булете переносится как «Выбор услуг» / «и тарифов».
      { title: "Выбор услуг и тарифов", desc: "Тарифы, пакеты, льготные категории и допуслуги в одном понятном экране.", icon: ListChecks },
      { title: "Оплата без кассира", desc: "Банковские карты, Apple Pay, Google Pay и Kaspi QR прямо на киоске.", icon: CreditCard },
      { title: "Печать браслетов и чеков", desc: "RFID-браслеты и электронный чек печатаются сразу после оплаты.", icon: Printer },
      { title: "Снижение очередей", desc: "Несколько точек самообслуживания разгружают вход в часы пик.", icon: Gauge },
      { title: "Интеграция с 1С, iiko и СКУД", desc: "Продажи и услуги синхронизируются с вашей учётной системой.", icon: Network },
    ],
    integrations: ["1С", "iiko", "Kaspi", "WebKassa", "СКУД"],
    audience: AUDIENCE_V2,
    effects: [
      { value: "−40%", label: "нагрузка на кассу" },
      { value: "×2", label: "скорость обслуживания" },
      { value: "+30%", label: "пропускная способность" },
      { value: "24/7", label: "продажи без кассира" },
    ],
    mockup: { src: "/products/kassa-csi.png", width: 408, height: 996, alt: "Касса самообслуживания Ava CSI: терминал и приложение" },
    gallery: [
      "/gallery/self-service-kiosk/1.webp",
      "/gallery/self-service-kiosk/2.webp",
      "/gallery/self-service-kiosk/3.webp",
      "/gallery/self-service-kiosk/4.webp",
      "/gallery/self-service-kiosk/5.webp",
    ],
  },

  // ───────────────────── Остальные 5 (база, фаза 2) ─────────────────────
  {
    slug: "guest-mobile-app",
    name: "Мобильное приложение для гостей",
    tagline: "Единая цифровая точка контакта между гостем и площадкой.",
    subtitle: "Лояльность, билеты, бронирование и цифровое взаимодействие с гостем.",
    whatItDoes:
      "Мобильное приложение удерживает гостей и продаёт больше: билеты, программа лояльности, push-уведомления и акции в одном приложении. Гость возвращается чаще, а продажи растут через цифровой канал.",
    whatItDoesAccent:
      "билеты, программа лояльности, push-уведомления и акции в одном приложении",
    features: [
      { title: "Покупка билетов", desc: "Гость покупает билеты прямо в телефоне, без очереди в кассу.", icon: Ticket },
      { title: "Программа лояльности", desc: "Бонусы и статусы мотивируют возвращаться снова.", icon: Heart },
      { title: "Бронирование кабинок или услуг", desc: "Бронь нужного времени и услуг заранее, в пару тапов.", icon: CalendarCheck },
      { title: "Push-уведомления", desc: "Напоминания, акции и новости приходят прямо на экран.", icon: Bell },
      { title: "Цифровые промокоды", desc: "Персональные скидки и промокоды внутри приложения.", icon: BadgePercent },
      { title: "История покупок и взаимодействий", desc: "Все заказы и визиты гостя — в одном профиле.", icon: History },
    ],
    audience: AUDIENCE_V2,
    effects: [
      { value: "+35%", label: "повторных визитов" },
      { value: "×3", label: "цифровых касаний с гостем" },
      { value: "+25%", label: "продаж через приложение" },
      { value: "+50%", label: "участников лояльности" },
    ],
    mockup: { src: "/products/mobile-app.png", width: 640, height: 1185, alt: "Мобильное приложение AvaTech для гостей" },
    gallery: [
      "/gallery/guest-mobile-app/1.webp",
      "/gallery/guest-mobile-app/2.webp",
      "/gallery/guest-mobile-app/3.webp",
    ],
  },
  {
    slug: "hr-tech-app",
    name: "HR Tech-приложение",
    tagline: "Единая платформа обучения, эффективности и учёта рабочего времени.",
    subtitle: "Мобильное приложение и веб-админка для команды и внутренних процессов.",
    whatItDoes:
      "AVA HR — единая платформа для работы с командой: адаптация и обучение, эффективность, учёт рабочего времени и управление сотрудниками в одном продукте. Онбординг, OKR/KPI, база знаний с ИИ-ботом Ava AI и аналитика по людям заменяют десяток разрозненных инструментов, а процессы становятся прозрачными вместо ручного контроля.",
    whatItDoesAccent:
      "адаптация и обучение, эффективность, учёт рабочего времени и управление сотрудниками в одном продукте",
    features: [
      { title: "Адаптация: онбординг, обучение и тесты", desc: "Новичок проходит онбординг-план, курсы и тесты в одном месте.", icon: GraduationCap },
      { title: "База знаний и ИИ-бот Ava AI", desc: "Регламенты под рукой, а ИИ-бот отвечает на вопросы сотрудников.", icon: Sparkles },
      { title: "Эффективность: OKR/KPI и задачи", desc: "Цели, задачи, чек-листы и аналитика выполнения по команде.", icon: Target },
      { title: "Учёт рабочего времени через QR", desc: "Отметка смены по QR-коду и контроль дисциплины без табелей.", icon: QrCode },
      { title: "Управление сотрудниками и оргструктура", desc: "Единая карточка, цифровая оргструктура и карьерные треки.", icon: Users },
      { title: "Интеграции с CRM, POS/ERP, SSO", desc: "AmoCRM, Bitrix24, 1С, iiko, облако и SSO из коробки.", icon: Plug },
    ],
    integrations: ["1С", "AmoCRM", "Bitrix24", "iiko", "SSO"],
    audience: AUDIENCE_V2,
    effects: [
      { value: "−50%", label: "время адаптации новичка" },
      { value: "×2", label: "скорость обучения" },
      { value: "+40%", label: "прозрачность процессов" },
      { value: "100%", label: "сотрудников в одной системе" },
    ],
    mockup: { src: "/products/hr-tech-ava.png", width: 1700, height: 1044, alt: "AVA HR by AvaTech: дашборд сотрудников и мобильное приложение" },
    gallery: [
      "/gallery/hr-tech-app/1.webp",
      "/gallery/hr-tech-app/2.webp",
      "/gallery/hr-tech-app/3.webp",
      "/gallery/hr-tech-app/4.webp",
      "/gallery/hr-tech-app/5.webp",
      "/gallery/hr-tech-app/6.webp",
      "/gallery/hr-tech-app/7.webp",
    ],
  },
  {
    slug: "mobile-pos",
    name: "Мобильная касса",
    tagline: "Продажи внутри площадки без привязки к стационарной кассе.",
    subtitle: "Продажа услуг и билетов с мобильного устройства.",
    whatItDoes:
      "Мобильная касса продаёт билеты и услуги прямо на площадке — с любого устройства, без привязки к стационарной кассе. Больше точек продаж, быстрее обслуживание и выше дополнительные продажи.",
    whatItDoesAccent:
      "прямо на площадке — с любого устройства, без привязки к стационарной кассе",
    features: [
      { title: "Продажа билетов с мобильного устройства", desc: "Сотрудник продаёт билеты с телефона в любой зоне.", icon: Smartphone },
      { title: "Продажа дополнительных услуг", desc: "Допуслуги и товары — без похода к стационарной кассе.", icon: PlusCircle },
      { title: "Работа в любой точке площадки", desc: "Касса всегда рядом с гостем, где бы он ни был.", icon: MapPin },
      { title: "Быстрый доступ к заказам", desc: "Заказы открываются и оформляются в пару касаний.", icon: Zap },
      { title: "Интеграция с общей системой продаж", desc: "Все продажи попадают в единый учёт автоматически.", icon: Network },
    ],
    audience: AUDIENCE_V2,
    effects: [
      { value: "+30%", label: "точек продаж на площадке" },
      { value: "×2", label: "скорость обслуживания" },
      { value: "−25%", label: "очереди в часы пик" },
      { value: "+20%", label: "дополнительных продаж" },
    ],
    mockup: { src: "/products/self-kassa.png", width: 834, height: 1182, alt: "Мобильная касса AvaTech" },
    gallery: [
      "/gallery/mobile-pos/1.webp",
      "/gallery/mobile-pos/2.webp",
      "/gallery/mobile-pos/3.webp",
    ],
  },
  {
    slug: "qr-restaurant",
    name: "QR-ресторан",
    tagline: "Цифровой заказ еды без очередей и лишней нагрузки на персонал.",
    subtitle: "Заказ блюд через QR — без ожидания официанта.",
    whatItDoes:
      "QR-ресторан даёт гостям открыть меню по QR-коду, выбрать блюда и оформить заказ без ожидания официанта. Обслуживание ускоряется, очереди уходят, а нагрузка на персонал падает.",
    whatItDoesAccent:
      "открыть меню по QR-коду, выбрать блюда и оформить заказ без ожидания официанта",
    features: [
      { title: "QR-меню", desc: "Гость открывает меню, наведя камеру на QR-код.", icon: QrCode },
      { title: "Самостоятельный выбор блюд", desc: "Гость собирает заказ сам, без ожидания официанта.", icon: UtensilsCrossed },
      { title: "Оформление заказа через телефон", desc: "Заказ и оплата проходят прямо со смартфона.", icon: Smartphone },
      { title: "Снижение нагрузки на официантов", desc: "Персонал освобождается от приёма заказов вручную.", icon: Users },
      { title: "Удобное обновление меню", desc: "Блюда, цены и стоп-листы меняются за минуту.", icon: RefreshCw },
      { title: "Интеграция с ресторанными процессами", desc: "Заказы уходят на кухню и в систему учёта.", icon: Plug },
    ],
    integrations: ["Kaspi", "iiko"],
    audience: AUDIENCE_V2,
    effects: [
      { value: "−40%", label: "время приёма заказа" },
      { value: "×2", label: "оборот столов" },
      { value: "+25%", label: "средний чек" },
      { value: "−30%", label: "нагрузка на официантов" },
    ],
    mockup: { src: "/products/qr-menu.png", width: 586, height: 1184, alt: "QR-меню AvaTech: заказ блюд по QR-коду" },
    gallery: [
      "/gallery/qr-restaurant/1.webp",
      "/gallery/qr-restaurant/2.webp",
      "/gallery/qr-restaurant/3.webp",
    ],
  },
  {
    slug: "avatracker",
    name: "AvaTracker",
    tagline: "Контроль рабочего времени и прозрачность операционной дисциплины.",
    subtitle: "Трекинг сотрудников и автоматизация учёта рабочего времени.",
    whatItDoes:
      "AvaTracker автоматизирует учёт рабочего времени и контроль присутствия — без ручных табелей. Смена отмечается по хэшу лица, без хранения фотографий, а процессы становятся прозрачными.",
    whatItDoesAccent:
      "учёт рабочего времени и контроль присутствия — без ручных табелей",
    features: [
      { title: "Учёт рабочего времени", desc: "Приход и уход фиксируются автоматически, без табелей.", icon: Clock },
      { title: "Трекинг сотрудников", desc: "Видно, кто на смене и где находится по площадке.", icon: MapPin },
      { title: "Фиксация смен по хэшу лица", desc: "Отметка подтверждается лицом — без хранения фото.", icon: ScanFace },
      { title: "Контроль присутствия", desc: "Опоздания и отсутствия видны сразу, без ручных проверок.", icon: UserCheck },
      { title: "Аналитика по рабочему времени", desc: "Отчёты по сменам, часам и дисциплине команды.", icon: BarChart3 },
      { title: "Поддержка операционного управления", desc: "Данные помогают планировать смены и нагрузку.", icon: Settings },
    ],
    audience: AUDIENCE_V2,
    effects: [
      { value: "100%", label: "учёт рабочего времени" },
      { value: "−60%", label: "ручной контроль смен" },
      { value: "+30%", label: "дисциплина по сменам" },
      { value: "24/7", label: "контроль присутствия" },
    ],
    mockup: { src: "/products/avatrack.png", width: 1088, height: 972, alt: "AvaTracker AvaTech: отметки сотрудников" },
    gallery: [
      "/gallery/avatracker/1.webp",
      "/gallery/avatracker/2.webp",
      "/gallery/avatracker/3.webp",
      "/gallery/avatracker/4.webp",
    ],
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const productSlugs = () => PRODUCTS.map((p) => p.slug);
