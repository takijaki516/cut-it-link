import Link from "next/link";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl">
      <span>Built by</span>
      <Link href="https://github.com" target="_blank">
        Github
      </Link>
    </footer>
  );
}
