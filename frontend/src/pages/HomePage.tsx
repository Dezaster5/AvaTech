import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { About } from "../components/About";
import { Advantages } from "../components/Advantages";
import { Audience } from "../components/Audience";
import { ContactForm } from "../components/ContactForm";
import { Contacts } from "../components/Contacts";
import { Hero } from "../components/Hero";
import { Products } from "../components/Products";
import { Team } from "../components/Team";
import styles from "../styles/App.module.css";

const HOME_TITLE = "AvaTech — IT-решения для детских развлекательных парков";
const HOME_DESCRIPTION =
  "AvaTech разрабатывает IT-решения для автоматизации детских развлекательных парков, ресторанов и предприятий сферы развлечений. Кассы самообслуживания, мобильные приложения, QR-ресторан, HR Tech и учёт рабочего времени.";

function setMetaDescription(content: string) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta) {
    meta.content = content;
  }
}

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    document.title = HOME_TITLE;
    setMetaDescription(HOME_DESCRIPTION);

    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.setTimeout(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, [location.hash]);

  return (
    <main className={styles.main}>
      <Hero />
      <About />
      <Team />
      <Products />
      <Advantages />
      <Audience />
      <section id="contact-form" className="section section-dark">
        <div className="container">
          <ContactForm />
        </div>
      </section>
      <Contacts />
    </main>
  );
}
