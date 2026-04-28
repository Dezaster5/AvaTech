import { aboutPoints } from "../data/content";
import styles from "../styles/sections.module.css";
import { AdvantageCard } from "./ui/AdvantageCard";
import { SectionTitle } from "./ui/SectionTitle";

export function About() {
  return (
    <section id="about" className="section">
      <div className={`container ${styles.aboutGrid}`}>
        <div>
          <SectionTitle
            eyebrow="О компании"
            title="Цифровая инфраструктура для парков развлечений"
            description="AvaTech — IT-компания из экосистемы Avatariya, специализирующаяся на разработке программного обеспечения для детских развлекательных парков, ресторанов и предприятий сферы развлечений."
          />
          <p className={styles.leadText}>
            Мы создаём цифровые продукты, которые помогают бизнесу автоматизировать продажи, управлять персоналом,
            улучшать клиентский опыт и повышать операционную эффективность.
          </p>
        </div>
        <div className={styles.pointGrid}>
          {aboutPoints.map((item) => (
            <AdvantageCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
