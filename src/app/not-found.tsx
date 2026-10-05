import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="script text-5xl text-rose-deep">oups…</p>
      <h1 className="mt-4 text-headline">Cette page s&apos;est volatilisée</h1>
      <p className="mt-5 max-w-md text-cocoa">Comme la dernière part de gâteau. Revenons à l&apos;essentiel.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg" variant="secondary">
          Accueil
        </ButtonLink>
        <ButtonLink href="/composer" size="lg" arrow>
          Composer mon gâteau
        </ButtonLink>
      </div>
    </section>
  );
}
