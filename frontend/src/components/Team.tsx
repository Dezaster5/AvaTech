import { teamRoles } from "../data/content";
import styles from "../styles/sections.module.css";
import { AdvantageCard } from "./ui/AdvantageCard";
import { SectionTitle } from "./ui/SectionTitle";

export function Team() {
  return (
    <section className="section section-soft">
      <div className="container">
        <div className={styles.teamIntro}>
          <SectionTitle
            eyebrow="Команда"
            title="Практический опыт создания IT-продуктов для действующих парков"
            description="В штате AvaTech работают разработчики, проектные менеджеры, дизайнеры и специалисты по внедрению."
            align="center"
          />
        </div>
        <div className={styles.fourGrid}>
          {teamRoles.map((item) => (
            <AdvantageCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
