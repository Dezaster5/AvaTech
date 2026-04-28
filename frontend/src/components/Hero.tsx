import { ArrowRight, BadgeCheck, Clock3, CreditCard, QrCode, Smartphone } from "lucide-react";

import styles from "../styles/sections.module.css";
import { Button } from "./ui/Button";

export function Hero() {
  return (
    <section id="top" className={`${styles.hero} section`}>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <BadgeCheck size={17} />
            Участник Astana Hub
          </div>
          <h1>IT-решения для детских развлекательных парков</h1>
          <p>Автоматизируем продажи, сервис, сотрудников и гостевой опыт</p>
          <div className={styles.heroActions}>
            <Button href="#products">
              Наши продукты
              <ArrowRight size={18} />
            </Button>
            <Button href="#contact-form" variant="ghost">
              Связаться с нами
            </Button>
          </div>
        </div>

        <div className={styles.dashboard} aria-label="Визуализация цифровой платформы AvaTech">
          <div className={styles.dashboardHeader}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.dashboardBody}>
            <div className={styles.metricPanel}>
              <span>Sales flow</span>
              <strong>Tickets</strong>
              <div className={styles.progressLine} />
              <div className={styles.progressLineShort} />
            </div>
            <div className={styles.metricPanel}>
              <span>Service</span>
              <strong>QR Restaurant</strong>
              <QrCode size={26} />
            </div>
            <div className={styles.featurePanel}>
              <CreditCard size={28} />
              <span>Self-service POS</span>
            </div>
            <div className={styles.featurePanel}>
              <Smartphone size={28} />
              <span>Guest app</span>
            </div>
            <div className={styles.widePanel}>
              <Clock3 size={24} />
              <div>
                <strong>AvaTracker</strong>
                <span>Учёт времени и сотрудников</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
