import { HelwaProvider } from "@/components/helwa/HelwaProvider";
import { getI18n } from "@/i18n/server";
import { getHelwa, getSiteInfo } from "@/lib/data";

/** Le panier Helwa reste disponible du catalogue jusqu'à la confirmation. */
export default async function HelwaLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getI18n();
  const [categories, site] = await Promise.all([getHelwa(locale), getSiteInfo(locale)]);
  const pickupSite = {
    minLeadDays: site.minLeadDays,
    recommendedLeadDays: site.recommendedLeadDays,
    closedWeekdays: site.closedWeekdays,
    unavailableDates: site.unavailableDates,
    pickupSlots: site.pickupSlots,
    maxInspirationPhotos: site.maxInspirationPhotos,
  };
  return (
    <HelwaProvider categories={categories} site={pickupSite}>
      {children}
    </HelwaProvider>
  );
}
