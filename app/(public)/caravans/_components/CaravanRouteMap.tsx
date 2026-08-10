"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, KeyboardEvent } from "react";
import { useId, useRef, useState } from "react";

import { Arrow } from "@/components/ui/Arrow";
import {
  andeanMapCountries,
  andeanMapViewBox,
} from "@/content/andean-map-geometry";
import {
  andeanCaravanMapChapters,
  type AndeanCaravanMapChapterId,
} from "@/content/andean-caravan-map";
import {
  andeanCaravanAtlasStops as andeanCaravanRouteStops,
  andeanCaravanRouteSegments,
  type AndeanCaravanRouteSegment,
  type AndeanCaravanTransportMode,
} from "@/content/andean-caravan-route";

import styles from "./CaravanRouteMap.module.css";

interface CaravanRouteMapProps {
  currentChapterId?: AndeanCaravanMapChapterId;
  headingLevel?: 2 | 3;
  initialChapterId?: AndeanCaravanMapChapterId;
}

type MapChapter = (typeof andeanCaravanMapChapters)[number];
type RouteStop = (typeof andeanCaravanRouteStops)[number];
type RouteSegment = AndeanCaravanRouteSegment;
type RouteStopId = RouteStop["id"];

interface MapPoint {
  readonly x: number;
  readonly y: number;
}

const labelPlacement: Partial<
  Record<
    RouteStopId,
    { readonly dx: number; readonly dy: number; readonly anchor: "start" | "end" }
  >
> = {
  lima: { dx: -15, dy: -15, anchor: "end" },
  paracas: { dx: -13, dy: 21, anchor: "end" },
  nazca: { dx: -14, dy: 23, anchor: "end" },
  arequipa: { dx: -14, dy: 24, anchor: "end" },
  colca: { dx: 16, dy: -15, anchor: "start" },
  cusco: { dx: 17, dy: -18, anchor: "start" },
  "sacred-valley": { dx: 16, dy: 22, anchor: "start" },
  "machu-picchu": { dx: -16, dy: -15, anchor: "end" },
  puno: { dx: -17, dy: 23, anchor: "end" },
  copacabana: { dx: 16, dy: 22, anchor: "start" },
  "isla-del-sol": { dx: -16, dy: -15, anchor: "end" },
  "la-paz": { dx: 17, dy: 22, anchor: "start" },
  coroico: { dx: 16, dy: -15, anchor: "start" },
  sucre: { dx: 21, dy: -18, anchor: "start" },
  potosi: { dx: -18, dy: -17, anchor: "end" },
  uyuni: { dx: -16, dy: 23, anchor: "end" },
  "san-pedro": { dx: 18, dy: 24, anchor: "start" },
  calama: { dx: -16, dy: -14, anchor: "end" },
  santiago: { dx: -17, dy: -15, anchor: "end" },
  coyhaique: { dx: -27, dy: -28, anchor: "end" },
  "rio-tranquilo": { dx: -25, dy: -4, anchor: "end" },
  cochrane: { dx: 28, dy: 35, anchor: "start" },
  tortel: { dx: -34, dy: 23, anchor: "end" },
  "villa-ohiggins": { dx: -24, dy: 45, anchor: "end" },
  "puerto-guadal": { dx: 17, dy: -15, anchor: "start" },
  "chile-chico": { dx: 29, dy: -24, anchor: "start" },
  "puerto-ibanez": { dx: 18, dy: 21, anchor: "start" },
  balmaceda: { dx: 29, dy: 19, anchor: "start" },
};

const patagoniaLabelPlacement: Partial<
  Record<
    RouteStopId,
    { readonly dx: number; readonly dy: number; readonly anchor: "start" | "end" }
  >
> = {
  coyhaique: { dx: -20, dy: -9, anchor: "end" },
  "rio-tranquilo": { dx: -13, dy: -5, anchor: "end" },
  tortel: { dx: -11, dy: -2, anchor: "end" },
  "villa-ohiggins": { dx: -11, dy: 10, anchor: "end" },
  balmaceda: { dx: 11, dy: -10, anchor: "start" },
  "chile-chico": { dx: 12, dy: 4, anchor: "start" },
  cochrane: { dx: 14, dy: 3, anchor: "start" },
};

const continentalReferenceLabelIds = new Set<RouteStopId>([
  "lima",
  "la-paz",
  "santiago",
]);

const directionalSegmentIds = new Set<string>([
  "paracas-nazca",
  "cusco-puno",
  "copacabana-la-paz",
  "la-paz-sucre",
  "potosi-uyuni",
  "calama-santiago",
  "santiago-balmaceda",
  "rio-bravo-villa-ohiggins",
  "villa-ohiggins-rio-bravo",
  "puerto-ibanez-coyhaique",
]);

const overlappingRetraceSegmentIds = new Set<string>([
  "villa-ohiggins-rio-bravo",
  "rio-bravo-puerto-yungay-return",
]);

