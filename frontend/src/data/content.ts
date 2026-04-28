import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Blocks,
  BriefcaseBusiness,
  Clock3,
  CreditCard,
  Handshake,
  Headphones,
  Layers3,
  MonitorSmartphone,
  QrCode,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Smartphone,
  Store,
  UsersRound,
  Utensils,
  Workflow
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
};

export type CardItem = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "О компании", href: "#about" },
  { label: "Продукты", href: "#products" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Для кого", href: "#audience" },
  { label: "Контакты", href: "#contacts" }
];

export const aboutPoints: CardItem[] = [
  {
    title: "Реальный бизнес",
    description: "AvaTech выросла из экосистемы действующих парков Avatariya.",
    Icon: BriefcaseBusiness
  },
  {
    title: "Практика парков",
    description: "Решения создаются под реальные продажи, сервис и операционные процессы.",
    Icon: Store
  },
  {
    title: "Процессы изнутри",
    description: "Команда понимает работу касс, ресторанов, сотрудников и гостевого потока.",
    Icon: Workflow
  },
  {
    title: "Полный цикл",
    description: "Разрабатываем, внедряем, обучаем пользователей и сопровождаем продукты.",
    Icon: Headphones
  }
];

export const teamRoles: CardItem[] = [
  {
    title: "Разработка",
    description: "Frontend, backend и мобильные продукты для операционных сценариев парков.",
    Icon: Blocks
  },
  {
    title: "Проектное управление",
    description: "Планирование внедрения, контроль задач и связь между бизнесом и командой.",
    Icon: Layers3
  },
  {
    title: "Дизайн интерфейсов",
    description: "Понятные интерфейсы для гостей, кассиров, администраторов и сотрудников.",
    Icon: MonitorSmartphone
  },
  {
    title: "Внедрение и поддержка",
    description: "Настройка продуктов, обучение команд и сопровождение после запуска.",
    Icon: Settings2
  }
];

export const products: CardItem[] = [
  {
    title: "Касса самообслуживания",
    description: "Продажа билетов гостям детских развлекательных парков без участия кассира.",
    Icon: CreditCard
  },
  {
    title: "Мобильное приложение для гостей",
    description: "Программа лояльности, покупка билетов, бронирование кабинок и цифровое взаимодействие с парком.",
    Icon: Smartphone
  },
  {
    title: "HR Tech-приложение для сотрудников",
    description: "Цифровой инструмент для сотрудников, внутренних процессов и коммуникации.",
    Icon: UsersRound
  },
  {
    title: "Мобильная касса",
    description: "Продажа услуг и билетов внутри парка с мобильного устройства.",
    Icon: ReceiptText
  },
  {
    title: "QR-ресторан",
    description: "Заказ блюд в ресторане через QR без участия официанта.",
    Icon: QrCode
  },
  {
    title: "AvaTracker",
    description: "Трекинг сотрудников и автоматизация учёта рабочего времени.",
    Icon: Clock3
  }
];

export const advantages: CardItem[] = [
  {
    title: "Опыт реальных парков",
    description: "Продукты строятся на понимании ежедневной работы парков развлечений.",
    Icon: BadgeCheck
  },
  {
    title: "Готовые IT-продукты",
    description: "Базовые решения можно внедрять быстрее и развивать под задачи клиента.",
    Icon: ShieldCheck
  },
  {
    title: "Команда внутри компании",
    description: "Разработка, дизайн, управление проектами и внедрение находятся в одном контуре.",
    Icon: UsersRound
  },
  {
    title: "Адаптация под клиента",
    description: "Сценарии продаж, роли сотрудников и интеграции настраиваются под операционную модель.",
    Icon: Settings2
  },
  {
    title: "Внедрение и поддержка",
    description: "Команда помогает перейти от разработки к стабильной работе продукта на площадке.",
    Icon: Headphones
  },
  {
    title: "Масштабирование сети",
    description: "Архитектура рассчитана на рост сети парков, филиалов и франчайзи.",
    Icon: Workflow
  }
];

export const audience: CardItem[] = [
  {
    title: "Детские развлекательные парки",
    description: "Автоматизация касс, билетов, гостей и внутренних процессов.",
    Icon: Store
  },
  {
    title: "Семейные парки",
    description: "Цифровой гостевой опыт и управление сервисом на площадке.",
    Icon: UsersRound
  },
  {
    title: "Рестораны при парках",
    description: "QR-заказы, ускорение обслуживания и снижение ручной нагрузки.",
    Icon: Utensils
  },
  {
    title: "Сети развлечений",
    description: "Единые продукты для нескольких локаций и централизованного управления.",
    Icon: Layers3
  },
  {
    title: "Франчайзинговые партнёры",
    description: "Повторяемые процессы и технологическая база для запуска площадок.",
    Icon: Handshake
  },
  {
    title: "Компании с операционными продажами",
    description: "Автоматизация продаж, персонала и взаимодействия с клиентами.",
    Icon: Workflow
  }
];
