import styles from "../styles/sections.module.css";
import { SectionTitle } from "./ui/SectionTitle";

const trustedCompanies = [
  {
    name: "Avatariya",
    logo: "/Avatariya_logo.png"
  },
  {
    name: "Вкусная корзинка",
    logo: "/korzinka_enhanced.png"
  }
];

export function TrustedBy() {
  return (
    <section id="trusted-by" className="section section-soft">
      <div className="container">
        <div className={styles.sectionHeadRow}>
          <SectionTitle
            eyebrow="Нам доверяют"
            title="Компании, для которых важны цифровые процессы"
            description="AvaTech развивает продукты на базе практического опыта Avatariya и задач бизнеса в сфере развлечений и сервиса."
            align="center"
          />
        </div>

        <div className={styles.trustedGrid}>
          {trustedCompanies.map((company) => (
            <article className={styles.trustedCard} key={company.name}>
              <img src={company.logo} alt={`Логотип ${company.name}`} />
              <h3>{company.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
