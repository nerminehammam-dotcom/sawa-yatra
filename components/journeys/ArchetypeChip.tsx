import Link from "next/link";
import type { ReactNode } from "react";

import { classNames } from "@/components/ui/classNames";

import styles from "./ArchetypeChip.module.css";

interface ArchetypeChipBaseProps {
  children: ReactNode;
  selected?: boolean;
  className?: string;
}

interface ArchetypeChipStaticProps extends ArchetypeChipBaseProps {
  href?: never;
  onSelect?: never;
  disabled?: never;
}

interface ArchetypeChipLinkProps extends ArchetypeChipBaseProps {
  href: string;
  onSelect?: never;
  disabled?: never;
}

interface ArchetypeChipButtonProps extends ArchetypeChipBaseProps {
  href?: never;
  onSelect: () => void;
  disabled?: boolean;
}

export type ArchetypeChipProps =
  | ArchetypeChipStaticProps
  | ArchetypeChipLinkProps
  | ArchetypeChipButtonProps;

export function ArchetypeChip(props: ArchetypeChipProps) {
  const { children, selected = false, className } = props;
  const chipClassName = classNames(
    styles.root,
    ("href" in props || "onSelect" in props) && styles.interactive,
    selected && styles.selected,
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link
        className={chipClassName}
        href={props.href}
        aria-current={selected ? "page" : undefined}
      >
        {children}
      </Link>
    );
  }

  if ("onSelect" in props && props.onSelect) {
    return (
      <button
        className={chipClassName}
        type="button"
        aria-pressed={selected}
        disabled={props.disabled}
        onClick={props.onSelect}
      >
        {children}
      </button>
    );
  }

  return <span className={chipClassName}>{children}</span>;
}
