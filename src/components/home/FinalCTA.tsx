import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { localizePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export async function FinalCTA({ title }: { title?: React.ReactNode }) {
  const { locale, t } = await getI18n();
  return (
    <section className="py-24 md:py-32">
      <Reveal className="container-page text-center">
        <p className="script text-4xl text-rose-deep md:text-5xl">{t.home.finalScript}</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-headline">
          {title ?? (
            <>
              {t.home.finalTitle1} <em>{t.home.finalTitle2}</em>
            </>
          )}
        </h2>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={localizePath("/composer", locale)} size="lg" arrow>
            {t.common.composeCta}
          </ButtonLink>
          <ButtonLink href={localizePath("/comment-ca-marche", locale)} size="lg" variant="secondary">
            {t.common.howItWorks}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
