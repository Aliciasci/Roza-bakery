/**
 * Traductions kabyles par défaut du contenu (configurateur, FAQ, catégories, créneaux).
 *
 * ⚠️ À FAIRE RELIRE par une personne kabylophone.
 * Ces textes peuvent ensuite être modifiés directement depuis l'admin (champs « kabyle »).
 * Les noms de pâtisserie (génoise, ganache, coulis…) restent en français, comme dans l'usage courant.
 */
import type { CompositionStep, ConfigOption, FaqItem, OptionGroup } from "@/lib/types";

export const stepsKab: Record<string, NonNullable<CompositionStep["kab"]>> = {
  base: {
    name: "Llsas",
    title: "Fren llsas n tḥlawt-ik",
    subtitle: "Ul n usnulfu-ik : tissist-is ad d-tefk lbenna i yal aqemmuc.",
    summaryLabel: "Llsas",
  },
  creme: {
    name: "Lkrima",
    title: "Fren lkrima-k",
    subtitle: "Tin ara yezzin i yal tasga, gar tifsest d lbenna.",
    summaryLabel: "Lkrima",
    notesPlaceholder: "Tebɣiḍ kra n lbenna i lkrima-k ?",
  },
  inserts: {
    name: "Ayen n daxel",
    title: "Rnu ayen n daxel",
    subtitle: "Tawacult di tlemmast n tḥlawt, s igumma neɣ s lkrima. Tzemreḍ ad tferneḍ aṭas.",
    summaryLabel: "Daxel",
    notesPlaceholder: "Ini-d lbenna : coulis n framboise, gelée n mangue…",
  },
  croustillant: {
    name: "Croustillant",
    title: "Rnu kra n croustillant",
    subtitle: "I umgarad i yettbeddilen kullec. Tzemreḍ ad tferneḍ aṭas.",
    summaryLabel: "Croustillant",
  },
  fruits: {
    name: "Igumma",
    title: "Fren igumma-k",
    subtitle: "I lbenna tamaynut, d tazegzawt. Tzemreḍ ad tferneḍ aṭas.",
    summaryLabel: "Igumma",
  },
  supplements: {
    name: "Timernin",
    title: "Rnu timernin",
    subtitle: "Tarniwt n lbenna i tḥlawt-ik. Tzemreḍ ad tferneḍ aṭas.",
    summaryLabel: "Timernin",
  },
  exterieur: {
    name: "Beṛṛa n tḥlawt",
    title: "Fren amek ara d-tban beṛṛa",
    subtitle: "Taɣzut n tḥlawt-ik, tettwaheyya i ucebbeḥ.",
    summaryLabel: "Beṛṛa",
    notesLabel: "Tilqayin ɣef beṛṛa ?",
    notesPlaceholder: "Ini, tamuɣli, ayen tebɣiḍ…",
  },
  decoration: {
    name: "Acebbeḥ",
    title: "Xemmem acebbeḥ",
    subtitle: "Da i ara tedder taḥlawt-ik. Tzemreḍ ad tferneḍ aṭas.",
    summaryLabel: "Acebbeḥ",
    notesLabel: "Ini-d tikti-k",
    notesPlaceholder: "Asentel, initen, awal ara yettwarun, tagnit n tmeɣra…",
  },
};

export const groupsKab: Record<string, NonNullable<OptionGroup["kab"]>> = {
  "inserts-fruits": { label: "Inserts s igumma" },
  "inserts-cremes": { label: "Lkrima" },
  "fruits-secs": { label: "Igumma yeqquren" },
  croustillants: { label: "Croustillants" },
  "creme-au-beurre": { label: "Lkrima s udhen" },
  ganache: { label: "Ganache" },
};

export const optionsKab: Record<string, NonNullable<ConfigOption["kab"]>> = {
  // Llsas
  "genoise-classique": { description: "Tafessast, d tarṭabt, d tin yettwassnen akk." },
  "molly-cake": { description: "Tẓeyyert ugar, d tin yelhan i tḥlawin s tsegwa." },
  dacquoise: { description: "S lluz, teqqur deg beṛṛa, d tarṭabt deg daxel." },
  // Lkrima
  "ganache-montee": { description: "Tettwaxfeq, d tafessast, tettefsi deg yimi." },
  "chantilly-mascarpone": { description: "D tarṭabt, d tafessast." },
  "chantilly-maison": { label: "Chantilly n uxxam", description: "Tafessast, tettwaxdem imir." },
  "creme-patissiere": { description: "D tin n zik, s vanille." },
  "creme-au-beurre": { label: "Lkrima s udhen", description: "Tẓeyyert, d tarṭabt." },
  "creme-autre": { label: "Lkrimat nniḍen", description: "Tebɣiḍ kra nniḍen ? Ini-yaɣ-d kullec." },
  // Ayen n daxel
  "insert-citron": { label: "Llim" },
  "insert-chocolat": { label: "Ccikula" },
  "insert-coco": { label: "Coco" },
  "insert-autre": { label: "Wayeḍ" },
  // Croustillant
  "crousti-noix": { label: "Lǧuz" },
  "crousti-noisettes": { label: "Lbunduq" },
  "crousti-amandes": { label: "Lluz" },
  "crousti-chocolat": { label: "Ccikula" },
  // Igumma
  "fruits-rouges": { label: "Igumma izeggaɣen" },
  "fruits-tropicaux": { label: "Igumma n tropiques" },
  "fruits-citron": { label: "Llim" },
  "fruits-banane": { label: "Lbanan" },
  "fruits-saison": { label: "Igumma imaynuten n tallit" },
  "fruits-autre": { label: "Wayeḍ / s tuttra" },
  // Timernin
  "supp-chocolat": { label: "Ccikula" },
  "supp-autre": { label: "Wayeḍ s tuttra" },
  // Beṛṛa n tḥlawt
  "ext-meringue-suisse": { description: "Lkrima s udhen, meringue suisse : d tarṭabt, d tafessast." },
  "ext-russe": { label: "Lkrima s udhen tarusit", description: "S uyefki yeẓẓan, d tarṭabt." },
  "ext-americaine": { label: "Lkrima s udhen tamarikanit", description: "Tẓidet ugar, d tin yelhan i yini yesbarriqen." },
  "ext-ganache-chocolat": { label: "Ganache s ccikula", description: "Tagrayt tuzdigt, d tin n lbenna." },
  "ext-ganache-pate-a-sucre": { description: "Ganache s ccikula, s pâte à sucre fell-as." },
  // Acebbeḥ
  "deco-simple": { label: "Acebbeḥ fessusen", description: "Fessus, yelha." },
  "deco-elaboree": { label: "Acebbeḥ s tlqayin", description: "Ugar n tlqayin, ugar n wayen d-yettbanen." },
  "deco-fleurs": { label: "Ijeǧǧigen", description: "Tasekkiwt n ijeǧǧigen." },
  "deco-modelage": { description: "Udmawen d tewlafin yettwaxedmen s ufus." },
  "deco-toppers": { description: "Isem, leɛmer, izen…" },
  "deco-cake-design": { description: "Asnulfu n tẓuri, yettwaxemmem i kečč kan." },
  "deco-personnalisee": { label: "Acebbeḥ akken tebɣiḍ", description: "Tikti-k, tettwaxdem akken tebɣiḍ." },
};

