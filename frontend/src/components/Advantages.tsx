import { advantages } from "../data/content";
import styles from "../styles/sections.module.css";
import { AdvantageCard } from "./ui/AdvantageCard";
import { SectionTitle } from "./ui/SectionTitle";

export function Advantages() {
  return (
    <section id="advantages" className="section section-dark">
      <div className="container">
        <div className={styles.darkSectionHeader}>
          <SectionTitle
            eyebrow="Преимущества AvaTech"
            title="Не просто разработка кода, а понимание процессов парков"
            description="Мы учитываем, как работают кассы, рестораны, сотрудники и гости, поэтому решения можно встроить в реальную операционную модель."
            align="center"
          />
        </div>
        <div className={styles.advantageGrid}>
          {advantages.map((item) => (
            <AdvantageCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
