"use client";

export function BackToTopLink({ className }: { className?: string }) {
  return (
    <a
      className={className}
      href="#site-top"
      onClick={() => {
        window.requestAnimationFrame(() => {
          document.getElementById("site-top")?.focus({ preventScroll: true });
        });
      }}
    >
      Back to top
    </a>
  );
}
