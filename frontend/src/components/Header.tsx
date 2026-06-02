import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { navItems } from "../data/content";
import styles from "../styles/Header.module.css";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderState = () => {
      setIsScrolled(window.scrollY > 18);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.logo} to="/" aria-label="AvaTech">
          <img className={styles.logoImage} src="/logo_avtch/white/Logo-AvaTech-white-without-bg.svg" alt="AvaTech" />
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/#contact-form" className={styles.contactButton}>
            Связаться
          </Link>
        </div>
      </div>
    </header>
  );
}
