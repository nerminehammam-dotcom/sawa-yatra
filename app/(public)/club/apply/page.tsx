import type { Metadata } from "next";
import Link from "next/link";

import styles from "../club.module.css";

export const metadata: Metadata = {
  title: "Apply to the club | Sawayatra",
  description: "Apply for free Sawayatra membership.",
};

export default function ApplyPage() {
  return (
    <main className={styles.application} id="main-content" tabIndex={-1}>
      <p>Club application</p>
      <h1>Membership is free.</h1>
      <p>
        Applications are read by the club. The collection wording is under
        legal review before personal application content is accepted online;
        this page does not collect nationality, gender or any inferred
        demographic.
      </p>
      <p>
        This is the application surface. It intentionally does not ask for a
        payment, a booking, a journey choice or a Travel Self result.
      </p>
      <Link href="/contact">Ask the club about applying</Link>
    </main>
  );
}

