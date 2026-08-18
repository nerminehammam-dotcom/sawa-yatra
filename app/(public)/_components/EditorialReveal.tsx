"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const revealSelector = [
  "main > section",
  "main > article",
  "main > div",
  "main > ol > li",
  "main > ul > li",
  "main > section > article",
  "main > section > ol > li",
  "main > section > ul > li",
].join(",");

function initialiseEditorialReveal() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(revealSelector),
  );

  if (prefersReducedMotion) return () => {};

  const animations = new Map<HTMLElement, Animation>();

  targets.forEach((target) => {
    const bounds = target.getBoundingClientRect();
    const isInitiallyVisible =
      bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0;

    if (isInitiallyVisible) return;

    const animation = target.animate(
      [
        { opacity: 0, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 600,
        easing: "ease-out",
        fill: "both",
      },
    );
    animation.pause();
    animation.currentTime = 0;
    animations.set(target, animation);
  });

  const pending = new Set<HTMLElement>();
  let animationFrame: number | null = null;

  const revealPending = () => {
    const orderedTargets = Array.from(pending).sort((first, second) => {
      const position = first.compareDocumentPosition(second);
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    pending.clear();
    animationFrame = null;

    orderedTargets.forEach((target, index) => {
      const animation = animations.get(target);
      animation?.effect?.updateTiming({ delay: index * 90 });
      animation?.play();
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target as HTMLElement;
        pending.add(target);
        observer.unobserve(target);
      });

      if (pending.size > 0 && animationFrame === null) {
        animationFrame = window.requestAnimationFrame(revealPending);
      }
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );

  animations.forEach((_animation, target) => observer.observe(target));

  return () => {
    observer.disconnect();
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    animations.forEach((animation) => animation.cancel());
  };
}

export function EditorialReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let dispose = () => {};
    let secondFrame: number | null = null;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        dispose = initialiseEditorialReveal();
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) window.cancelAnimationFrame(secondFrame);
      dispose();
    };
  }, [pathname]);

  return null;
}
