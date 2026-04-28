import { About } from "./components/About";
import { Advantages } from "./components/Advantages";
import { Audience } from "./components/Audience";
import { ContactForm } from "./components/ContactForm";
import { Contacts } from "./components/Contacts";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Products } from "./components/Products";
import { Team } from "./components/Team";
import styles from "./styles/App.module.css";

export default function App() {
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
}
