import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { andeanCaravan, andeanCaravanSectionBySlug } from "@/content/andean-caravan";
import { getAndeanCaravanGallery, getAndeanCaravanImage } from "@/content/andean-caravan-images";

/**
 * The share card for one section of the Caravan.
 *
 * Every page on the site already had an Open Graph image, but it was the same
 * image on all thirty-six of them — so a link to Silver & Bone and a link to
 * the home page arrived in a message looking identical. For a club whose
 * proposition is that the photographs are the founder's own, the one place a
 * link is seen by someone who has never visited is the worst place to show a
 * generic card.
 *
 * This uses the section's own opening photograph, at the section's own name.
 * 1200 x 630 is the ratio every platform crops least badly, and it is declared
 * rather than inferred — Belmond are the only operator in the research who do
 * the same, through a named CDN preset.
 */

export const alt = "The Andean Caravan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const section = andeanCaravanSectionBySlug[slug as keyof typeof andeanCaravanSectionBySlug];
  const gallery = getAndeanCaravanGallery(slug);
  const asset = gallery[0] ?? getAndeanCaravanImage(slug);

  // Read the photograph off disk rather than fetching it: at build time there
  // is no server to fetch from, and this route is generated for every section.
  const file = path.join(process.cwd(), "public", asset.src.replace(/^\//, ""));
  const photograph = await readFile(file).catch(() => null);
  const source = photograph
    ? `data:image/jpeg;base64,${photograph.toString("base64")}`
    : null;

  // satori reads ttf, otf and woff — not woff2, and not variable fonts — so
  // the cards use static instances cut from the same master the site ships,
  // at opsz 48 which is the optical size this type is displayed at here.
  const fonts = await Promise.all(
    [
      ["fraunces-og-400.ttf", 400] as const,
      ["fraunces-og-500.ttf", 500] as const,
    ].map(async ([file, weight]) => ({
      name: "Fraunces",
      weight,
      style: "normal" as const,
      data: await readFile(path.join(process.cwd(), "tools/typography/og", file)),
    })),
  );

  const title = section?.title ?? andeanCaravan.productName;
  // The route strings use → between towns, and Fraunces has no arrow glyph —
  // it never has, which is why the arrows elsewhere on the site fall back to
  // Georgia. In a share card there is no fallback, so an arrow renders as a
  // hole. En dashes instead, which is also how Belmond set the same idea:
  // "2 nights: Cusco – Puno – Arequipa".
  const legs = (value: string) => value.replace(/\s*→\s*/g, " – ");

  const facts = section
    ? [`${section.durationDays} days`, legs(section.route), section.group]
    : [`${andeanCaravan.durationDays} days`, andeanCaravan.countries.join(" · ")];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#e7e1d6",
          fontFamily: "Fraunces",
        }}
      >
        {source ? (
          <img
            alt=""
            src={source}
            width={size.width}
            height={size.height}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}

        {/* A band rather than a wash over the whole frame: the photograph stays
            a photograph, and the type sits on a known flat colour where its
            contrast is the measured 11.99:1 of paper on ink. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            gap: 14,
            padding: "40px 56px 44px",
            backgroundColor: "#27231f",
            borderTop: "3px solid #e7e1d6",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#e5bc4f",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            The Andean Caravan
          </div>
          <div style={{ display: "flex", color: "#e7e1d6", fontSize: 62, fontWeight: 400, lineHeight: 1.02 }}>
            {title}
          </div>
          <div style={{ display: "flex", color: "#e7e1d6", fontSize: 24, opacity: 0.86 }}>
            {facts.join("   ·   ")}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
