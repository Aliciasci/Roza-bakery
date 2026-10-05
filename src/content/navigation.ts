import type { Dictionary } from "@/i18n/dictionaries";

type NavKey = keyof Pick<Dictionary["nav"], "home" | "compose" | "creations" | "about" | "faq" | "how" | "contact">;

export const mainNav: { href: string; key: NavKey }[] = [
  { href: "/", key: "home" },
  { href: "/composer", key: "compose" },
  { href: "/creations", key: "creations" },
  { href: "/a-propos", key: "about" },
  { href: "/faq", key: "faq" },
];

export const secondaryNav: { href: string; key: NavKey }[] = [
  { href: "/comment-ca-marche", key: "how" },
  { href: "/contact", key: "contact" },
];
