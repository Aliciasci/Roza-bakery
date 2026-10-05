import Link from "next/link";

export function Logo({
  className = "",
  tone = "dark",
  href = "/",
  label = "Roza Bakery",
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string;
  label?: string;
}) {
  const color = tone === "dark" ? "text-chocolate" : "text-cream";
  return (
    <Link
      href={href}
      aria-label={label}
      className={`inline-flex flex-col items-start leading-none ${color} ${className}`}
    >
      <span className="font-serif text-[1.85rem] italic tracking-[-0.01em] md:text-[2.1rem]">Roza</span>
      <span className="-mt-0.5 pl-[0.15em] text-[0.55rem] font-semibold uppercase tracking-[0.42em] opacity-80">
        Bakery
      </span>
    </Link>
  );
}