const transportLegendItems = [
  { mode: "overland", label: "Road / 4×4" },
  { mode: "rail", label: "Rail" },
  { mode: "ferry", label: "Boat / ferry" },
  { mode: "scheduled-flight", label: "Scheduled flight" },
] as const satisfies readonly {
  readonly mode: AndeanCaravanTransportMode;
  readonly label: string;
}[];

const andesLabelPlacement: Record<
  MapChapter["id"],
  { readonly x: number; readonly y: number; readonly rotation: number }
> = {
  "01": { x: 425, y: 445, rotation: -75 },
  "02": { x: 432, y: 452, rotation: -75 },
  "03": { x: 414, y: 642, rotation: -76 },
  "04": { x: 379, y: 735, rotation: -76 },
};

const patagoniaDetailViewBox = { x: 248, y: 776, width: 148, height: 112 } as const;
const patagoniaAirBridgeViewBox = "240 540 240 355";

const latitudeTicks = [
  { label: "10°S", y: 193 },
  { label: "20°S", y: 366 },
  { label: "30°S", y: 540 },
  { label: "40°S", y: 714 },
  { label: "50°S", y: 887 },
] as const;

const andesSpine =
  "M168 42 C195 80 224 116 251 153 C289 204 337 251 380 303 C414 344 437 385 441 425 C439 470 419 511 390 552 C383 605 361 655 335 703 C318 749 321 791 326 824 C315 858 296 887 304 918 C315 944 329 962 350 977";

const reliefLines = [
  "M143 44 C174 87 206 121 231 160 C270 216 316 255 357 307 C392 351 414 391 417 431 C414 476 396 519 369 558 C358 610 338 661 312 709 C296 753 299 794 305 829 C293 862 276 891 284 920 C294 944 311 963 332 980",
  "M157 42 C186 84 218 118 244 156 C282 209 329 253 370 305 C406 348 427 388 430 428 C428 473 409 515 381 555 C373 608 351 658 325 706 C308 751 311 792 316 826 C305 860 287 889 295 919 C305 944 321 962 342 979",
  andesSpine,
  "M180 43 C207 78 236 113 264 151 C302 199 350 248 393 301 C427 340 450 382 454 423 C452 468 431 508 402 548 C396 601 373 652 348 700 C331 746 334 789 339 821 C328 855 309 884 317 916 C328 941 342 960 362 975",
  "M194 48 C220 82 249 118 276 155 C315 204 363 251 405 303 C439 343 463 383 467 420 C465 465 444 506 414 546 C407 598 385 649 360 697 C343 743 346 785 351 818 C340 851 322 881 329 913 C340 938 354 957 374 973",
] as const;

const lakeTiticacaPath =
  "M391 282 C399 274 411 276 420 281 C428 280 441 288 444 299 C439 307 429 311 419 306 C413 301 406 296 398 295 C392 293 388 287 391 282 Z";
const salarPath =
  "M449 365 L463 357 L482 360 L490 370 L481 381 L458 385 L447 376 Z";
const atacamaPath =
  "M398 327 C417 346 429 371 441 398 C450 421 446 451 430 480 C416 505 404 525 393 538 C382 503 379 469 383 432 C387 397 387 362 398 327 Z";

const projectPoint = (stop: RouteStop): MapPoint => ({
  x: stop.x * 7.8,
  y: stop.y * 10,
});

const formatPoint = (point: MapPoint) =>
  `${point.x.toFixed(1)} ${point.y.toFixed(1)}`;

