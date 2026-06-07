import Link from "next/link";
import { brand, nav } from "@/lib/content";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        {brand.wordmark}
      </Link>
      <ul className={styles.links}>
        {nav.links.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
        <li>
          <a href={nav.press.href}>
            {nav.press.label} <span aria-hidden>{brand.outboundGlyph}</span>
          </a>
        </li>
        <li>
          <a href={nav.contact.href}>
            {nav.contact.label} <span aria-hidden>{brand.outboundGlyph}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
