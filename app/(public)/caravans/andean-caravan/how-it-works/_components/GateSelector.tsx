"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ANDEAN_CARAVAN_SEASON } from "@/content/andean-caravan";
import { caravanSections, gateById } from "../_content";
import styles from "./GateSelector.module.css";

const focusableSelector =
  'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function gateFor(id: string) {
  const gate = gateById[id];
  if (!gate) throw new Error(`Unknown Caravan gate: ${id}`);
  return gate;
}

export function GateSelector() {
  const [joinIndex, setJoinIndex] = useState<number | null>(null);
  const [leaveIndex, setLeaveIndex] = useState<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerTriggerRef = useRef<HTMLElement | null>(null);

  const selectedSections = useMemo(() => {
    if (joinIndex === null || leaveIndex === null || leaveIndex < joinIndex) return [];
    return caravanSections.slice(joinIndex, leaveIndex + 1);
  }, [joinIndex, leaveIndex]);

  const selectedDays = selectedSections.reduce((sum, section) => sum + section.days, 0);
  const selectedCountries = Array.from(new Set(selectedSections.flatMap((section) => section.countries)));
  const selectedMaximumAltitude = Math.max(
    ...selectedSections.map((section) => Number(section.maximumAltitude.replace(/[^0-9]/g, ""))),
  );
  const expandedSection = caravanSections.find((section) => section.id === openId);

  function chooseJoin(index: number | null) {
    setJoinIndex(index);
    setLeaveIndex(null);
    setError("");
  }

  function chooseSingle(index: number) {
    if (selectedSections.length && (index < (joinIndex ?? 0) - 1 || index > (leaveIndex ?? 0) + 1)) {
      setError("Those sections do not connect. Choose one continuous run, for example 03–05.");
      document.getElementById("selection-error")?.focus();
      return;
    }
    setJoinIndex(index);
    setLeaveIndex(index);
    setError("");
  }

  function openDrawer(trigger?: HTMLElement) {
    drawerTriggerRef.current = trigger ?? (
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    );
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    window.requestAnimationFrame(() => drawerTriggerRef.current?.focus());
  }

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const trigger = (event as CustomEvent<{ trigger?: HTMLElement }>).detail?.trigger;
      openDrawer(trigger);
    };
    window.addEventListener("sawayatra:open-journey", handleOpen);
    return () => window.removeEventListener("sawayatra:open-journey", handleOpen);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    const first = drawer?.querySelector<HTMLElement>(focusableSelector);
    first?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;
      const firstItem = focusable[0]!;
      const lastItem = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  const joiningGate = joinIndex === null ? null : gateFor(caravanSections[joinIndex]!.joinGateId);
  const leavingGate = leaveIndex === null ? null : gateFor(caravanSections[leaveIndex]!.leaveGateId);

  return (
    <section
      className={styles.root}
      id="find-my-gate"
      tabIndex={-1}
      aria-labelledby="find-my-gate-heading"
      data-dense="true"
    >
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Find my gate</p>
          <h2 id="find-my-gate-heading">Choose where you want to join.</h2>
        </div>
        <p>
          A gate is a designated city where you may join or leave the Caravan.
          Most gates are handover points: one section ends and the next begins.
        </p>
      </header>

      <div className={styles.altitudeAid} aria-labelledby="altitude-aid-heading">
        <div>
          <h3 id="altitude-aid-heading">Which gate suits me?</h3>
          <p>Altitude belongs in the choice, not in the small print.</p>
        </div>
        <div className={styles.altitudeOptions}>
          <button type="button" onClick={() => chooseJoin(0)}>
            <strong>Sea-level start</strong><span>Lima</span>
          </button>
          <button type="button" onClick={() => chooseJoin(1)}>
            <strong>Gentle entry</strong><span>Arequipa or Sucre</span>
          </button>
          <button type="button" onClick={() => chooseJoin(2)}>
            <strong>Already acclimatised</strong><span>Cusco and higher gates</span>
          </button>
        </div>
      </div>

      <div className={styles.gateChoice}>
        <label>
          <span>Joining gate</span>
          <select
            value={joinIndex ?? ""}
            onChange={(event) => chooseJoin(event.target.value === "" ? null : Number(event.target.value))}
          >
            <option value="">Choose a joining gate</option>
            {caravanSections.map((section, index) => (
              <option key={section.id} value={index}>{gateFor(section.joinGateId).name}</option>
            ))}
          </select>
        </label>
        <span className={styles.choiceArrow} aria-hidden="true">→</span>
        <label>
          <span>Leaving gate</span>
          <select
            value={leaveIndex ?? ""}
            disabled={joinIndex === null}
            onChange={(event) => {
              setLeaveIndex(event.target.value === "" ? null : Number(event.target.value));
              setError("");
            }}
          >
            <option value="">Choose a leaving gate</option>
            {caravanSections.map((section, index) => index >= (joinIndex ?? 99) ? (
              <option key={section.id} value={index}>{gateFor(section.leaveGateId).name}</option>
            ) : null)}
          </select>
        </label>
        <Button
          variant="secondary"
          disabled={!selectedSections.length}
          onClick={(event) => openDrawer(event.currentTarget)}
        >
          View journey
        </Button>
      </div>

      {error ? (
        <p className={styles.error} id="selection-error" role="alert" tabIndex={-1}>
          <strong>Choose a continuous run.</strong> {error}
        </p>
      ) : null}

      <div className={styles.selectorLayout}>
        <div className={styles.cards}>
          {caravanSections.map((section, index) => {
            const joinGate = gateFor(section.joinGateId);
            const leaveGate = gateFor(section.leaveGateId);
            const isOpen = openId === section.id;
            const isSelected = selectedSections.some((selected) => selected.id === section.id);
            const panelId = `section-${section.id}-panel`;
            return (
              <article className={styles.card} data-selected={isSelected || undefined} key={section.id}>
                <button
                  className={styles.cardTrigger}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : section.id)}
                >
                  <span className={styles.sectionNumber}>{section.id}</span>
                  <span className={styles.cardMain}>
                    <strong>{section.name}</strong>
                    <span>{joinGate.name} → {leaveGate.name}</span>
                  </span>
                  <span className={styles.cardFacts}>
                    <span>{section.days} days</span>
                    <span>{section.modes}</span>
                    <span>Max {section.maximumAltitude}</span>
                  </span>
                  <span className={styles.cardState}>{isOpen ? "Close" : "Open"}</span>
                </button>
                <p className={styles.physicalNotice}>{section.physicalNotice}</p>

                <div className={styles.panel} id={panelId} hidden={!isOpen}>
                  <div className={styles.gateDetails}>
                    <section>
                      <p className={styles.label}>Joining door</p>
                      <h4>{joinGate.name}</h4>
                      <dl>
                        <div><dt>Opens</dt><dd>{joinGate.opens}</dd></div>
                        {joinGate.closes ? <div><dt>Also closes</dt><dd>{joinGate.closes}</dd></div> : null}
                        <div><dt>Airport</dt><dd>{joinGate.airport}</dd></div>
                        <div><dt>Altitude</dt><dd>{joinGate.altitude}</dd></div>
                      </dl>
                      <p>{joinGate.joiningNote} {joinGate.includedArrival}</p>
                      <p>Your Sawayatra Host meets you before introductions to the group.</p>
                      {joinGate.hostHandover ? <p className={styles.handover}><strong>Host handover.</strong> One Host finishes here and the next begins.</p> : null}
                    </section>
                    <section>
                      <p className={styles.label}>Leaving door</p>
                      <h4>{leaveGate.name}</h4>
                      <dl>
                        <div><dt>Closes</dt><dd>{leaveGate.closes}</dd></div>
                        {leaveGate.opens ? <div><dt>Also opens</dt><dd>{leaveGate.opens}</dd></div> : null}
                        <div><dt>Airport</dt><dd>{leaveGate.airport}</dd></div>
                        <div><dt>Altitude</dt><dd>{leaveGate.altitude}</dd></div>
                      </dl>
                      <p>{leaveGate.joiningNote}</p>
                      {leaveGate.hostHandover ? <p className={styles.handover}><strong>Host handover.</strong> The arriving Host is introduced as the departing Host says goodbye.</p> : null}
                    </section>
                  </div>

                  <div className={styles.truths}>
                    <div><span>Arrival</span><p>{section.arrival}</p></div>
                    <div><span>Comfort</span><p>{section.accommodation}</p></div>
                    <div><span>Before you choose</span><p>{section.physicalNotice}</p></div>
                  </div>

                  <section className={styles.ledger} aria-labelledby={`ledger-${section.id}`}>
                    <h4 id={`ledger-${section.id}`}>How the ground unfolds</h4>
                    <p>Four short flights in 71 days; everything else road, rail or water.</p>
                    <ol>
                      {section.legs.map((leg) => (
                        <li key={`${section.id}-${leg.route}`}>
                          <strong>{leg.route}</strong>
                          <span>{leg.mode}</span>
                          <span>{leg.surface}</span>
                          {leg.note ? <small>{leg.note}</small> : null}
                        </li>
                      ))}
                    </ol>
                  </section>

                  <div className={styles.cardAction}>
                    <p>{section.promise}</p>
                    <Button variant={isSelected ? "secondary" : "primary"} onClick={() => chooseSingle(index)}>
                      {isSelected && selectedSections.length === 1 ? "Selected" : "Choose this section"}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className={styles.dynamicImage} aria-live="polite">
          {expandedSection ? (
            <>
              <div className={styles.imageFrame}>
                <Image
                  src={expandedSection.image.src}
                  alt={expandedSection.image.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 38vw"
                  style={{ objectPosition: `${expandedSection.image.focalPoint?.x ?? 50}% ${expandedSection.image.focalPoint?.y ?? 50}%` }}
                />
              </div>
              <p><span>{expandedSection.id}</span> {expandedSection.name}</p>
            </>
          ) : (
            <div className={styles.imageRest}>
              <p>Open a section to see one operational view from that part of the route.</p>
            </div>
          )}
        </aside>
      </div>

      {drawerOpen ? (
        <div className={styles.drawerBackdrop}>
          <div
            ref={drawerRef}
            className={styles.drawer}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${drawerId}-title`}
          >
            <header className={styles.drawerHeader}>
              <div><p>Your Caravan</p><h2 id={`${drawerId}-title`}>{selectedSections.length ? "Between your doors." : "Choose your doors."}</h2></div>
              <button type="button" onClick={closeDrawer}>Close</button>
            </header>
            <div className={styles.drawerBody}>
              {selectedSections.length ? (
                <>
                  <ol className={styles.selectedList}>
                    {selectedSections.length === caravanSections.length ? (
                      <li><span>Complete Caravan</span><strong>Lima → Balmaceda</strong></li>
                    ) : selectedSections.map((section) => (
                      <li key={section.id}><span>{section.id} · {section.name}</span><strong>{gateFor(section.joinGateId).name} → {gateFor(section.leaveGateId).name}</strong></li>
                    ))}
                  </ol>
                  <dl className={styles.drawerFacts}>
                    <div><dt>Joining gate</dt><dd>{joiningGate?.name}</dd></div>
                    <div><dt>Leaving gate</dt><dd>{leavingGate?.name}</dd></div>
                    <div><dt>Duration</dt><dd>{selectedDays} days</dd></div>
                    <div><dt>Departure</dt><dd>{selectedSections.length === caravanSections.length ? "Complete Caravan" : "Caravan sections"}</dd></div>
                    <div><dt>Window</dt><dd>{ANDEAN_CARAVAN_SEASON}</dd></div>
                    <div><dt>Countries</dt><dd>{selectedCountries.join(" · ")}</dd></div>
                    <div><dt>Maximum altitude</dt><dd>{selectedMaximumAltitude.toLocaleString("en-US")} m</dd></div>
                    <div><dt>Price</dt><dd>Price on request</dd></div>
                  </dl>
                  <div className={styles.drawerNotices}>
                    {selectedSections.map((section) => <p key={section.id}><strong>{section.name}:</strong> {section.physicalNotice}</p>)}
                  </div>
                  <p className={styles.enquiryNote}>Before an enquiry can be submitted, Sawayatra’s Before You Book guidance and live enquiry route must be approved.</p>
                  <Button variant="secondary" onClick={() => { setJoinIndex(null); setLeaveIndex(null); closeDrawer(); }}>Clear selection</Button>
                </>
              ) : (
                <>
                  <p>Choose a joining gate and a leaving gate. Your continuous sections will appear here.</p>
                  <Button onClick={closeDrawer}>Choose my gates</Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