export const categoriesKab: Record<string, { label: string }> = {
  wedding: { label: "Tameɣra" },
  birthday: { label: "Amulli" },
  "cake-design": { label: "Cake design" },
  minimal: { label: "Fessus" },
  floral: { label: "Ijeǧǧigen" },
  chocolate: { label: "Ccikula" },
  kids: { label: "Arrac" },
  custom: { label: "Akken tebɣiḍ" },
};

export const slotsKab: Record<string, { label: string }> = {
  matin: { label: "Taṣebḥit" },
  midi: { label: "Azal" },
  "apres-midi": { label: "Tameddit" },
  "fin-de-journee": { label: "Tagara n wass" },
};

export const faqKab: Record<string, NonNullable<FaqItem["kab"]>> = {
  delai: {
    question: "Acḥal n wussan uqbel ara ssutreɣ ?",
    answer:
      "Tuttriwin ilaq ad ttwaznent 3 ar 4 n wussan uqbel, ma drus. I usnulfu yesɛan aṭas n tlqayin neɣ i wass yettwasutren aṭas, aru-yaɣ-d zik : yal taḥlawt tettwaxdem s ufus, akken tebɣiḍ.",
  },
  livraison: {
    question: "Tettakem-d asiweḍ ?",
    answer: "Ala, Roza Bakery ur tettak ara asiweḍ. Tuttriwin akk ad tent-id-tawiḍ seg tḥanut, ass d wakud i d-temsefhamem.",
  },
  prix: {
    question: "Amek i tettwaḥsab ssuma ?",
    answer:
      "Ssuma teqqen ɣer wayen yellan deg tḥlawt, ɣer tiddi-s, ɣer ucebbeḥ d uxeddim n ufus i ilaqen. Ihi ur tettban ara deg usmel : mi ara tewweḍ-d tuttra-k, Roza Bakery ad teɣṛ asnulfu-ik, sakin ad ak-d-tini ssuma d wass ma yella yelha.",
  },
  inspiration: {
    question: "Zemreɣ ad azneɣ tikti ?",
    answer: "Ih. Mi ara tsuddseḍ taḥlawt-ik, tzemreḍ ad d-tazneḍ yiwet neɣ aṭas n tewlafin n tikti, u ad d-tiniḍ ayen i txemmemeḍ.",
  },
  modification: {
    question: "Zemreɣ ad beddleɣ tuttra-w ?",
    answer: "[Ad yettwasmed sɣur Roza Bakery : tiwtilin d wakud i ubeddel n tuttra neɣ n tuttra yettwasentmen.]",
  },
  retrait: {
    question: "Amek ara d-awiɣ taḥlawt-iw ?",
    answer:
      "Taḥlawt-ik ad tt-id-tawiḍ seg tḥanut, ass d wakud i d-yettwasentmen akked Roza Bakery. [Ad yettwasmed : tansa d iwellihen i usiweḍ n tḥlawt.]",
  },
  ingredients: {
    question: "Acu n wayen tesseqdacem ?",
    answer: "[Ad yettwasmed sɣur Roza Bakery : ayen yettwasqedcen, ansi d-yekka, ayen yezmren ad d-yesseglu aleqqaf, d ubeddel i yezmren ad yili.]",
  },
  "sur-mesure": {
    question: "Zemreɣ ad ssutreɣ asnulfu ur nelli deg wayen i d-tettakem ?",
    answer:
      "Ih, yal asurif deg usuddes yesɛa afran « Wayeḍ » neɣ « s tuttra », u tzemreḍ ad ternuḍ izen ilelli. Roza Bakery ad teɣṛ tuttra-k, ad ak-d-tini ayen i yezmren ad yettwaxdem.",
  },
};

export const siteKab = {
  shortDescription: "Tiḥlawin n ufus d tḥlawin akken tebɣiḍ, yettwaxedmen s ufus, ad tent-id-tawiḍ seg tḥanut.",
};

export const creationPlaceholderKab = { name: "Asnulfu ad d-yas", description: "Tawlaft d uglam ad ttwarnun." };
