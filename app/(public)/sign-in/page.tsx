import type { Metadata } from "next";

import styles from "@/app/system.module.css";
import { createPageMetadata } from "@/app/_metadata";
import { SignInInterestForm } from "@/components/forms";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import { signInContent } from "@/content/site";

export const metadata: Metadata = createPageMetadata("/sign-in");

export default function SignInPage() {
  return (
    <main
      className={styles.formPage}
      id="main-content"
      tabIndex={-1}
      aria-labelledby="sign-in-title"
    >
      <Container>
        <header className={styles.formHeader}>
          <div className={styles.statusRow}>
            <ContentStatusLabel status={signInContent.contentStatus} />
          </div>
          <p className={styles.eyebrow}>{signInContent.eyebrow}</p>
          <h1 className={styles.formTitle} id="sign-in-title">
            {signInContent.title}
          </h1>
          <p className={styles.formLead}>{signInContent.body}</p>
        </header>

        <div className={styles.formLayout}>
          <div className={styles.formSupportingCopy}>
            <div className={styles.actions}>
              <ButtonLink
                href={signInContent.requestAction.href}
                variant={signInContent.requestAction.style}
              >
                {signInContent.requestAction.label}
              </ButtonLink>
              <ButtonLink
                href={signInContent.homeAction.href}
                variant={signInContent.homeAction.style}
              >
                {signInContent.homeAction.label}
              </ButtonLink>
            </div>
          </div>

          <div className={styles.formCard}>
            <SignInInterestForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
