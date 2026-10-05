import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute -right-48 -top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-rose/25 blur-3xl" />
      <div className="container-page pb-14 pt-10 md:pb-20 md:pt-20">
        <p className="eyebrow flex animate-fade-up items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-chocolate/30" />
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl animate-fade-up text-display [animation-delay:80ms]">{title}</h1>
        {intro && (
          <p className="mt-7 max-w-xl animate-fade-up text-[1.0625rem] leading-relaxed text-cocoa [animation-delay:160ms] md:text-lg">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
