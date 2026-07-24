import type { ReactNode } from "react";

import { classNames } from "./classNames";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import styles from "./PageHero.module.css";

export interface PageHeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
  mediaLayout?: "overlay" | "split";
  ground?: "cream" | "butter" | "brick" | "olive" | "ink";
  contentPosition?: "left" | "right";
  className?: string;
  titleClassName?: string;
}

export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
  media,
  mediaLayout = "overlay",
  ground = "cream",
  contentPosition = "left",
  className,
  titleClassName,
}: PageHeroProps) {
  return (
    <header
      className={classNames(
        styles.root,
        styles[ground],
        Boolean(media) && styles.withMedia,
        Boolean(media) && mediaLayout === "split" && styles.splitMedia,
        styles[contentPosition],
        className,
      )}
    >
      {media ? <div className={styles.media}>{media}</div> : null}
      <Container className={styles.content}>
        <div className={styles.copy}>
          {eyebrow ? (
            <Eyebrow tone={media ? "inherit" : "accent"}>{eyebrow}</Eyebrow>
          ) : null}
          <h1 className={classNames(styles.title, titleClassName)}>{title}</h1>
          {intro ? <div className={styles.intro}>{intro}</div> : null}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
}
