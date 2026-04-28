import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navItems } from "../data/content";
import styles from "../styles/Header.module.css";
import { Button } from "./ui/Button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.logo} href="#top" onClick={closeMenu} aria-label="AvaTech">
          <img className={styles.logoImage} src="/avtch.jpeg" alt="AvaTech" />
        </a>

        <nav className={styles.nav} aria-label="Основная навигация">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button href="#contact-form" variant="secondary" className={styles.contactButton}>
            Связаться
          </Button>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`${styles.mobilePanel} ${isOpen ? styles.mobilePanelOpen : ""}`} aria-hidden={!isOpen}>
        <nav className={styles.mobileNav} aria-label="Мобильная навигация">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <Button href="#contact-form" onClick={closeMenu}>
            Связаться
          </Button>
        </nav>
      </div>
    </header>
  );
}
