import Link from "next/link";
import { brand, footer } from "@/lib/content";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copy}>
        © {brand.year} {brand.legalName}
      </span>
      <div className={styles.links}>
        {footer.links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
