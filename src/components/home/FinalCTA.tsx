import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA({
  title = (
    <>
      Imaginons ensemble votre <em>prochain gâteau</em>
    </>
  ),
}: {
  title?: React.ReactNode;
}) {
  return (
    <section className="py-24 md:py-32">
      <Reveal className="container-page text-center">
        <p className="script text-4xl text-rose-deep md:text-5xl">une envie ?</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-headline">{title}</h2>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/composer" size="lg" arrow>
            Composer mon gâteau
          </ButtonLink>
          <ButtonLink href="/comment-ca-marche" size="lg" variant="secondary">
            Comment ça marche
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
