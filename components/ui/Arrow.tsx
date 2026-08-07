type ArrowProps = {
  /** "right" for →, "up-right" for ↗ (external / new-context links). */
  direction?: "right" | "up-right";
};

/**
 * Inline CTA arrow, drawn as SVG in currentColor and sized to the text (1em),
 * so it matches Fraunces instead of falling back to a serif glyph the subset
 * does not carry. Decorative only — aria-hidden.
 *
 * This is for CTA affordances ("Explore the Andean Caravan →"). Route-notation
 * arrows in data ("Lima → Paracas") are real text and stay as text.
 */
export function Arrow({ direction = "right" }: ArrowProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "-0.075em", flexShrink: 0 }}
    >
      {direction === "up-right" ? (
        <>
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </>
      ) : (
        <>
          <path d="M4 12h15" />
          <path d="M13 6l6 6-6 6" />
        </>
      )}
    </svg>
  );
}
