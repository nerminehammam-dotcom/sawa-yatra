"use client";
import { Arrow } from "@/components/ui/Arrow";

import Image from "next/image";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { andeanDestinationDetails } from "@/content/andean-caravan-destinations";
import {
  andeanMapCountries,
  andeanMapViewBox,
} from "@/content/andean-map-geometry";
import { andeanCaravanRouteStops } from "@/content/andean-caravan-route";
import { joiningPoints } from "@/content/field-document";

import styles from "./CaravanRouteMap.module.css";

interface StopPosition extends CSSProperties {
  "--stop-x": string;
  "--stop-y": string;
  "--marker-shift-x": string;
  "--marker-shift-y": string;
  "--leader-length": string;
  "--leader-angle": string;
}

interface MapCanvasStyle extends CSSProperties {
  "--map-zoom": number;
  "--map-origin-x": string;
  "--map-origin-y": string;
}

type RouteRole = "join" | "leave" | "join-leave" | "neutral";

const zoomLevels = [1, 1.35, 1.7] as const;
const zoomLabels = ["Overview", "Closer", "Closest"] as const;

const projectRoute = (
  stops: readonly (typeof andeanCaravanRouteStops)[number][],
) => stops.map((stop) => `${stop.x * 7.8},${stop.y * 10}`).join(" ");

const northernRoadStops = andeanCaravanRouteStops.slice(0, 9);
const southernRoadStops = andeanCaravanRouteStops.slice(9);
const northernRoadPoints = projectRoute(northernRoadStops);
const southernRoadPoints = projectRoute(southernRoadStops);

const exactJoiningNames = new Set(
  joiningPoints.map((point) => point.place.trim().toLocaleLowerCase("en")),
);
const exactLeavingNames = new Set(
  joiningPoints.map((point) => point.leaveAt.trim().toLocaleLowerCase("en")),
);

const markerShifts: Partial<
  Record<(typeof andeanCaravanRouteStops)[number]["id"], { x: number; y: number }>
> = {
  arequipa: { x: -8, y: 8 },
  cusco: { x: -12, y: -13 },
  titicaca: { x: 12, y: -11 },
  "la-paz": { x: 16, y: 14 },
  sucre: { x: 28, y: -10 },
  uyuni: { x: -18, y: 22 },
  "balmaceda-airport": { x: 60, y: -35 },
  coyhaique: { x: -50, y: -5 },
  "villa-ohiggins": { x: -45, y: 28 },
  balmaceda: { x: 60, y: 36 },
};

function routeRoleFor(stopName: string): RouteRole {
  const exactName = stopName.trim().toLocaleLowerCase("en");
  const isJoin = exactJoiningNames.has(exactName);
  const isLeave = exactLeavingNames.has(exactName);

  if (isJoin && isLeave) return "join-leave";
  if (isJoin) return "join";
  if (isLeave) return "leave";
  return "neutral";
}

function stopStyleFor(
  stop: (typeof andeanCaravanRouteStops)[number],
): StopPosition {
  const shift = markerShifts[stop.id] ?? { x: 0, y: 0 };
  const length = Math.hypot(shift.x, shift.y);
  const angle = Math.atan2(-shift.y, -shift.x) * (180 / Math.PI);

  return {
    "--stop-x": `${stop.x}%`,
    "--stop-y": `${stop.y}%`,
    "--marker-shift-x": `${shift.x}px`,
    "--marker-shift-y": `${shift.y}px`,
    "--leader-length": `${length}px`,
    "--leader-angle": `${angle.toFixed(6)}deg`,
  };
}

/**
 * The map's own heading was a hard-coded h3. That is correct on /caravans and
 * /departures, where an h2 precedes it, but on /caravans/andean/route-map and
 * /caravans/andean-caravan/how-it-works it followed the h1 directly and skipped
 * a level. The level is now the caller's to state; the default preserves the
 * existing behaviour everywhere it was already right.
 */
interface CaravanRouteMapProps {
  headingLevel?: 2 | 3;
}

