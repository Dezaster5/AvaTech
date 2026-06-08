import { Badge } from "@/components/ui/badge";
import { Code2, ClipboardList, PenTool, LifeBuoy } from "lucide-react";

type BlobType = "hexagon" | "arch" | "circle" | "shield";

// Иконографичная фигура: форма «рифмуется» со смыслом роли.
// Заливка — currentColor (берётся из text-*-200 родителя).
function BlobShape({ type, className }: { type: BlobType; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      {/* Шестиугольник (модуль/инженерия). Скругление углов — обводкой тем же цветом. */}
      {type === "hexagon" && (
        <polygon
          points="28,11 72,11 93,50 72,89 28,89 7,50"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinejoin="round"
        />
      )}
      {/* Арка (структура/опора): купол + прямое тело */}
      {type === "arch" && (
        <>
          <circle cx="50" cy="44" r="42" />
          <rect x="8" y="44" width="84" height="52" rx="6" />
        </>
      )}
      {/* Круг (гармония/форма) */}
      {type === "circle" && <circle cx="50" cy="50" r="48" />}
      {/* Щит (надёжность/поддержка) */}
      {type === "shield" && (
        <path d="M50,3 C63,3 80,10 88,14 C91,15 92,17 92,22 V50 C92,76 72,92 50,98 C28,92 8,76 8,50 V22 C8,17 9,15 12,14 C20,10 37,3 50,3 Z" />
      )}
    </svg>
  );
}

// 4 ключевые позиции команды (роли вместо людей). Своя форма + пастельная заливка + цветная иконка.
const roles = [
  {
    icon: Code2,
    title: "Разработка",
    text: "Frontend, backend и мобильные продукты для операционных сценариев бизнеса.",
    shape: "hexagon" as BlobType,
    fill: "text-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: ClipboardList,
    title: "Проектное управление",
    text: "Планирование внедрения, контроль задач и связь между бизнесом и командой.",
    shape: "arch" as BlobType,
    fill: "text-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: PenTool,
    title: "Дизайн интерфейсов",
    text: "Понятные интерфейсы для гостей, кассиров, администраторов и сотрудников.",
    shape: "circle" as BlobType,
    fill: "text-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: LifeBuoy,
    title: "Внедрение и поддержка",
    text: "Настройка продуктов, обучение команд и сопровождение после запуска.",
    shape: "shield" as BlobType,
    fill: "text-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export function Team() {
  return (
    <section id="team" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Шапка блока — по левому краю */}
        <div className="max-w-2xl">
          <Badge variant="outline" className="h-auto gap-2 px-3 py-1 text-sm">
            <span className="size-1.5 rounded-full bg-brand" />
            Команда
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
            Полный цикл продукта закрывает одна команда
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            В штате AvaTech — разработчики, проектные менеджеры, дизайнеры и
            специалисты по внедрению.
          </p>
        </div>

        {/* 4 позиции */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {roles.map((r) => (
            <div
              key={r.title}
              className="group -m-4 flex flex-col items-start rounded-2xl p-4 text-left transition duration-300 hover:bg-card hover:shadow-xl hover:shadow-black/5"
            >
              {/* Фигура с иконкой вместо фото */}
              <div className="relative flex aspect-square w-full max-w-[112px] items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
                <BlobShape
                  type={r.shape}
                  className={`absolute inset-0 size-full ${r.fill}`}
                />
                <r.icon
                  className={`relative size-9 ${r.iconColor} transition-transform duration-300 group-hover:scale-110`}
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground text-pretty">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
