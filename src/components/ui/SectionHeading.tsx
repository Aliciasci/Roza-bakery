import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeading({ eyebrow, title, intro, align = "left", as: Tag = "h2", className = "" }: Props) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && (
        <p className={`eyebrow flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
          <span aria-hidden className="h-px w-8 bg-chocolate/30" />
          {eyebrow}
        </p>
      )}
      <Tag className="mt-5 text-headline text-chocolate">{title}</Tag>
      {intro && <p className="mt-5 text-[1.0625rem] leading-relaxed text-cocoa">{intro}</p>}
    </div>
  );
}
