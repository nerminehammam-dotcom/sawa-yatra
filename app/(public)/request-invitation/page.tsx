import type { Metadata } from "next";

import styles from "@/app/system.module.css";
import { createPageMetadata } from "@/app/_metadata";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { requestInvitationContent } from "@/content/site";

export const metadata: Metadata = createPageMetadata("/request-invitation");

export default function RequestInvitationPage() {
  return (
    <main
      className={styles.formPage}
      id="main-content"
      tabIndex={-1}
      aria-labelledby="request-invitation-title"
    >
      <Container>
        <header className={styles.formHeader}>
          <p className={styles.eyebrow}>{requestInvitationContent.eyebrow}</p>
          <h1 className={styles.formTitle} id="request-invitation-title">
            {requestInvitationContent.title}
          </h1>
          <p className={styles.formLead}>{requestInvitationContent.lead}</p>
        </header>

        <div className={styles.invitationLayout}>
          <div className={styles.formCard}>
            <p className={styles.formLead}>
              There is nothing to fill in here yet. When invitations open, this
              is where you will ask for one. Until then, leaving your interest is
              the only thing that helps, and it is one step.
            </p>
            <ButtonLink href="/register-interest" variant="primary">
              Register your interest
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
