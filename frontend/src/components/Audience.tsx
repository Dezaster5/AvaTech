import { audience } from "../data/content";
import styles from "../styles/sections.module.css";
import { AdvantageCard } from "./ui/AdvantageCard";
import { SectionTitle } from "./ui/SectionTitle";

export function Audience() {
  return (
    <section id="audience" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Для кого"
          title="Решения для парков, ресторанов и сетей развлечений"
          description="AvaTech помогает компаниям, которым нужна автоматизация продаж, персонала и цифрового взаимодействия с гостями."
          align="center"
        />
        <div className={styles.audienceGrid}>
          {audience.map((item) => (
            <AdvantageCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
