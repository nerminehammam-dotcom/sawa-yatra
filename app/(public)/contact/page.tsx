import type { Metadata } from "next";

import systemStyles from "@/app/system.module.css";
import { createPageMetadata } from "@/app/_metadata";
import { ContactQuestionForm } from "@/components/forms";
import { Container } from "@/components/ui/Container";
import { contactEmail } from "@/lib/contact";

import styles from "./contact.module.css";

export const metadata: Metadata = createPageMetadata("/contact");

interface ContactPageProps {
  searchParams: Promise<{ journey?: string | string[] }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const requestedContext = (await searchParams).journey;
  const initialJourneyContext =
    typeof requestedContext === "string"
      ? requestedContext.trim().slice(0, 160)
      : "";

  return (
    <main
      className={systemStyles.formPage}
      id="main-content"
      tabIndex={-1}
      aria-labelledby="contact-title"
    >
      <Container>
        <header className={systemStyles.formHeader}>
          <p className={systemStyles.eyebrow}>Ask Sawayatra</p>
          <h1 className={systemStyles.formTitle} id="contact-title">
            What would you like to know?
          </h1>
          <p className={systemStyles.formLead}>
            Ask about membership, the Andean Caravan, a journey section or how
            Sawayatra works.
          </p>
        </header>

        <div className={systemStyles.formLayout}>
          <div className={`${systemStyles.formSupportingCopy} ${styles.support}`}>
            <section
              className={styles.supportSection}
              aria-labelledby="contact-delivery-heading"
            >
              <h2 id="contact-delivery-heading">
                Online delivery is not connected yet.
              </h2>
              <p>
                You can prepare and check your question here. It will not be
                sent or stored until an approved delivery service is connected.
              </p>
              <a
                className={styles.emailLink}
                href={`mailto:${contactEmail}?subject=Sawayatra%20question`}
              >
                Email {contactEmail}
              </a>
            </section>

            <section
              className={styles.supportSection}
              aria-labelledby="contact-privacy-heading"
            >
              <h2 id="contact-privacy-heading">Before you write</h2>
              <p>
                Information submitted through a future live service will be
                used only to answer your question. Asking does not reserve a
                place, and no payment is taken here.
              </p>
            </section>
          </div>

          <div className={systemStyles.formCard}>
            <ContactQuestionForm
              initialJourneyContext={initialJourneyContext}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