export function CaravanRouteMap({ headingLevel = 3 }: CaravanRouteMapProps = {}) {
  const MapHeading = `h${headingLevel}` as const;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const detailPanelRef = useRef<HTMLElement>(null);
  const stopButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
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
  const completedNorthernPoints = projectRoute(
    northernRoadStops.slice(0, Math.min(activeIndex + 1, northernRoadStops.length)),
  );
  const completedSouthernPoints =
    activeIndex < 9
      ? ""
      : projectRoute(southernRoadStops.slice(0, activeIndex - 8));

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

  const handleStopKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let destinationIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      destinationIndex = (index + 1) % andeanCaravanRouteStops.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      destinationIndex =
        (index - 1 + andeanCaravanRouteStops.length) %
        andeanCaravanRouteStops.length;
    } else if (event.key === "Home") {
      destinationIndex = 0;
    } else if (event.key === "End") {
      destinationIndex = andeanCaravanRouteStops.length - 1;
    }

    if (destinationIndex === undefined) return;

    event.preventDefault();
    setActiveIndex(destinationIndex);
    setIsPlaying(false);
    stopButtonRefs.current[destinationIndex]?.focus();
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
        <MapHeading id="caravan-route-map-heading">
          Follow the Andes south.
        </MapHeading>
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
                <filter
                  id="caravans-paper-wobble"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
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

              <g
                className={styles.countryShapes}
                filter="url(#caravans-paper-wobble)"
              >
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
                    transform={
                      country.id === "chile"
                        ? `rotate(-77 ${country.label.x} ${country.label.y})`
                        : undefined
                    }
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

              <path
                className={styles.flightShadow}
                d="M369.7 599 C490 660 468 765 339.3 816"
              />
              <path
                className={`${styles.flightArc} ${activeIndex >= 9 ? styles.flightArcActive : ""}`}
                d="M369.7 599 C490 660 468 765 339.3 816"
              />
              <g className={styles.plane}>
                <path d="M0 -11 L5 -3 L19 0 L5 3 L0 11 L-3 11 L-1 3 L-9 5 L-12 2 L-3 0 L-12 -2 L-9 -5 L-1 -3 L-3 -11 Z" />
              </g>

              <polyline className={styles.routeShadow} points={northernRoadPoints} />
              <polyline className={styles.routeShadow} points={southernRoadPoints} />
              <polyline className={styles.routeUpcoming} points={northernRoadPoints} />
              <polyline className={styles.routeUpcoming} points={southernRoadPoints} />
              {completedNorthernPoints ? (
                <polyline
                  className={styles.routeProgress}
                  points={completedNorthernPoints}
                />
              ) : null}
              {completedSouthernPoints ? (
                <polyline
                  className={styles.routeProgress}
                  points={completedSouthernPoints}
                />
              ) : null}

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
                const isActive = activeIndex === index;
                const routeRole = routeRoleFor(stop.name);

                return (
                  <li
                    key={stop.id}
                    className={`${styles.stop} ${styles[stop.labelSide]} ${isActive ? styles.activeStop : ""}`}
                    style={stopStyleFor(stop)}
                    data-country={stop.country.toLowerCase()}
                    data-route-id={stop.id}
                    data-route-role={routeRole}
                  >
                    <button
                      ref={(element) => {
                        stopButtonRefs.current[index] = element;
                      }}
                      type="button"
                      className={styles.stopButton}
                      aria-label={`Stop ${index + 1}: ${stop.name}, ${stop.country}`}
                      aria-pressed={isActive}
                      aria-controls="caravans-route-stop-details"
                      data-route-stop={stop.id}
                      onClick={() => chooseStop(index)}
                      onKeyDown={(event) => handleStopKeyDown(event, index)}
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
                  "--marker-shift-x": "0px",
                  "--marker-shift-y": "0px",
                  "--leader-length": "0px",
                  "--leader-angle": "0deg",
                } as StopPosition
              }
            >
              <span key={activeStop.id} />
            </span>
          </div>
        </div>

        <aside
          id="caravans-route-stop-details"
          ref={detailPanelRef}
          className={styles.routeLog}
          aria-label="Selected route stop"
          data-country={activeStop.country.toLowerCase()}
          tabIndex={-1}
        >
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Selected stop: {activeDetail.shortName}, {activeStop.country}.
          </p>
          <div key={activeStop.id} className={styles.destinationCard}>
            <figure className={styles.destinationPhoto}>
              <Image
                src={activeDetail.image.src}
                alt={activeDetail.image.alt}
                fill
                sizes="(min-width: 1051px) 38vw, (min-width: 768px) 45vw, 100vw"
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
                  <span aria-hidden="true">←</span>
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
