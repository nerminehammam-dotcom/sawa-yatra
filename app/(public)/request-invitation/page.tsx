import type { Metadata } from "next";

import styles from "@/app/system.module.css";
import { createPageMetadata } from "@/app/_metadata";
import { InvitationRequestForm } from "@/components/forms";
import { Container } from "@/components/ui/Container";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
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
          <div className={styles.statusRow}>
            <ContentStatusLabel status={requestInvitationContent.contentStatus} />
          </div>
          <p className={styles.eyebrow}>{requestInvitationContent.eyebrow}</p>
          <h1 className={styles.formTitle} id="request-invitation-title">
            {requestInvitationContent.title}
          </h1>
          <p className={styles.formLead}>{requestInvitationContent.lead}</p>
        </header>

        <div className={styles.invitationLayout}>
          <div className={styles.formCard}>
            <InvitationRequestForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
