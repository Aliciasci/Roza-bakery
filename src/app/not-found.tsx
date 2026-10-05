import { ButtonLink } from "@/components/ui/Button";
import { localizePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { locale, t } = await getI18n();
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="script text-5xl text-rose-deep">{t.notFound.script}</p>
      <h1 className="mt-4 text-headline">{t.notFound.title}</h1>
      <p className="mt-5 max-w-md text-cocoa">{t.notFound.text}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={localizePath("/", locale)} size="lg" variant="secondary">
          {t.common.home}
        </ButtonLink>
        <ButtonLink href={localizePath("/composer", locale)} size="lg" arrow>
          {t.common.composeCta}
        </ButtonLink>
      </div>
    </section>
  );
}
