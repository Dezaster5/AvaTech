import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import styles from "../styles/sections.module.css";
import { SectionTitle } from "./ui/SectionTitle";

export function Contacts() {
  return (
    <section id="contacts" className="section">
      <div className={`container ${styles.contactsGrid}`}>
        <SectionTitle
          eyebrow="Контакты"
          title="Обсудим автоматизацию вашего парка"
          description="Свяжитесь с AvaTech, если вам нужны IT-решения для продаж, сервиса, сотрудников или гостевого опыта."
        />
        <div className={styles.contactList}>
          <a href="tel:+77019712777">
            <Phone size={20} />
            +7 701 971 27 77
          </a>
          <a href="mailto:info@avtch.io">
            <Mail size={20} />
            info@avtch.io
          </a>
          <span>
            <MapPin size={20} />
            Казахстан
          </span>
          <span>
            <ShieldCheck size={20} />
            Участник Astana Hub
          </span>
        </div>
      </div>
    </section>
  );
}
