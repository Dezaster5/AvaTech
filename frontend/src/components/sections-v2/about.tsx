import Image from "next/image";
import { ArrowRight, Building2, FerrisWheel, Workflow, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 4 смысловых пункта о компании (вместо метрик из референса — у нас качественные преимущества)
const points = [
  {
    icon: Building2,
    title: "Реальный бизнес",
    text: "Выросли из действующих парков экосистемы Avatariya.",
  },
  {
    icon: FerrisWheel,
    title: "Практика парков",
    text: "Продукты создаём под реальные продажи, сервис и операции.",
  },
  {
    icon: Workflow,
    title: "Процессы изнутри",
    text: "Понимаем работу касс, ресторанов, сотрудников и гостей.",
  },
  {
    icon: RefreshCw,
    title: "Полный цикл",
    text: "Разрабатываем, внедряем, обучаем и сопровождаем.",
  },
];

export function About() {
  return (
    <section id="about" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-28">
        {/* Верхний ряд: фото слева, текст справа. items-stretch → колонки равной высоты */}
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Фото пространства развлекательного центра — растягивается на всю высоту колонки */}
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src="/about-v2.webp"
              alt="Гости в пространстве современного развлекательного центра"
              width={1448}
              height={1086}
              quality={90}
              sizes="(max-width: 1024px) 100vw, 720px"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Текст */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-brand">
              <span className="inline-block size-1.5 rounded-full bg-brand" />
              О компании
            </div>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight">
              Понимаем бизнес изнутри —
              <br />
              потому что сами его ведём
            </h2>

            <p className="mt-5 text-lg text-muted-foreground text-pretty">
              AvaTech вырос из парков Avatariya — и знает операционку не по
              учебникам, а из ежедневной практики. Поэтому наши продукты
              автоматизируют продажи, персонал и гостевой опыт в развлечениях,
              общепите, ритейле и сервисе.
            </p>

            <a
              href="#products"
              className={cn(buttonVariants({ size: "lg" }), "mt-7 h-11 px-5 text-base")}
            >
              Наши продукты
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        {/* Нижний ряд: 4 пункта с линиями и иконками */}
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-16 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-x-6">
          {points.map((p) => (
            <div key={p.title} className="border-t border-border pt-5">
              <div className="flex items-center gap-2.5">
                <p.icon className="size-5 text-brand" strokeWidth={1.75} />
                <h3 className="text-lg font-semibold">{p.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
