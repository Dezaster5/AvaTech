import { Badge } from "@/components/ui/badge";
import {
  FerrisWheel,
  PackageCheck,
  Users,
  SlidersHorizontal,
  Rocket,
  Network,
} from "lucide-react";

// 6 преимуществ AvaTech (тексты из исходника, слегка причёсаны).
const advantages = [
  {
    icon: FerrisWheel,
    title: "Опыт реальных парков",
    text: "Продукты строятся на понимании ежедневной работы парков развлечений.",
  },
  {
    icon: PackageCheck,
    title: "Готовые IT-продукты",
    text: "Базовые решения внедряются быстрее и развиваются под задачи клиента.",
  },
  {
    icon: Users,
    title: "Команда внутри компании",
    text: "Разработка, дизайн, управление проектами и внедрение в одном контуре.",
  },
  {
    icon: SlidersHorizontal,
    title: "Адаптация под клиента",
    text: "Сценарии продаж, роли сотрудников и интеграции настраиваются под вас.",
  },
  {
    icon: Rocket,
    title: "Внедрение и поддержка",
    text: "Помогаем перейти от разработки к стабильной работе продукта на площадке.",
  },
  {
    icon: Network,
    title: "Масштабирование сети",
    text: "Архитектура рассчитана на рост сети, филиалов и франчайзи.",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Левая колонка — заголовок + интро (липкая на десктопе) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <Badge variant="outline" className="h-auto gap-2 px-3 py-1 text-sm">
              <span className="size-1.5 rounded-full bg-brand" />
              Преимущества
            </Badge>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              Не просто разработка кода, а понимание реальных процессов
            </h2>
            <p className="mt-5 text-lg text-muted-foreground text-pretty">
              Мы учитываем, как работают кассы, рестораны, сотрудники и гости,
              поэтому решения встраиваются в реальную операционную модель.
            </p>
          </div>

          {/* Правая колонка — 6 преимуществ в 2 колонки */}
          <div className="lg:col-span-7">
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {advantages.map((a) => (
                <div
                  key={a.title}
                  className="group -m-4 rounded-2xl p-4 transition duration-300 hover:bg-card hover:shadow-xl hover:shadow-black/5"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10">
                    <a.icon
                      className="size-5 text-brand transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="mt-4 font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground text-pretty">
                    {a.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
