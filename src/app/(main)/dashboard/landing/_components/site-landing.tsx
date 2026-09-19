import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { ArrowDown, ArrowRight, ArrowUpRight, BatteryMedium, Mail, MapPin, Phone, Plus, Sun, Zap } from "lucide-react";

import { LandingContact } from "./landing-contact";
import { LandingNavigation, SystemExplorer } from "./landing-interactions";
import styles from "./site-landing.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-surya-display",
  display: "swap",
});
const CONTRACT = "https://www.statewidecontractuserguide.mass.gov/CUG/Guide/VEH122";
const AWARD = "https://www.masscec.com/press/masscec-awards-4-million-climatetech-companies";
const BROCHURE = "https://ne-expo.com/_data/brochures/suryatech.pdf";

const questions = [
  [
    "Does every site need a grid connection?",
    "The system combines solar generation and battery storage with EV charging. Whether a project needs grid backup depends on its charging demand, solar resource, storage capacity and operating requirements. A site assessment establishes the right configuration.",
  ],
  [
    "How much charging can a site support?",
    "Vehicle dwell time, daily energy demand, available solar area and battery capacity all matter. Charging rates and daily throughput should be specified for the proposed equipment and your site's usage, rather than assumed from a concept image.",
  ],
  [
    "What does installation involve?",
    "Site work, foundations, access, permits and any electrical connection are established during project planning. The scope and schedule are specific to the location and required approvals.",
  ],
  [
    "Can Massachusetts public entities use VEH122?",
    "SuryaTech is listed on the Massachusetts statewide contract VEH122 in categories 1 and 4. Eligible buyers should review the current contract guide, confirm the applicable scope and follow their purchasing requirements.",
  ],
  [
    "How are service and maintenance arranged?",
    "The maintenance scope, response arrangements and responsibilities are defined in the project agreement. Discuss these requirements alongside the system configuration so operation is part of the plan from the beginning.",
  ],
];

