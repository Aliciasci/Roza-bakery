import type { FaqItem } from "@/lib/types";
import { faqKab } from "./kab";

/**
 * Questions fréquentes.
 * Les entrées `placeholder: true` contiennent une réponse à compléter / valider
 * par Roza Bakery (elles ne sont pas incluses dans les données structurées SEO).
 */
const baseFaq: FaqItem[] = [
  {
    id: "delai",
    question: "Combien de temps à l'avance dois-je commander ?",
    answer:
      "Les commandes doivent être passées au minimum 3 à 4 jours à l'avance. Pour une création élaborée ou une date très demandée, n'hésitez pas à nous écrire plus tôt : chaque gâteau est réalisé à la main et sur mesure.",
  },
  {
    id: "livraison",
    question: "Faites-vous des livraisons ?",
    answer:
      "Non, Roza Bakery ne propose pas de livraison. Toutes les commandes sont à récupérer sur place, à la date et au créneau convenus.",
  },
  {
    id: "prix",
    question: "Comment le prix est-il calculé ?",
    answer:
      "Le prix dépend de la composition, de la taille, de la décoration et du travail manuel nécessaire. C'est pourquoi il n'est pas affiché en ligne : après réception de votre demande, Roza Bakery étudie votre création et vous confirme son prix et sa disponibilité.",
  },
  {
    id: "inspiration",
    question: "Puis-je envoyer une inspiration ?",
    answer:
      "Bien sûr. Lors de la composition de votre gâteau, vous pouvez joindre une ou plusieurs photos d'inspiration et décrire ce que vous imaginez.",
  },
  {
    id: "modification",
    question: "Puis-je modifier ma commande ?",
    answer:
      "[À compléter par Roza Bakery : conditions et délai pour modifier une demande ou une commande confirmée.]",
    placeholder: true,
  },
  {
    id: "retrait",
    question: "Comment récupérer mon gâteau ?",
    answer:
      "Votre gâteau est à récupérer sur place, à la date et au créneau confirmés avec Roza Bakery. [À compléter : adresse et conseils de transport.]",
    placeholder: true,
  },
  {
    id: "ingredients",
    question: "Quels ingrédients utilisez-vous ?",
    answer:
      "[À compléter par Roza Bakery : ingrédients, provenance, allergènes et possibilités d'adaptation.]",
    placeholder: true,
  },
  {
    id: "sur-mesure",
    question: "Puis-je demander une création qui n'est pas proposée ?",
    answer:
      "Oui, chaque étape du configurateur propose une option « Autre » ou « sur demande », et vous pouvez ajouter un message libre. Roza Bakery étudiera votre demande et vous dira ce qui est réalisable.",
  },
];

export const faq: FaqItem[] = baseFaq.map((item) => ({ ...item, ...(faqKab[item.id] && { kab: faqKab[item.id] }) }));
