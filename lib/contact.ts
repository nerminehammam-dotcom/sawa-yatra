export const contactEmail = "nerminehammam@gmail.com" as const;

export function contactHref(context?: string): string {
  const trimmedContext = context?.trim();

  return trimmedContext
    ? `/contact?journey=${encodeURIComponent(trimmedContext)}`
    : "/contact";
}
