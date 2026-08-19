import Image from "next/image";

import { createPageMetadata } from "@/app/_metadata";
import { contactEmail } from "@/lib/contact";

import styles from "./create-your-own-journey.module.css";
import { Arrow } from "@/components/ui/Arrow";

export const metadata = createPageMetadata("/create-your-own-journey");

const registerHref = `mailto:${contactEmail}?subject=${encodeURIComponent(
  "Please tell me when Create your own journey opens",
)}`;

export default function CreateYourOwnJourneyPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="cyoj-heading">
        <div className={styles.heroCopy}>
          <p>Create your own journey</p>
          <h1 id="cyoj-heading">Yours to shape - anywhere.</h1>
          <p>
            You set where, when and the pace. You build it; we help you, to the
            standard a Caravan is held to. Yours by default - and if you choose,
            we open it to a few members whose Travel Fingerprint fits, so it can arrive
            together.
          </p>
        </div>
        <figure className={styles.heroImage}>
          <Image
            src="/assets/images/create-your-own-journey/hero-anywhere.jpg"
            alt="Painted travel poster: a propeller plane over pink clouds, two pyramids beyond pink dunes, a saguaro cactus, a camel and a pale llama among desert flowers."
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1440px) 55vw, 792px"
            preload
          />
        </figure>
      </section>

      <section className={styles.how} aria-labelledby="cyoj-how-heading">
        <p id="cyoj-how-heading">How it works</p>
        <ol className={styles.steps}>
          <li>
            <span aria-hidden="true">01</span>
            <h2>You set the shape</h2>
            <p>
              Where - anywhere - when, the pace, and whether it is yours alone or
              open to company.
            </p>
          </li>
          <li>
            <span aria-hidden="true">02</span>
            <h2>You build it, we help</h2>
            <p>
              You are the author. We bring how a Sawayatra journey is made - the
              joining points, the rhythm, the care - so yours holds to the
              Caravan standard.
            </p>
          </li>
          <li>
            <span aria-hidden="true">03</span>
            <h2>Open it, if you choose</h2>
            <p>
              We match members whose Travel Fingerprint fits yours. A few may join, and
              you approve who.
            </p>
          </li>
          <li>
            <span aria-hidden="true">04</span>
            <h2>Refine, and go</h2>
            <p>Start a few months ahead. A real journey needs real lead time.</p>
          </li>
        </ol>
      </section>

      <section className={styles.status} aria-labelledby="cyoj-status-heading">
        <p>Not open yet</p>
        <h2 id="cyoj-status-heading">For members, when it is ready.</h2>
        <p>
          We are still working out how to help anyone build a journey to the
          standard a Caravan is held to. That is the only reason it is not open
          yet. Leave your email and we will write to you first.
        </p>
        <a href={registerHref}>Register your interest <Arrow /></a>
      </section>
    </main>
  );
}