const smoothPath = (points: readonly MapPoint[]) => {
  const firstPoint = points[0];
  if (!firstPoint) return "";
  if (points.length === 1) return `M${formatPoint(firstPoint)}`;

  let path = `M${formatPoint(firstPoint)}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    if (!current || !next) continue;

    const before = points[index - 1] ?? current;
    const after = points[index + 2] ?? next;
    const controlOne = {
      x: current.x + (next.x - before.x) / 6,
      y: current.y + (next.y - before.y) / 6,
    };
    const controlTwo = {
      x: next.x - (after.x - current.x) / 6,
      y: next.y - (after.y - current.y) / 6,
    };

    path += ` C${formatPoint(controlOne)} ${formatPoint(controlTwo)} ${formatPoint(next)}`;
  }

  return path;
};

const routeStopsById = new Map<string, RouteStop>(
  andeanCaravanRouteStops.map((stop) => [stop.id, stop] as const),
);
const routeSegments: readonly RouteSegment[] = andeanCaravanRouteSegments;

const routePoints = (ids: readonly string[]) =>
  ids
    .map((id) => routeStopsById.get(id))
    .filter((stop): stop is RouteStop => Boolean(stop))
    .map(projectPoint);

const segmentPath = (segment: RouteSegment) => {
  const fromStop = routeStopsById.get(segment.from);
  const toStop = routeStopsById.get(segment.to);
  if (!fromStop || !toStop) return "";

  const from = projectPoint(fromStop);
  const to = projectPoint(toStop);
  if (segment.mode !== "scheduled-flight") {
    return `M${formatPoint(from)} L${formatPoint(to)}`;
  }

  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.hypot(deltaX, deltaY) || 1;
  const bend = segment.curve ?? -0.25;
  const control = {
    x: (from.x + to.x) / 2 + (-deltaY / length) * length * bend,
    y: (from.y + to.y) / 2 + (deltaX / length) * length * bend,
  };

  return `M${formatPoint(from)} Q${formatPoint(control)} ${formatPoint(to)}`;
};

const modeClassName = (mode: AndeanCaravanTransportMode) => {
  if (mode === "scheduled-flight") return styles.segmentFlight;
  if (mode === "rail") return styles.segmentRail;
  if (mode === "ferry") return styles.segmentFerry;
  return styles.segmentOverland;
};

const formatMeters = (value: number) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function RouteLocator({ chapter }: { chapter: MapChapter }) {
  const activeSegments = routeSegments.filter(
    (segment) => segment.chapterId === chapter.id,
  );
  const view = chapter.atlasViewBox;

  if (chapter.id === "04") {
    const flightSegment = activeSegments.find(
      (segment) => segment.id === "santiago-balmaceda",
    );
    const localSegments = activeSegments.filter(
      (segment) => segment.id !== "santiago-balmaceda",
    );
    const contextStopIds = new Set<RouteStopId>(["santiago", "balmaceda"]);
    const chapterStopIds = new Set<string>(chapter.stopIds);
    const mobileDetailLabelIds = new Set<RouteStopId>([
      "balmaceda",
      "rio-tranquilo",
      "tortel",
      "villa-ohiggins",
    ]);

    return (
      <div className={`${styles.locator} ${styles.locatorAirBridge}`} aria-hidden="true">
        <p className={styles.locatorHeading}>
          <span>Air bridge</span>
          <small>Santiago → Balmaceda</small>
        </p>
        <svg
          className={styles.airBridgeMap}
          viewBox={patagoniaAirBridgeViewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          <g className={styles.locatorCountries}>
            {andeanMapCountries
              .filter((country) => country.id === "chile")
              .map((country) => (
                <path key={country.id} d={country.path} fillRule="evenodd" />
              ))}
          </g>
          {localSegments.map((segment) => (
            <path
              key={segment.id}
              className={`${styles.locatorRoute} ${modeClassName(segment.mode)}`}
              d={segmentPath(segment)}
            />
          ))}
          {flightSegment ? (
            <path
              className={`${styles.locatorRouteActive} ${styles.segmentFlight}`}
              d={segmentPath(flightSegment)}
            />
          ) : null}
          {andeanCaravanRouteStops.map((stop) => {
            if (!contextStopIds.has(stop.id)) return null;
            const point = projectPoint(stop);

            return (
              <g key={stop.id}>
                <circle cx={point.x} cy={point.y} r="5" />
                <text
                  className={styles.locatorCityLabel}
                  x={point.x + (stop.id === "santiago" ? -12 : 12)}
                  y={point.y + (stop.id === "santiago" ? -8 : 14)}
                  textAnchor={stop.id === "santiago" ? "end" : "start"}
                >
                  {stop.name}
                </text>
              </g>
            );
          })}
          <rect
            className={styles.locatorWindow}
            x={patagoniaDetailViewBox.x}
            y={patagoniaDetailViewBox.y}
            width={patagoniaDetailViewBox.width}
            height={patagoniaDetailViewBox.height}
          />
        </svg>
        <p className={styles.locatorSubline}>
          Return flight included after the road journey
        </p>

        <div className={styles.locatorDetailRoute}>
          <p className={styles.locatorHeading}>
            <span>Road detail</span>
            <small>Carretera Austral</small>
          </p>
          <svg
            viewBox={`${patagoniaDetailViewBox.x} ${patagoniaDetailViewBox.y} ${patagoniaDetailViewBox.width} ${patagoniaDetailViewBox.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g className={styles.locatorCountries}>
              {andeanMapCountries
                .filter((country) => country.id === "chile")
                .map((country) => (
                  <path key={country.id} d={country.path} fillRule="evenodd" />
                ))}
            </g>
            {localSegments.map((segment) => (
              <path
                key={segment.id}
                className={`${styles.locatorRouteActive} ${modeClassName(segment.mode)}`}
                d={segmentPath(segment)}
              />
            ))}
            {andeanCaravanRouteStops.map((stop) => {
              if (!chapterStopIds.has(stop.id)) return null;
              const point = projectPoint(stop);
              const placement = patagoniaLabelPlacement[stop.id];

              return (
                <g key={stop.id}>
                  <circle cx={point.x} cy={point.y} r="1.5" />
                  {mobileDetailLabelIds.has(stop.id) && placement ? (
                    <text
                      className={styles.locatorDetailLabel}
                      x={point.x + placement.dx}
                      y={point.y + placement.dy}
                      textAnchor={placement.anchor}
                    >
                      {"mapLabel" in stop ? stop.mapLabel : stop.name}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.locator} aria-hidden="true">
      <p className={styles.locatorHeading}>
        <span>Entire journey</span>
        <small>{chapter.title}</small>
      </p>
      <svg viewBox={andeanMapViewBox} preserveAspectRatio="xMidYMid meet">
        <g className={styles.locatorCountries}>
          {andeanMapCountries.map((country) => (
            <path key={country.id} d={country.path} fillRule="evenodd" />
          ))}
        </g>
        {routeSegments.map((segment) => (
          <path
            key={segment.id}
            className={`${styles.locatorRoute} ${modeClassName(segment.mode)}`}
            d={segmentPath(segment)}
          />
        ))}
        {activeSegments.map((segment) => (
          <path
            key={segment.id}
            className={`${styles.locatorRouteActive} ${modeClassName(segment.mode)} ${segment.role === "excursion" ? styles.segmentExcursion : ""}`}
            d={segmentPath(segment)}
          />
        ))}
        {andeanCaravanRouteStops.map((stop) => {
          const point = projectPoint(stop);
          return stop.kind === "gate" ? (
            <circle key={stop.id} cx={point.x} cy={point.y} r="8" />
          ) : null;
        })}
        <rect
          className={styles.locatorWindow}
          x={view.x}
          y={view.y}
          width={view.width}
          height={view.height}
        />
      </svg>
    </div>
  );
}

function ElevationProfile({ chapter }: { chapter: MapChapter }) {
  const baseline = 62;
  const chartWidth = 300;
  const points = chapter.elevation.points.map((value, index, values) => ({
    x: 20 + (index * (chartWidth - 40)) / Math.max(values.length - 1, 1),
    y: baseline - (value / 5000) * 50,
  }));
  const linePath = smoothPath(points);
  const firstPoint = points[0] ?? { x: 20, y: baseline };
  const lastPoint = points[points.length - 1] ?? firstPoint;
  const areaPath = `${linePath} L${formatPoint({ x: lastPoint.x, y: baseline })} L${formatPoint({ x: firstPoint.x, y: baseline })} Z`;
  const peakIndex = Array.from(chapter.elevation.points).findIndex(
    (value) => value === chapter.elevation.highMeters,
  );
  const peakPoint = points[peakIndex] ?? firstPoint;

  return (
    <figure
      className={styles.elevationProfile}
      aria-label={`Elevation profile for ${chapter.route}. The shared scale is zero to 5,000 metres and this chapter reaches ${formatMeters(chapter.elevation.highMeters)} metres.`}
    >
      <div className={styles.elevationHeading}>
        <span>Elevation rhythm</span>
        <strong>{formatMeters(chapter.elevation.highMeters)} m high</strong>
      </div>
      <svg viewBox={`0 0 ${chartWidth} 76`} aria-hidden="true">
        <line className={styles.elevationGuide} x1="20" y1="12" x2="280" y2="12" />
        <line
          className={styles.elevationBaseline}
          x1="20"
          y1={baseline}
          x2="280"
          y2={baseline}
        />
        <path className={styles.elevationArea} d={areaPath} />
        <path className={styles.elevationLine} d={linePath} />
        <circle className={styles.elevationPeak} cx={peakPoint.x} cy={peakPoint.y} r="3.5" />
        <text x="20" y="73">0</text>
        <text x="280" y="9" textAnchor="end">5,000 m</text>
      </svg>
      <figcaption>{chapter.terrain} · one shared 0–5,000 m scale</figcaption>
    </figure>
  );
}

function ChapterStory({
  chapter,
  chapterIndex,
  currentChapterId,
  headingId,
  onChooseChapter,
}: {
  chapter: MapChapter;
  chapterIndex: number;
  currentChapterId?: AndeanCaravanMapChapterId;
  headingId: string;
  onChooseChapter: (index: number) => void;
}) {
  const previousChapter = andeanCaravanMapChapters[chapterIndex - 1];
  const nextChapter = andeanCaravanMapChapters[chapterIndex + 1];
  const isCurrentChapter = chapter.id === currentChapterId;
  const isPatagoniaDetail = chapter.id === "04";

  return (
    <div className={styles.storyContent}>
      <figure className={styles.storyPhoto}>
        <Image
          src={chapter.image.src}
          alt={chapter.image.alt}
          fill
          sizes="(min-width: 1051px) 31vw, (min-width: 768px) 46vw, 100vw"
          style={{
            objectPosition: `${chapter.image.focalPoint.x}% ${chapter.image.focalPoint.y}%`,
          }}
        />
        <figcaption>{chapter.image.caption}</figcaption>
      </figure>

      <div className={styles.storyCopy}>
        <p className={styles.chapterMeta}>
          Plate {chapter.id} / {chapter.days} days
        </p>
        <h3 id={headingId}>{chapter.title}</h3>
        <p className={styles.routeName}>{chapter.route}</p>
        <p className={styles.movementLine}>
          <span>Movement</span>
          {chapter.movement}
        </p>
        <p className={styles.summary}>{chapter.summary}</p>

        {"routeGroups" in chapter && chapter.routeGroups ? (
          <div className={`${styles.placeSequence} ${styles.routeGroups}`}>
            <span>Route places</span>
            {chapter.routeGroups.map((group) => (
              <p key={group.label}>
                <strong>{group.label}</strong>
                <span>{group.places.join(" → ")}</span>
              </p>
            ))}
          </div>
        ) : (
          <div className={styles.placeSequence}>
            <span>Route places</span>
            <p>{chapter.places.join(" → ")}</p>
          </div>
        )}

        <p className={styles.geographicFact}>
          <span>Field note</span>
          {chapter.geographicFact}
        </p>

        <ElevationProfile chapter={chapter} />

        <dl className={styles.gates}>
          <div>
            <dt>Join</dt>
            <dd>{chapter.join}</dd>
          </div>
          <div>
            <dt>Leave</dt>
            <dd>{chapter.leave}</dd>
          </div>
        </dl>

        <Link
          className={styles.sectionLink}
          href={isCurrentChapter ? "#itinerary-heading" : chapter.href}
        >
          {isCurrentChapter ? "Continue to the itinerary" : "Explore this chapter"} <Arrow />
        </Link>

        <p className={styles.mapNote}>
          {isPatagoniaDetail
            ? "Mapped Caravan route ends at Balmaceda. The included Balmaceda → Santiago scheduled flight follows after the journey and is intentionally not drawn."
            : "Transport lines follow the published itinerary. Terrain linework is illustrative; not for navigation."}
        </p>

        <nav className={styles.chapterNav} aria-label="Move between atlas plates">
          {previousChapter ? (
            <button type="button" onClick={() => onChooseChapter(chapterIndex - 1)}>
              <span>Previous plate</span>
              <strong>{previousChapter.title}</strong>
            </button>
          ) : <span aria-hidden="true" />}
          {nextChapter ? (
            <button type="button" onClick={() => onChooseChapter(chapterIndex + 1)}>
              <span>Next plate</span>
              <strong>{nextChapter.title}</strong>
            </button>
          ) : <span aria-hidden="true" />}
        </nav>
      </div>
    </div>
  );
}

export function CaravanRouteMap({
  currentChapterId,
  headingLevel = 2,
  initialChapterId = "01",
}: CaravanRouteMapProps = {}) {
  const MapHeading = `h${headingLevel}` as const;
  const instanceId = useId();
  const safeInstanceId = instanceId.replace(/[^a-zA-Z0-9_-]/g, "");
  const headingId = `${instanceId}-route-heading`;
  const panelId = `${instanceId}-route-panel`;
  const mapTitleId = `${instanceId}-map-title`;
  const mapDescriptionId = `${instanceId}-map-description`;
  const mobilePanelId = `${instanceId}-mobile-route-panel`;
  const mobileStoryHeadingId = `${instanceId}-mobile-story-heading`;
  const landClipId = `${safeInstanceId}-land-clip`;
  const saltPatternId = `${safeInstanceId}-salt-pattern`;
  const desertPatternId = `${safeInstanceId}-desert-pattern`;
  const focusGradientId = `${safeInstanceId}-focus-gradient`;
  const directionMarkerId = `${safeInstanceId}-direction-marker`;
  const [activeChapterIndex, setActiveChapterIndex] = useState(() => {
    const index = andeanCaravanMapChapters.findIndex(
      (chapter) => chapter.id === initialChapterId,
    );
    return index >= 0 ? index : 0;
  });
  const chapterButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeChapter =
    andeanCaravanMapChapters[activeChapterIndex] ?? andeanCaravanMapChapters[0];
  const activeTabId = `${instanceId}-chapter-${activeChapterIndex}`;

  const chooseChapter = (index: number) => {
    setActiveChapterIndex(index);
  };

  const handleChapterKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let destinationIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      destinationIndex = (index + 1) % andeanCaravanMapChapters.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      destinationIndex =
        (index - 1 + andeanCaravanMapChapters.length) %
        andeanCaravanMapChapters.length;
    } else if (event.key === "Home") {
      destinationIndex = 0;
    } else if (event.key === "End") {
      destinationIndex = andeanCaravanMapChapters.length - 1;
    }

    if (destinationIndex === undefined) return;

    event.preventDefault();
    chooseChapter(destinationIndex);
    chapterButtonRefs.current[destinationIndex]?.focus();
  };

  const activeStopIds = new Set<string>(activeChapter.stopIds);
  const labelStopIds = new Set<string>(activeChapter.labelStopIds);
  const activeCountryIds = new Set<string>(activeChapter.countryIds);
  const activeSegments = routeSegments.filter(
    (segment) => segment.chapterId === activeChapter.id,
  );
  const isPatagoniaDetail = activeChapter.id === "04";
  const visibleActiveSegments = isPatagoniaDetail
    ? activeSegments.filter((segment) => segment.id !== "santiago-balmaceda")
    : activeSegments;
  const activeTransportModes = new Set<AndeanCaravanTransportMode>(
    activeSegments.map((segment) => segment.mode),
  );
  const focusPoints = routePoints(activeChapter.focusStopIds);
  const focusPoint = focusPoints.reduce(
    (total, point) => ({ x: total.x + point.x, y: total.y + point.y }),
    { x: 0, y: 0 },
  );
  const focusX = focusPoint.x / Math.max(focusPoints.length, 1);
  const focusY = focusPoint.y / Math.max(focusPoints.length, 1);
  const view = activeChapter.atlasViewBox;
  const mainViewBox = `${view.x} ${view.y} ${view.width} ${view.height}`;
  const latitudeTickX = view.x + 22;
  const andesLabel = andesLabelPlacement[activeChapter.id];
  const plateTypeScale = isPatagoniaDetail ? 0.265 : view.width / 650;
  const mapTypeStyle = {
    "--map-gate-label-size": `${14 * plateTypeScale}px`,
    "--map-stop-label-size": `${12 * plateTypeScale}px`,
    "--map-geographic-label-size": `${13 * plateTypeScale}px`,
    "--map-feature-label-size": `${15 * plateTypeScale}px`,
    "--map-feature-sub-size": `${11 * plateTypeScale}px`,
    "--map-country-label-size": `${20 * plateTypeScale}px`,
    "--map-label-stroke": `${4 * plateTypeScale}px`,
    "--map-geographic-stroke": `${3 * plateTypeScale}px`,
  } as CSSProperties;

  return (
    <section className={styles.root} aria-labelledby={headingId}>
      <header className={styles.heading}>
        <div>
          <p className={styles.kicker}>The Andean Caravan / Field atlas</p>
          <MapHeading id={headingId}>A continent, read in four plates.</MapHeading>
        </div>
        <p className={styles.introduction}>
          Each plate moves closer to the terrain; a context inset keeps every
          change of scale legible.
        </p>
      </header>

      <ol
        className={styles.chapterRail}
        aria-label="Choose a Caravan atlas plate"
        role="tablist"
      >
        {andeanCaravanMapChapters.map((chapter, index) => {
          const isActive = index === activeChapterIndex;

          return (
            <li key={chapter.id} role="presentation">
              <button
                ref={(element) => {
                  chapterButtonRefs.current[index] = element;
                }}
                id={`${instanceId}-chapter-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => chooseChapter(index)}
                onKeyDown={(event) => handleChapterKeyDown(event, index)}
              >
                <span>{chapter.id}</span>
                <strong>{chapter.title}</strong>
                <small>{chapter.days} days</small>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.mapShell}>
        <div className={styles.mapStage}>
          <p className={styles.mapIndex} aria-hidden="true">
            <span>{isPatagoniaDetail ? "04 / Aysén" : "The long spine"}</span>
            <strong>{isPatagoniaDetail ? "Carretera Austral" : "12°S → 49°S"}</strong>
            <small>{isPatagoniaDetail ? "road + ferry loop" : "71 days / four field plates"}</small>
          </p>

          <svg
            className={styles.map}
            viewBox={mainViewBox}
            preserveAspectRatio="xMidYMid meet"
            data-detail={isPatagoniaDetail ? "patagonia" : undefined}
            style={mapTypeStyle}
            role="img"
            aria-labelledby={`${mapTitleId} ${mapDescriptionId}`}
          >
            <title id={mapTitleId}>
              {`Atlas plate ${activeChapter.id}: ${activeChapter.route}`}
            </title>
            <desc id={mapDescriptionId}>
              {`A focused geographic route map of ${activeChapter.route}. Principal route cities for this plate are labelled. Overland routes are solid, rail is dash-dot, ferries are dotted and scheduled flights are dashed.`}
            </desc>

            <defs>
              <clipPath id={landClipId}>
                {andeanMapCountries.map((country) => (
                  <path key={country.id} d={country.path} fillRule="evenodd" />
                ))}
              </clipPath>
              <pattern
                id={saltPatternId}
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <path className={styles.saltHatch} d="M0 6 L6 0 M6 12 L12 6 M0 6 L6 12 M6 0 L12 6" />
              </pattern>
              <pattern
                id={desertPatternId}
                width="17"
                height="17"
                patternUnits="userSpaceOnUse"
              >
                <circle className={styles.desertDot} cx="3" cy="4" r="1" />
                <circle className={styles.desertDot} cx="13" cy="11" r="0.8" />
              </pattern>
              <radialGradient
                id={focusGradientId}
                gradientUnits="userSpaceOnUse"
                cx={focusX}
                cy={focusY}
                r={isPatagoniaDetail ? 58 : 230}
              >
                <stop offset="0" stopColor="var(--sun)" stopOpacity="0.12" />
                <stop offset="0.72" stopColor="var(--sun)" stopOpacity="0.03" />
                <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
              </radialGradient>
              <marker
                id={directionMarkerId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="1.55"
                markerHeight="1.55"
                orient="auto-start-reverse"
              >
                <path className={styles.directionArrow} d="M0 0 L10 5 L0 10 Z" />
              </marker>
            </defs>

            <g className={styles.countryFills}>
              {andeanMapCountries.map((country) => (
                <path
                  key={country.id}
                  className={
                    activeCountryIds.has(country.id)
                      ? styles.countryActive
                      : undefined
                  }
                  d={country.path}
                  fillRule="evenodd"
                />
              ))}
            </g>

            <g clipPath={`url(#${landClipId})`} aria-hidden="true">
              <rect
                className={styles.focusField}
                x="0"
                y="0"
                width="780"
                height="1000"
                fill={`url(#${focusGradientId})`}
              />
              <path className={styles.reliefBand} d={andesSpine} />
              <g className={styles.reliefLines}>
                {reliefLines.slice(1, 4).map((line) => (
                  <path key={line} d={line} />
                ))}
              </g>
              <g
                className={`${styles.featureShapeGroup} ${activeChapter.id === "02" ? styles.featureLayerActive : ""}`}
              >
                <path className={styles.lakeShape} d={lakeTiticacaPath} />
              </g>
              <g
                className={`${styles.featureShapeGroup} ${activeChapter.id === "03" ? styles.featureLayerActive : ""}`}
              >
                <path className={styles.salarShape} d={salarPath} fill={`url(#${saltPatternId})`} />
                <path className={styles.atacamaShape} d={atacamaPath} fill={`url(#${desertPatternId})`} />
              </g>
            </g>

            <g className={styles.countryBorders} aria-hidden="true">
              {andeanMapCountries.map((country) => (
                <path key={country.id} d={country.path} fillRule="evenodd" />
              ))}
            </g>

            {!isPatagoniaDetail ? (
              <g className={styles.latitudeTicks} aria-hidden="true">
                {latitudeTicks.map((tick) => (
                  <g key={tick.label}>
                    <line x1={latitudeTickX} y1={tick.y} x2={latitudeTickX + 18} y2={tick.y} />
                    <text x={latitudeTickX + 26} y={tick.y + 4}>{tick.label}</text>
                  </g>
                ))}
              </g>
            ) : null}

            <g className={styles.geographicLabels} aria-hidden="true">
              <text className={`${styles.oceanLabel} ${styles.waterLabel}`} x="88" y="525" textAnchor="middle" transform="rotate(-77 88 525)">
                Pacific Ocean
              </text>
              <path className={styles.oceanWave} d="M46 454 q22 -12 44 0 t44 0" />
              <path className={styles.oceanWave} d="M55 476 q22 -12 44 0 t44 0" />
              {!isPatagoniaDetail ? (
                <text
                  className={styles.andesLabel}
                  x={andesLabel.x}
                  y={andesLabel.y}
                  textAnchor="middle"
                  transform={`rotate(${andesLabel.rotation} ${andesLabel.x} ${andesLabel.y})`}
                >
                  The Andes
                </text>
              ) : null}

              <g
                className={`${styles.featureAnnotation} ${activeChapter.id === "02" ? styles.featureLayerActive : ""}`}
              >
                <text className={styles.waterLabel} x="457" y="275">Lake Titicaca</text>
              </g>
              <g
                className={`${styles.featureAnnotation} ${activeChapter.id === "03" ? styles.featureLayerActive : ""}`}
              >
                <path d="M507 376 L489 372" />
                <text x="516" y="381">Salar de Uyuni</text>
                <path d="M488 478 L432 455" />
                <text x="500" y="486">Atacama Desert</text>
              </g>
              {isPatagoniaDetail ? (
                <g className={`${styles.featureAnnotation} ${styles.featureLayerActive} ${styles.ferryAnnotation}`}>
                  <path d="M340 868 C327 866 309 860 292 854" />
                  <text x="343" y="869">Mitchell Fjord ferry</text>
                </g>
              ) : null}
            </g>

            <g className={styles.countryLabels} aria-hidden="true">
              {andeanMapCountries.map((country) => {
                const labelX = country.id === "chile" ? 326 : country.label.x;
                const labelY = country.id === "chile" ? 650 : country.label.y;

                return (
                  <text
                    key={country.id}
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    transform={
                      country.id === "chile"
                        ? `rotate(-78 ${labelX} ${labelY})`
                        : undefined
                    }
                  >
                    {country.name}
                  </text>
                );
              })}
            </g>

            <g className={styles.routeSegments} aria-hidden="true">
              {routeSegments.map((segment) => (
                <path
                  key={segment.id}
                  className={`${styles.routeBase} ${modeClassName(segment.mode)} ${segment.role === "excursion" ? styles.segmentExcursion : ""}`}
                  d={segmentPath(segment)}
                />
              ))}
              {visibleActiveSegments.map((segment) => {
                const path = segmentPath(segment);
                const roleClass =
                  segment.role === "excursion"
                    ? styles.segmentExcursion
                    : segment.role === "return"
                      ? styles.segmentReturn
                      : "";
                const isOverlappingRetrace = overlappingRetraceSegmentIds.has(
                  segment.id,
                );

                return (
                  <g key={`${activeChapter.id}-${segment.id}`}>
                    {!isOverlappingRetrace ? (
                      <>
                        <path className={styles.activeCorridor} d={path} />
                        <path className={styles.routeCasing} d={path} />
                      </>
                    ) : null}
                    <path
                      className={`${styles.routeActive} ${modeClassName(segment.mode)} ${roleClass}`}
                      d={path}
                      markerEnd={
                        directionalSegmentIds.has(segment.id)
                          ? `url(#${directionMarkerId})`
                          : undefined
                      }
                    />
                  </g>
                );
              })}
            </g>

            <g className={styles.routeStops} aria-hidden="true">
              {andeanCaravanRouteStops.map((stop) => {
                const point = projectPoint(stop);
                const isGate = stop.kind === "gate";
                const isActive = activeStopIds.has(stop.id);
                const showLabel =
                  (isActive && (isGate || labelStopIds.has(stop.id))) ||
                  (activeChapter.id === "01" &&
                    continentalReferenceLabelIds.has(stop.id));
                const placement =
                  (isPatagoniaDetail
                    ? patagoniaLabelPlacement[stop.id]
                    : labelPlacement[stop.id]) ?? {
                    dx: 15,
                    dy: -15,
                    anchor: "start" as const,
                  };
                const stopRadius = isPatagoniaDetail
                  ? isGate
                    ? 1.9
                    : isActive
                      ? 1.35
                      : 0.8
                  : isGate
                    ? 6
                    : isActive
                      ? 4.25
                      : 2.5;

                return (
                  <g
                    key={stop.id}
                    className={`${styles.routeStop} ${isActive ? styles.routeStopActive : ""} ${isGate ? styles.routeGate : ""}`}
                    transform={`translate(${point.x} ${point.y})`}
                  >
                    {isActive && isGate ? (
                      <circle className={styles.stopHalo} r={isPatagoniaDetail ? 3.2 : 10} />
                    ) : null}
                    <circle r={stopRadius} />
                    {showLabel ? (
                      <>
                        <line
                          className={styles.labelLeader}
                          x1="0"
                          y1="0"
                          x2={placement.dx * 0.68}
                          y2={placement.dy * 0.68}
                        />
                        <text
                          className={isGate ? styles.gateLabel : styles.stopLabel}
                          x={placement.dx}
                          y={placement.dy}
                          textAnchor={placement.anchor}
                        >
                          {"mapLabel" in stop ? stop.mapLabel : stop.name}
                        </text>
                      </>
                    ) : null}
                  </g>
                );
              })}
            </g>
          </svg>

          <RouteLocator chapter={activeChapter} />

          <div className={styles.mapKey} aria-label="Map key">
            {transportLegendItems
              .filter((item) => activeTransportModes.has(item.mode))
              .map((item) => (
                <span key={item.mode}>
                  <svg className={styles.legendSample} viewBox="0 0 44 14" aria-hidden="true">
                    <path
                      className={`${styles.legendLine} ${modeClassName(item.mode)}`}
                      d="M2 7 H42"
                    />
                  </svg>
                  {item.label}
                </span>
              ))}
            <small className={styles.mapKeyNote}>
              Terracotta = selected plate · grey = whole journey
            </small>
          </div>
        </div>

        <div className={styles.mobileLocator}>
          <RouteLocator chapter={activeChapter} />
        </div>

        <ol className={styles.mobileJourney} aria-label="The four route chapters">
          {andeanCaravanMapChapters.map((chapter, index) => {
            const isActive = index === activeChapterIndex;

            return (
              <li key={chapter.id} className={isActive ? styles.mobileActive : undefined}>
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={isActive ? mobilePanelId : undefined}
                  onClick={() => chooseChapter(index)}
                >
                  <span className={styles.mobileNumber}>{chapter.id}</span>
                  <span className={styles.mobileCopy}>
                    <strong>{chapter.title}</strong>
                    <span>{chapter.route}</span>
                    <small>{chapter.days} days</small>
                  </span>
                </button>
                {isActive ? (
                  <aside
                    id={mobilePanelId}
                    className={styles.mobileStoryPanel}
                    role="region"
                    aria-labelledby={mobileStoryHeadingId}
                  >
                    <ChapterStory
                      chapter={activeChapter}
                      chapterIndex={activeChapterIndex}
                      currentChapterId={currentChapterId}
                      headingId={mobileStoryHeadingId}
                      onChooseChapter={chooseChapter}
                    />
                  </aside>
                ) : null}
              </li>
            );
          })}
        </ol>

        <aside
          id={panelId}
          className={styles.storyPanel}
          role="tabpanel"
          aria-labelledby={activeTabId}
        >
          <ChapterStory
            chapter={activeChapter}
            chapterIndex={activeChapterIndex}
            currentChapterId={currentChapterId}
            headingId={`${instanceId}-desktop-story-heading`}
            onChooseChapter={chooseChapter}
          />
        </aside>
      </div>
    </section>
  );
}
