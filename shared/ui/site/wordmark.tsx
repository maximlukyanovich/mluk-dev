import Link from "next/link";

/** The site's name with the lime dot; links to the locale's home page. */
export function Wordmark({ href }: { href: string }) {
  return (
    <Link className="mk-wordmark" href={href}>
      mluk<span className="mk-wordmark-dot">.</span>dev
    </Link>
  );
}