export function SiteLanding({ embedded = false }: { embedded?: boolean }) {
  const Content = embedded ? "div" : "main";
  return (
    <div className={`${poppins.variable} ${styles.site}`} data-embedded={embedded}>
      <a href="#surya-main" className={styles.skipLink}>
        Skip to content
      </a>
      {embedded && (
        <div className={styles.previewBar}>
          <span>SuryaTech website preview</span>
          <Link href="/landing" target="_blank" rel="noreferrer">
            Open full-width preview <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
      <LandingNavigation />
      <Content id="surya-main" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="surya-heading" id="top">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Solar. Storage. EV charging.</p>
            <h1 id="surya-heading">
              EV charging.
              <br />
              With power
              <br />
              <span>built in.</span>
            </h1>
            <p className={styles.heroDescription}>
              Bring solar generation, battery storage and EV charging together. Open up the possibilities for your site.
            </p>
            <a className={styles.primaryButton} href="#contact">
              Request a site assessment <ArrowUpRight size={20} />
            </a>
            <a className={styles.heroSecondary} href="#system">
              Explore the system <ArrowDown size={16} />
            </a>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/media/landing-hero-higgsfield-v3.webp"
              alt="Illustrative SuryaTech solar EV charger with integrated battery storage in a landscaped courtyard"
              fill
              preload
              sizes="(min-width: 800px) 60vw, 100vw"
              className={styles.heroImage}
            />
            <figcaption>Illustrative concept</figcaption>
          </figure>
        </section>

        <div className={styles.credentialStrip} aria-label="Company credentials">
          <div className={styles.credentialIntro}>
            Built around your site.
            <br />
            <strong>Grounded in Massachusetts.</strong>
          </div>
          <a href={CONTRACT} target="_blank" rel="noreferrer" className={styles.credential}>
            <strong>VEH122</strong>
            <span>
              Statewide contract vendor
              <br />
              Categories 1 &amp; 4
            </span>
            <ArrowUpRight size={20} />
          </a>
          <a href={AWARD} target="_blank" rel="noreferrer" className={styles.credential}>
            <strong>MassCEC</strong>
            <span>
              InnovateMass support
              <br />
              Hybrid charger testing
            </span>
            <ArrowUpRight size={20} />
          </a>
        </div>

        <section className={`${styles.section} ${styles.system}`} id="system" aria-labelledby="system-heading">
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.eyebrow}>The SuryaTech approach</p>
              <h2 id="system-heading">
                More than a charger.
                <br />
                An energy system.
              </h2>
            </div>
            <p>
              Charging starts with the power available at your site. Our hybrid approach brings generation, storage and
              delivery into the same conversation.
            </p>
          </div>
          <SystemExplorer />
          <div className={styles.energySequence} aria-label="How the system works">
            <span>
              <Sun size={22} /> Capture solar energy
            </span>
            <ArrowRight aria-hidden="true" size={20} />
            <span>
              <BatteryMedium size={22} /> Store it on site
            </span>
            <ArrowRight aria-hidden="true" size={20} />
            <span>
              <Zap size={22} /> Deliver EV charging
            </span>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.applications}`}
          id="applications"
          aria-labelledby="applications-heading"
        >
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.eyebrow}>Places with potential</p>
              <h2 id="applications-heading">
                A different site.
                <br />A new possibility.
              </h2>
            </div>
            <p>
              From the everyday commute to a weekend away, charging belongs where people already stop. Start with the
              needs of that place.
            </p>
          </div>
          <div className={styles.applicationGrid}>
            <a href="#contact" className={`${styles.application} ${styles.applicationLarge}`}>
              <Image
                src="/media/site-commercial-v2.webp"
                alt="Illustrative commercial parking area with EV charging equipment"
                fill
                sizes="(min-width: 800px) 55vw, 100vw"
              />
              <span className={styles.applicationCategory}>Commercial properties</span>
              <div className={styles.applicationCopy}>
                <h3>
                  Make parking
                  <br />
                  part of the plan.
                </h3>
                <p>Workplaces, retail destinations and shared parking.</p>
                <span className={styles.applicationLink}>
                  Discuss your site <ArrowUpRight size={20} />
                </span>
              </div>
              <span className={styles.imageCaption}>Illustrative setting</span>
            </a>
            <div className={styles.applicationStack}>
              <a href="#contact" className={styles.application}>
                <Image
                  src="/media/site-park-v2.webp"
                  alt="Illustrative charging equipment at a wooded park entrance"
                  fill
                  sizes="(min-width: 800px) 40vw, 100vw"
                />
                <div className={styles.applicationCopy}>
                  <p className={styles.applicationCategory}>Parks &amp; destinations</p>
                  <h3>
                    Go further.
                    <br />
                    Stay a little longer.
                  </h3>
                  <span className={styles.applicationLink}>
                    Explore the fit <ArrowUpRight size={20} />
                  </span>
                </div>
                <span className={styles.imageCaption}>Illustrative setting</span>
              </a>
              <a href="#contact" className={styles.municipalApplication}>
                <p className={styles.eyebrow}>Municipalities &amp; fleets</p>
                <h3>
                  Plan for the vehicles
                  <br />
                  that keep you moving.
                </h3>
                <p>Bring site demand, public access and purchasing requirements into one assessment.</p>
                <span className={styles.applicationLink}>
                  Start a conversation <ArrowUpRight size={20} />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.projectSection} id="approach" aria-labelledby="approach-heading">
          <div className={styles.projectIntro}>
            <p className={styles.eyebrow}>From possibility to a plan</p>
            <h2 id="approach-heading">
              The right system
              <br />
              starts with
              <br />
              <span>the right questions.</span>
            </h2>
            <a className={styles.primaryButton} href="#contact">
              Let's look at your site <ArrowUpRight size={20} />
            </a>
          </div>
          <ol className={styles.projectSteps}>
            <li>
              <span>01</span>
              <div>
                <h3>Understand the site.</h3>
                <p>Review charging demand, solar exposure, available space and existing electrical capacity.</p>
                <small>The starting point: your site's requirements.</small>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Define the system.</h3>
                <p>Bring generation, storage and charging together in a configuration that fits the intended use.</p>
                <small>The outcome: a scope you can evaluate.</small>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Plan the next steps.</h3>
                <p>Work through site preparation, approvals, installation responsibilities and ongoing service.</p>
                <small>The path forward: clear responsibilities and milestones.</small>
              </div>
            </li>
          </ol>
        </section>

        <section
          className={`${styles.section} ${styles.evidenceSection}`}
          id="company"
          aria-labelledby="company-heading"
        >
          <div className={styles.evidenceIntro}>
            <p className={styles.eyebrow}>Innovation with a purpose</p>
            <h2 id="company-heading">
              A Massachusetts company.
              <br />A practical energy challenge.
            </h2>
            <p>
              SuryaTech develops hybrid solar-powered EV charging with battery storage. The goal is straightforward:
              consider the energy source and the charger as one system.
            </p>
            <a href={BROCHURE} className={styles.textLink} target="_blank" rel="noreferrer">
              Read the company overview <ArrowUpRight size={18} />
            </a>
          </div>
          <div className={styles.evidenceList}>
            <article>
              <span className={styles.evidenceLabel}>Product development</span>
              <h3>Supported by InnovateMass.</h3>
              <p>MassCEC announced a $91,000 award to test SuryaTech's hybrid solar EV charger and battery.</p>
              <a href={AWARD} target="_blank" rel="noreferrer">
                Read the MassCEC announcement <ArrowUpRight size={17} />
              </a>
            </article>
            <article>
              <span className={styles.evidenceLabel}>Public purchasing</span>
              <h3>A statewide contract pathway.</h3>
              <p>
                SuryaTech is listed under VEH122 for categories 1 and 4. Review the current guide for scope and
                purchasing requirements.
              </p>
              <a href={CONTRACT} target="_blank" rel="noreferrer">
                View the VEH122 contract guide <ArrowUpRight size={17} />
              </a>
            </article>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.faqSection}`}
          id="questions"
          aria-labelledby="questions-heading"
        >
          <div>
            <p className={styles.eyebrow}>Before you get started</p>
            <h2 id="questions-heading">
              Good questions.
              <br />
              Clear answers.
            </h2>
            <p>
              Every location is different.
              <br />
              Let's establish what yours needs.
            </p>
          </div>
          <div className={styles.faqList}>
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Plus size={20} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.contactSection} id="contact" aria-labelledby="contact-heading">
          <div className={styles.contactIntro}>
            <p className={styles.eyebrow}>Your site. The next step.</p>
            <h2 id="contact-heading">
              Let's put your
              <br />
              site in the picture.
            </h2>
            <p>
              Tell us where you're planning to charge and what you need the site to do. Start a conversation with
              SuryaTech about the right configuration.
            </p>
            <div className={styles.contactPerson}>
              <strong>Mayur Kamalakar</strong>
              <span>Founder &amp; principal engineer</span>
            </div>
            <a className={styles.contactLink} href="mailto:mayur.kamalakar@suryatechpower.com">
              <Mail size={18} />
              <span>mayur.kamalakar@suryatechpower.com</span>
            </a>
            <a className={styles.contactLink} href="tel:+13392449464">
              <Phone size={18} />
              <span>+1 (339) 244-9464</span>
            </a>
          </div>
          <LandingContact />
        </section>
      </Content>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <a href="#top" aria-label="SuryaTech, back to top">
              <Image
                src="/media/suryatech-logo-light.png"
                alt="SuryaTech"
                width={206}
                height={72}
                className={styles.footerLogo}
              />
            </a>
            <p>Innovate. Charge. Inspire.</p>
          </div>
          <nav aria-label="Footer">
            <a href="#system">Our system</a>
            <a href="#applications">Applications</a>
            <a href="#company">Company</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className={styles.footerLocation}>
            <MapPin size={18} />
            <span>
              Massachusetts, USA
              <br />
              <a href="https://www.linkedin.com/company/surya-tech-evpower/" target="_blank" rel="noreferrer">
                Follow SuryaTech <ArrowUpRight size={15} />
              </a>
            </span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Suryatech EV Power LLC</span>
          <p>Website design preview. Images show illustrative concepts, not completed installations.</p>
          <a href="https://suryatechpower.com" target="_blank" rel="noreferrer">
            Current company website <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
    </div>
  );
}
