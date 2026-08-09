import { FounderCopy } from "@/components/caravan/FounderCopy";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { andeanCaravanHeroImage, getAndeanCaravanGallery } from "@/content/andean-caravan-images";
import { getMirrorSpecimenData } from "@/content/caravan/specimen";

import styles from "./the-mirror.module.css";

const effortHeight = { Light: "34%", Steady: "62%", Demanding: "100%" } as const;
const stageSlots = { "03-a": "stageA", "03-b": "stageB", "03-c": "stageC" } as const;
const stagePlaces = {
  "03-a": ["Sucre", "Maragua", "Potosí", "Uyuni"],
  "03-b": ["Salar de Uyuni", "Coquesa / Tahua", "Lagunas", "Hito Cajón"],
  "03-c": ["San Pedro de Atacama", "Toconao", "Calama", "Santiago"],
} as const;

export default function MirrorPhaseThreePreview() {
  const data = getMirrorSpecimenData();
  const gallery = getAndeanCaravanGallery("the-mirror");
  const heroImage = gallery[0] ?? andeanCaravanHeroImage;
  const exception = data.section.exception;

  return (
    <main className={styles.page}>
      <p className={styles.previewBar}>Phase 3 founder-review specimen · Section 03 · mandatory disclosure order is under review</p>

      <section className={styles.hero} aria-labelledby="mirror-heading">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{data.section.number} · {data.section.gateFrom} to {data.section.gateTo}</p>
          <h1 id="mirror-heading" className={styles.heroTitle}>{data.section.name}</h1>
          <FounderCopy slot={data.slots.hero} />
        </div>
        <div className={styles.heroImage}>
          <RisoArtwork asset={heroImage} aspectRatio="auto" sizes="(max-width: 760px) 100vw, 60vw" priority />
          <div className={styles.caption}><FounderCopy slot={data.slots.caption} /></div>
        </div>
      </section>

      <dl className={styles.factStrip}>
        <div className={styles.fact}><dt>Route</dt><dd>{data.section.gateFrom} → {data.section.gateTo}</dd></div>
        <div className={styles.fact}><dt>Duration</dt><dd>{data.section.days} days · Days {data.section.dayStart}–{data.section.dayEnd}</dd></div>
        <div className={styles.fact}><dt>Group maximum</dt><dd>{data.section.groupMax}</dd></div>
        <div className={styles.fact}><dt>Route maximum</dt><dd>{data.section.routeMaximum}</dd></div>
        <div className={styles.fact}><dt>Season</dt><dd>{data.section.season}</dd></div>
      </dl>

      <section className={styles.disclosure} aria-labelledby="exception-heading">
        <p className={styles.eyebrow}>Read before exploring this section</p>
        <h2 id="exception-heading">Declared Load Exception.</h2>
        <FounderCopy slot={data.slots.framing} />
        {exception ? (
          <>
            <p className={styles.lockedText}>{exception.disclosure.text}</p>
            <p className={styles.lockedText}>{exception.structural_reason.text}</p>
          </>
        ) : null}
        <dl className={styles.ladder} aria-label="Eleven-night acclimatisation ladder">
          {data.ladder.map((night) => (
            <div key={night.day} className={styles.night}>
              <dt>Night {night.night}</dt>
              <dd>{night.sleep}<br /><span className={night.altitude ? undefined : styles.pending}>{night.altitude ?? "Altitude pending contract"}</span></dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="shape-heading">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Shape of Journey</p>
          <h2 id="shape-heading">Effort, environment and recovery remain separate.</h2>
          <div className={styles.shapeLegend}><span>Height = effort</span><span>Pattern = operating environment</span><span>◇ = protected shoulder or recovery role</span></div>
        </header>
        <div className={styles.shape} role="img" aria-label="Eighteen daily effort columns for The Mirror, with separate patterns for operating environment and diamond markers for protected days">
          {data.days.map((day) => (
            <div
              key={day.day}
              className={styles.shapeDay}
              data-environment={day.operating_environment}
              data-protected={day.protected_marker || day.recovery_role.some((role) => role !== "Normal")}
              style={{ "--effort-height": effortHeight[day.effort_level] } as React.CSSProperties}
              title={`Day ${day.day}: ${day.effort_level}; ${day.operating_environment}; ${day.recovery_role.join(", ")}`}
            >
              <b>{day.day}</b><small>{day.effort_level}</small>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="level-two-heading">
        <header className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Level 2 · Section map</p>
          <h2 id="level-two-heading">Three stages from Sucre to Santiago.</h2>
          <p className={styles.sectionLede}>Principal places and movement modes are visible without turning every day into a pin. The scheduled flight remains distinct from road geometry.</p>
        </header>
        <div className={styles.routeMap}>
          {data.stages.map((stage) => (
            <article key={stage.id} className={styles.stageMap}>
              <p className={styles.eyebrow}>Days {stage.day_start}–{stage.day_end}</p>
              <h3>{stage.name}</h3>
              <ul className={styles.placeList}>{stagePlaces[stage.id as keyof typeof stagePlaces].map((place) => <li key={place}>{place}</li>)}</ul>
              <p className={`${styles.mode} ${stage.id === "03-c" ? styles.flight : ""}`}>
                {stage.id === "03-a" ? "Road" : stage.id === "03-b" ? "4×4 convoy · border crossed on foot" : "Road, then scheduled flight: Calama ✈ Santiago"}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="character-heading">
        <div className={styles.editorialGrid}>
          <header className={styles.sectionHeader}><p className={styles.eyebrow}>Character</p><h2 id="character-heading">Founder voice enters after the facts.</h2></header>
          <FounderCopy slot={data.slots.editorial} />
        </div>
        <aside className={styles.demands} aria-label="What this section asks of travellers">
          <h3>What this section asks of you</h3>
          {data.section.demands.map((demand) => <p key={demand}>{demand}</p>)}
        </aside>
      </section>

      <section className={styles.section} aria-labelledby="itinerary-heading">
        <header className={styles.sectionHeader}><p className={styles.eyebrow}>Stage-first itinerary</p><h2 id="itinerary-heading">Scan three stages. Open days when needed.</h2></header>
        <div className={styles.stages}>
          {data.stages.map((stage) => {
            const days = data.days.filter((day) => day.stage_id === stage.id);
            const slot = data.slots[stageSlots[stage.id as keyof typeof stageSlots]];
            return (
              <details key={stage.id} id={stage.anchor} className={styles.stage} open={stage.id === "03-b"}>
                <summary><span className={styles.eyebrow}>{stage.id.toUpperCase()}</span><span className={styles.stageName}>{stage.name}</span><span className={styles.stageDays}>Days {stage.day_start}–{stage.day_end}</span></summary>
                <div className={styles.stageBody}>
                  <FounderCopy slot={slot} />
                  {stage.id === "03-b" ? (
                    <div className={styles.dayGrid}>
                      {days.map((day) => (
                        <article key={day.day} className={styles.dayCard}>
                          <p className={styles.dayMeta}>Day {day.day} · {day.effort_level} · {day.operating_environment}</p>
                          <h3>{day.title}</h3>
                          <p className={styles.dayMeta}>{day.route}<br />Sleep: {day.sleep}{day.sleep_altitude.display ? ` · ${day.sleep_altitude.display}` : " · altitude pending contract"}<br />{day.movement}</p>
                          <p className={styles.dayText}>{day.description.text}</p>
                          {day.free_time ? <p className={styles.dayNote}>{day.free_time.text}</p> : null}
                          {day.conditional_items.map((item) => <p key={item.label} className={styles.dayNote}><strong>{item.label}</strong><br />{item.text}</p>)}
                        </article>
                      ))}
                    </div>
                  ) : <p className={styles.dayMeta}>Day cards remain collapsed in this specimen. Stage B demonstrates the expanded-day treatment.</p>}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="places-heading">
        <header className={styles.sectionHeader}><p className={styles.eyebrow}>Places and people</p><h2 id="places-heading">Photography stays close to the route.</h2><FounderCopy slot={data.slots.places} /></header>
        <div className={styles.gallery}>{gallery.slice(1, 3).map((asset) => <RisoArtwork key={asset.src} asset={asset} aspectRatio="auto" sizes="(max-width: 760px) 100vw, 50vw" />)}</div>
      </section>

      <section className={styles.section} aria-labelledby="practical-heading">
        <header className={styles.sectionHeader}><p className={styles.eyebrow}>Before you ask</p><h2 id="practical-heading">Travel, sleep and joining.</h2></header>
        <div className={styles.practicalGrid}>
          <article className={styles.practical}><h3>Travel</h3><p>Road, 4×4 convoy, a border crossed on foot and a scheduled Calama to Santiago flight. Movement times keep their declared basis.</p></article>
          <article className={styles.practical}><h3>Sleep</h3><p>{data.section.sleepStandard}</p></article>
          <article className={styles.practical}><h3>Joining</h3><p>{data.section.joinRule}</p></article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ask-heading">
        <header className={styles.sectionHeader}><p className={styles.eyebrow}>Ask</p><h2 id="ask-heading">After the disclosure.</h2><FounderCopy slot={data.slots.enquiry} /></header>
        <div className={styles.withheld}><p>[ENQUIRY ACTION WITHHELD · LB-01 · delivery configuration remains a launch blocker]</p></div>
      </section>
    </main>
  );
}
