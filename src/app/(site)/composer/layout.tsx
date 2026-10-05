import { ConfiguratorProvider } from "@/components/configurator/ConfiguratorProvider";
import { getCompositionSteps, getSiteInfo } from "@/lib/data";

/**
 * Le provider englobe le configurateur, le récapitulatif et la confirmation :
 * la création (et les photos en mémoire) reste disponible d'une page à l'autre.
 */
export default async function ComposerLayout({ children }: { children: React.ReactNode }) {
  const [steps, site] = await Promise.all([getCompositionSteps(), getSiteInfo()]);
  const configuratorSite = {
    minLeadDays: site.minLeadDays,
    recommendedLeadDays: site.recommendedLeadDays,
    closedWeekdays: site.closedWeekdays,
    unavailableDates: site.unavailableDates,
    pickupSlots: site.pickupSlots,
    maxInspirationPhotos: site.maxInspirationPhotos,
  };
  return (
    <ConfiguratorProvider steps={steps} site={configuratorSite}>
      {children}
    </ConfiguratorProvider>
  );
}
