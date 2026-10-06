import Link from "next/link";
import { CakeImage } from "@/components/ui/CakeImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { localizePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { getCreations } from "@/lib/data";

const shapes = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/5]", "aspect-[3/4]", "aspect-square"];

export async function CreationsPreview() {
  const { locale, t } = await getI18n();
  const creations = (await getCreations(locale)).slice(0, 6);
  const galleryHref = localizePath("/creations", locale);

  return (
    <section className="bg-ivory pb-20 pt-14 md:pb-28 md:pt-20" aria-labelledby="creations-title">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t.home.galleryEyebrow}
            title={
              <span id="creations-title">
                {t.home.galleryTitle1} <em>{t.home.galleryTitle2}</em>
              </span>
            }
            intro={t.home.galleryIntro}
          />
          <Link
            href={galleryHref}
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold underline decoration-chocolate/30 underline-offset-[6px] transition-colors hover:decoration-chocolate md:self-auto"
          >
            {t.home.galleryAll}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="mt-14 columns-2 gap-3 md:columns-3 md:gap-6">
          {creations.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 80} className="mb-3 break-inside-avoid md:mb-6">
              <Link href={galleryHref} className="group block overflow-hidden rounded-2xl">
                <div className="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]">
                  <CakeImage
                    src={c.image}
                    alt={c.name}
                    tone={c.tone}
                    color={c.color}
                    placeholderLabel={t.common.photoComing}
                    slotLabel={t.common.photoSlot}
                    shape={`${shapes[i % shapes.length]} rounded-2xl`}
                    sizes="(min-width: 768px) 30vw, 46vw"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
