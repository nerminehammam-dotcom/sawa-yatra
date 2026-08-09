"use client";
import { Arrow } from "@/components/ui/Arrow";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { andeanDestinationDetails } from "@/content/andean-caravan-destinations";
import {
  andeanMapCountries,
  andeanMapViewBox,
} from "@/content/andean-map-geometry";
import { andeanCaravanRouteStops } from "@/content/andean-caravan-route";

import styles from "./CaravanRouteMap.module.css";

interface StopPosition extends CSSProperties {
  "--stop-x": string;
  "--stop-y": string;
}

interface MapCanvasStyle extends CSSProperties {
  "--map-zoom": number;
  "--map-origin-x": string;
  "--map-origin-y": string;
}

const zoomLevels = [1, 1.35, 1.7] as const;
const zoomLabels = ["Overview", "Closer", "Closest"] as const;

const routePoints = andeanCaravanRouteStops
  .map((stop) => `${stop.x * 7.8},${stop.y * 10}`)
  .join(" ");

export function CaravanRouteMap() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const detailPanelRef = useRef<HTMLElement>(null);
  const activeStop = andeanCaravanRouteStops[activeIndex];
  const activeDetail = activeStop
    ? andeanDestinationDetails[activeStop.id]
    : undefined;
  const nextIndex = (activeIndex + 1) % andeanCaravanRouteStops.length;
  const nextStop = andeanCaravanRouteStops[nextIndex];
  const mapZoom = zoomLevels[zoomIndex] ?? zoomLevels[0];
  const progress = Math.round(
    (activeIndex / (andeanCaravanRouteStops.length - 1)) * 100,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      const allowed = !mediaQuery.matches;
      setMotionAllowed(allowed);
      if (!allowed) setIsPlaying(false);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!motionAllowed || !isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % andeanCaravanRouteStops.length,
      );
    }, 7000);

    return () => window.clearInterval(timer);
  }, [isPlaying, motionAllowed]);

  if (!activeStop || !activeDetail || !nextStop) return null;

  const chooseStop = (index: number) => {
    setActiveIndex(index);
    setIsPlaying(false);

    if (window.matchMedia("(max-width: 767px)").matches) {
      window.requestAnimationFrame(() => {
        detailPanelRef.current?.scrollIntoView({
          behavior: motionAllowed ? "smooth" : "auto",
          block: "start",
        });
      });
    }
  };

  const moveBy = (direction: -1 | 1) => {
    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0) return andeanCaravanRouteStops.length - 1;
      return next % andeanCaravanRouteStops.length;
    });
    setIsPlaying(false);
  };

  const zoomIn = () => {
    setZoomIndex((current) => Math.min(current + 1, zoomLevels.length - 1));
    setIsPlaying(false);
  };

  const zoomOut = () => {
    setZoomIndex((current) => Math.max(current - 1, 0));
    setIsPlaying(false);
  };

  const canvasStyle: MapCanvasStyle = {
    "--map-zoom": mapZoom,
    "--map-origin-x": `${activeStop.x}%`,
    "--map-origin-y": `${activeStop.y}%`,
  };

  return (
    <section className={styles.root} aria-labelledby="caravan-route-map-heading">
      <header className={styles.heading}>
        <p className={styles.kicker}>The illustrated route</p>
        <h3 id="caravan-route-map-heading">Follow the Andes south.</h3>
        <p>
          Peru, Bolivia and Chile are shown in their real geographic shapes.
          Zoom closer or choose any numbered stop to open its destination story.
        </p>
      </header>

      <div className={styles.mapShell}>
        <div
          className={styles.mapStage}
          aria-label="Illustrated geographic map of the Andean Caravan route through Peru, Bolivia and Chile"
        >
          <div className={styles.zoomControls} aria-label="Map zoom controls">
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoomIndex === 0}
              aria-label="Show a wider map view"
            >
              <span aria-hidden="true">−</span>
            </button>
            <span aria-live="polite">{zoomLabels[zoomIndex]}</span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={zoomIndex === zoomLevels.length - 1}
              aria-label="Show a closer map view"
            >
              <span aria-hidden="true">+</span>
            </button>
            {zoomIndex > 0 ? (
              <button
                type="button"
                className={styles.resetZoom}
                onClick={() => setZoomIndex(0)}
              >
                Overview
              </button>
            ) : null}
          </div>

          <div className={styles.mapCanvas} style={canvasStyle}>
          <svg
            className={styles.landscape}
            viewBox={andeanMapViewBox}
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="paper-wobble" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.018"
                  numOctaves="2"
                  seed="7"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="1.35"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>

            <g className={styles.oceanMarks}>
              <path d="M35 360 q24 -18 48 0 t48 0" />
              <path d="M48 382 q24 -18 48 0 t48 0" />
              <path d="M57 404 q24 -18 48 0 t48 0" />
              <circle cx="90" cy="280" r="24" />
              <path d="M90 239 v-25 M90 346 v25 M49 280 H24 M131 280 h25 M61 251 l-18 -18 M119 309 l18 18 M119 251 l18 -18 M61 309 l-18 18" />
            </g>

            <g className={styles.countryShapes} filter="url(#paper-wobble)">
              {andeanMapCountries.map((country) => (
                <path
                  key={country.id}
                  className={styles[country.id]}
                  d={country.path}
                  fillRule="evenodd"
                />
              ))}
            </g>

            <g className={styles.countryLabels}>
              {andeanMapCountries.map((country) => (
                <text
                  key={country.id}
                  x={country.label.x}
                  y={country.label.y}
                  transform={country.id === "chile" ? `rotate(-77 ${country.label.x} ${country.label.y})` : undefined}
                >
                  {country.name}
                </text>
              ))}
            </g>

            <g className={styles.mountainChain}>
              <path d="M326 96 l28 -38 27 38 20 -27 31 42" />
              <path d="M410 350 l24 -31 20 31 16 -20 22 28" />
              <path d="M302 825 l32 -43 30 43 25 -31 33 44" />
            </g>

            <g className={styles.lakeIllustration}>
              <path d="M397 292 c18 -13 44 -12 56 2 c-8 17 -41 23 -56 -2 Z" />
              <path d="M419 291 l9 -15 10 15 Z M428 276 v25" />
            </g>

            <g className={styles.saltIllustration}>
              <path d="M568 354 l42 -20 43 20 -43 21 Z M568 354 l42 23 43 -23 M610 334 v43" />
              <circle cx="610" cy="329" r="6" />
            </g>

            <g className={styles.desertIllustration}>
              <path d="M474 438 q38 -24 77 0 q31 -18 62 1" />
              <path d="M520 424 v-18 M511 415 h18 M571 443 v-16 M563 435 h16" />
            </g>

            <g className={styles.patagoniaIllustration}>
              <path d="M165 845 l18 -32 18 32 Z M205 875 l18 -38 19 38 Z M496 864 l20 -36 19 36 Z" />
              <path d="M120 914 q28 -18 56 0 t56 0 M520 930 q25 -17 50 0 t50 0" />
            </g>

            <g className={styles.condorIllustration}>
              <path d="M109 67 q31 -31 64 -3 q32 -28 67 4 q-40 -12 -65 16 q-25 -28 -66 -17 Z" />
              <circle cx="175" cy="82" r="5" />
            </g>

            <g className={styles.llamaIllustration}>
              <path d="M687 422 v-43 l10 -13 l10 14 v42 h17 l6 39 h-12 l-3 -25 h-23 l-3 25 h-12 l5 -39 Z" />
              <path d="M693 374 l-9 -13 M701 374 l11 -12" />
              <circle cx="700" cy="383" r="2.5" />
            </g>

            <g className={styles.vanIllustration}>
              <path d="M468 752 h54 l18 20 v29 h-78 v-39 Z" />
              <path d="M478 760 h32 v17 h-36 Z M516 760 l16 17 h-16 Z" />
              <circle cx="480" cy="803" r="9" />
              <circle cx="523" cy="803" r="9" />
            </g>

            <path className={styles.flightArc} d="M369.7 599 C490 660 468 765 339.3 816" />
            <g className={styles.plane}>
              <path d="M0 -11 L5 -3 L19 0 L5 3 L0 11 L-3 11 L-1 3 L-9 5 L-12 2 L-3 0 L-12 -2 L-9 -5 L-1 -3 L-3 -11 Z" />
            </g>

            <polyline className={styles.routeShadow} points={routePoints} />
            <polyline className={styles.route} points={routePoints} />

            <g className={styles.mapCaptions}>
              <text x="34" y="450">Pacific Ocean</text>
              <text x="488" y="289">Lake Titicaca</text>
              <text x="604" y="397">Salt flats</text>
              <text x="540" y="476">Atacama</text>
              <text x="515" y="900">Patagonia</text>
            </g>
          </svg>

          <ol className={styles.stops}>
            {andeanCaravanRouteStops.map((stop, index) => {
              const stopStyle: StopPosition = {
                "--stop-x": `${stop.x}%`,
                "--stop-y": `${stop.y}%`,
              };
              const isActive = activeIndex === index;

              return (
                <li
                  key={stop.id}
                  className={`${styles.stop} ${styles[stop.labelSide]}`}
                  style={stopStyle}
                  data-country={stop.country.toLowerCase()}
                >
                  <button
                    type="button"
                    className={styles.stopButton}
                    aria-label={`Stop ${index + 1}: ${stop.name}, ${stop.country}`}
                    aria-pressed={isActive}
                    data-route-stop={stop.id}
                    onClick={() => chooseStop(index)}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                  <span
                    className={`${styles.stopLabel} ${isActive ? styles.stopLabelActive : ""}`}
                    aria-hidden="true"
                  >
                    {"mapLabel" in stop ? stop.mapLabel : stop.name}
                  </span>
                </li>
              );
            })}
          </ol>

          <span
            className={styles.traveller}
            aria-hidden="true"
            style={
              {
                "--stop-x": `${activeStop.x}%`,
                "--stop-y": `${activeStop.y}%`,
              } as StopPosition
            }
          >
            <span />
          </span>
          </div>
        </div>

        <aside
          ref={detailPanelRef}
          className={styles.routeLog}
          aria-label="Selected route stop"
          data-country={activeStop.country.toLowerCase()}
        >
          <div key={activeStop.id} className={styles.destinationCard}>
            <figure className={styles.destinationPhoto}>
              <Image
                src={activeDetail.image.src}
                alt={activeDetail.image.alt}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                style={{
                  objectPosition: `${activeDetail.image.focalPoint.x}% ${activeDetail.image.focalPoint.y}%`,
                }}
              />
              <figcaption>{activeDetail.image.caption}</figcaption>
            </figure>

            <div className={styles.destinationBody}>
              <p className={styles.stopCount}>
                Stop {String(activeIndex + 1).padStart(2, "0")} of {andeanCaravanRouteStops.length}
              </p>
              <p className={styles.activeName}>{activeDetail.shortName}</p>
              <p className={styles.country}>{activeStop.country}</p>
              <p className={styles.introduction}>{activeDetail.introduction}</p>

              <dl className={styles.quickFacts}>
                <div>
                  <dt>Altitude</dt>
                  <dd>
                    <span className={styles.quickFactValue}>
                      {activeDetail.altitude}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Population</dt>
                  <dd>
                    <span className={styles.quickFactValue}>
                      {activeDetail.population}
                    </span>
                    <small>{activeDetail.populationContext}</small>
                  </dd>
                </div>
              </dl>

              <div className={styles.orientation}>
                <p>Around the stop</p>
                <ul>
                  {activeDetail.orientation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={styles.nextStop}
                onClick={() => moveBy(1)}
              >
                <span>Next stop</span>
                <strong>
                  {String(nextIndex + 1).padStart(2, "0")} · {"mapLabel" in nextStop ? nextStop.mapLabel : nextStop.name}
                </strong>
                <Arrow />
              </button>

              <div className={styles.progressGroup}>
                <div className={styles.progressLabel}>
                  <span>Route progress</span>
                  <span>{progress}%</span>
                </div>
                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-label="Progress along the illustrated route"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className={styles.controls}>
                <button type="button" onClick={() => moveBy(-1)} aria-label="Previous stop">
                  <Arrow direction="left" />
                </button>
                {motionAllowed ? (
                  <button
                    type="button"
                    className={styles.playButton}
                    onClick={() => setIsPlaying((current) => !current)}
                    aria-pressed={isPlaying}
                  >
                    {isPlaying ? "Pause route" : "Play route"}
                  </button>
                ) : (
                  <span className={styles.motionNote}>Manual route</span>
                )}
                <button type="button" onClick={() => moveBy(1)} aria-label="Next stop">
                  <Arrow />
                </button>
              </div>

              <p className={styles.mapNote}>
                Geographic orientation only; these are not confirmed itinerary
                inclusions. Altitude is approximate. Population definitions and
                census years are shown with each figure. <a href={activeDetail.source.href} target="_blank" rel="noreferrer">{activeDetail.source.label} source</a>.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
