import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Blocks,
  BriefcaseBusiness,
  Handshake,
  Headphones,
  Layers3,
  MonitorSmartphone,
  Settings2,
  ShieldCheck,
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
  { label: "О компании", href: "/#about" },
  { label: "Продукты", href: "/#products" },
  { label: "Преимущества", href: "/#advantages" },
  { label: "Для кого", href: "/#audience" },
  { label: "Контакты", href: "/#contacts" },
  { label: "Нам доверяют", href: "/#trusted-by" }
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
