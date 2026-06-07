import Link from "next/link";
import { brand } from "@/lib/content";
import styles from "./PillButton.module.css";

type Props = {
  href: string;
  children: React.ReactNode;
  outbound?: boolean;
  arrow?: boolean;
};

/** Shared primary CTA: black pill + ↗ glyph (style guide §7). */
export default function PillButton({
  href,
  children,
  outbound,
  arrow = true,
}: Props) {
  const glyph = arrow ? (
    <span aria-hidden> {brand.outboundGlyph}</span>
  ) : null;

  if (outbound || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a className={styles.btn} href={href}>
        {children}
        {glyph}
      </a>
    );
  }

  return (
    <Link className={styles.btn} href={href}>
      {children}
      {glyph}
    </Link>
  );
}
