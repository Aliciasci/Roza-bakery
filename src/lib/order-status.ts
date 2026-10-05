import type { OrderStatus } from "./types";

export const orderStatuses: { id: OrderStatus; label: string; className: string }[] = [
  { id: "nouvelle", label: "Nouvelle", className: "bg-berry text-white" },
  { id: "en-etude", label: "En étude", className: "bg-rose text-chocolate" },
  { id: "confirmee", label: "Confirmée", className: "bg-sage text-chocolate" },
  { id: "prete", label: "Prête", className: "bg-sage-deep text-white" },
  { id: "retiree", label: "Retirée", className: "bg-chocolate/10 text-cocoa" },
  { id: "refusee", label: "Refusée", className: "bg-chocolate/10 text-cocoa line-through" },
];

export function statusInfo(id: OrderStatus) {
  return orderStatuses.find((s) => s.id === id) ?? orderStatuses[0];
}
