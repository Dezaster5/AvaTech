import { Link } from "react-router-dom";

import { navItems } from "../data/content";
import styles from "../styles/Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div>
          <Link className={styles.footerLogo} to="/" aria-label="AvaTech">
            AvaTech
          </Link>
          <p>
            IT-компания из экосистемы Avatariya. Разрабатываем и внедряем цифровые продукты для парков развлечений,
            ресторанов и предприятий сферы развлечений.
          </p>
          <span className={styles.hub}>Astana Hub participant</span>
        </div>
        <nav aria-label="Навигация в подвале">
          <strong>Навигация</strong>
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div>
          <strong>Контакты</strong>
          <a href="tel:+77019712777">+7 701 971 27 77</a>
          <a href="mailto:info@avtch.io">info@avtch.io</a>
          <a href="https://avtch.io">avtch.io</a>
        </div>
      </div>
      <div className={`container ${styles.footerBottom}`}>
        <span>© {new Date().getFullYear()} AvaTech. Все права защищены.</span>
        <span>Казахстан</span>
      </div>
    </footer>
  );
}
