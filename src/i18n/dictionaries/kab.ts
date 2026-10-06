import type { Dictionary } from "./fr";

/**
 * Textes de l'interface — kabyle (taqbaylit), alphabet latin.
 *
 * ⚠️ TRADUCTION À FAIRE RELIRE par une personne kabylophone avant la mise en ligne.
 *
 * Glossaire des choix de traduction (à valider / remplacer partout si besoin) :
 *   gâteau ............ taḥlawt (pl. tiḥlawin)
 *   pâtisserie ........ tiḥlawin n ufus (artisanale)
 *   commande/demande .. tuttra (pl. tuttriwin) — commander : ssuter
 *   retrait ........... asali (deg tḥanut)
 *   livraison ......... asiweḍ
 *   prix .............. ssuma
 *   étape ............. asurif
 *   récapitulatif ..... agzul
 *   saveur ............ lbenna
 *   photo ............. tawlaft (pl. tiwlafin)
 *   inspiration ....... tikti (pl. tiktiwin)
 *   créneau ........... akud
 *   personnes ......... imdanen
 *   facultatif ........ d afrayan
 *   fruits ............ agummu (pl. igumma)
 *   crème ............. lkrima
 * Les noms de pâtisserie (génoise, ganache, molly cake…) restent en français, comme dans l'usage courant.
 * Adresse à la 2e personne du singulier (usage habituel des interfaces en kabyle).
 */

export const kab: Dictionary = {
  meta: {
    defaultTitle: "Roza Bakery — Tiḥlawin n ufus, akken tebɣiḍ",
    titleTemplate: "%s — Roza Bakery",
    description:
      "Roza Bakery, tiḥlawin n ufus d cake design : suddes taḥlawt-ik s yiman-ik, asurif s usurif — taḥlawt n umulli, taḥlawt n tmeɣra, taḥlawt akken tebɣiḍ. Asali deg tḥanut.",
    ogTitle: "Roza Bakery — Taḥlawt-ik, amezruy-ik.",
    ogLocale: "kab_DZ",
    keywords: ["tiḥlawin", "taḥlawt", "cake design", "taḥlawt n umulli", "pâtisserie", "gâteau personnalisé", "taqbaylit"],
    cityKeywords: (city: string) => [`tiḥlawin ${city}`, `pâtisserie ${city}`],
    composer: {
      title: "Suddes taḥlawt-ik",
      description:
        "Suddes taḥlawt-ik asurif s usurif : génoise, lkrima, inserts, croustillant, igumma, tagrayt d ucebbeḥ. Roza Bakery ad ak-d-tini ssuma d wass ma yella yelha.",
    },
    creations: {
      title: "Isnulfa-nneɣ — cake design d tḥlawin akken tebɣiḍ",
      description:
        "Isnulfa n Roza Bakery : tiḥlawin n tmeɣriwin, n imulliten, cake design, tiḥlawin s ijeǧǧigen, s ccikula d wayen nniḍen.",
    },
    how: {
      title: "Amek ara tessutreḍ taḥlawt",
      description:
        "Xemmem, suddes, azen tuttra-k : Roza Bakery ad ak-d-tini ssuma, sakin ad d-tawiḍ taḥlawt-ik seg tḥanut. Ssuter 3 ar 4 n wussan uqbel.",
    },
    about: {
      title: "Ɣef-nneɣ — tiḥlawin n ufus",
      description: "Issin Roza Bakery : tiḥlawin n ufus d cake design, yettwaxedmen s ufus, akken tebɣiḍ.",
    },
    faq: {
      title: "Isteqsiyen",
      description:
        "Akud n tuttra, asali deg tḥanut, ssuma n tḥlawt, tiwlafin n tikti… Tiririt ɣef yisteqsiyen i d-yettuɣalen s waṭas.",
    },
    contact: {
      title: "Anermis",
      description: "Aru-d i Roza Bakery ma yella kra n usteqsi ɣef tḥlawt-ik. Asali deg tḥanut kan.",
    },
    recap: "Agzul n tuttra-inu",
    confirmation: "Tuttra tettwazen",
    helwa: {
      title: "Helwa — tiḥlawin s yiṭuḍan, kukiz d tḥlawin n tmurt",
      description:
        "Ssuter kukiz d tḥlawin n tmurt s yiṭuḍan : baklawa, makrout, dziriette… Fren amḍan, ssuma ad d-tban imir-n. Asali deg tḥanut.",
    },
    helwaOrder: "Tuttra-inu n Helwa",
    helwaConfirmation: "Tuttra n Helwa tettwazen",
  },

  nav: {
    home: "Agejdan",
    compose: "Suddes",
    helwa: "Helwa",
    creations: "Isnulfa",
    about: "Ɣef-nneɣ",
    faq: "Isteqsiyen",
    how: "Amek iteddu",
    contact: "Anermis",
    order: "Ssuter",
    openMenu: "Ldi umuɣ",
    closeMenu: "Mdel umuɣ",
    mainNav: "Umuɣ agejdan",
    mobileNav: "Umuɣ n tiliɣri",
    skip: "Ɛeddi ɣer ugbur",
    logoHome: "Roza Bakery — agejdan",
    language: "Tutlayt",
    switchTo: (name: string) => `Sken asmel s ${name}`,
  },

  common: {
    composeCta: "Suddes taḥlawt-ik",
    seeCreations: "Wali isnulfa-nneɣ",
    howItWorks: "Amek iteddu",
    leadTimeShort: "3 ar 4 n wussan uqbel",
    pickupShort: "Asali deg tḥanut",
    leadTimeMin: "Tuttriwin 3 ar 4 n wussan uqbel, ma drus",
    pickupOnly: "Asali deg tḥanut kan",
    madeToMeasure: "Yal taḥlawt tettwaxdem akken tebɣiḍ",
    priceNote: "Ssuma n tḥlawt-ik ad ak-tt-id-tini Roza Bakery mi ara teɣṛ tuttra-k.",
    toComplete: (label: string) => `[${label} — ad yettwasmed]`,
    photoComing: "Tawlaft n Roza Bakery ad d-tas",
    photoSlot: "amḍiq n tewlaft (ad yettwabeddel)",
    example: "Amedya",
    optional: "d afrayan",
    back: "Uɣal",
    home: "Agejdan",
  },

  footer: {
    tagline: "Tiḥlawin yettwaxedmen s ufus, i wussan-ik yelhan akk.",
    navLabel: "Adar n usebter",
    explore: "Snirem",
    infos: "Talɣut",
    findUs: "Anda ara aɣ-d-tafeḍ",
    address: "Tansa",
    email: "Imayl",
    instagramLink: "Aseɣwen Instagram",
    rights: (year: number) => `© ${year} Roza Bakery. Izerfan akk ttwaḥerzen.`,
    keywords: "Tiḥlawin n ufus · Tiḥlawin akken tebɣiḍ · Cake design",
  },

  home: {
    eyebrow: "Tiḥlawin n ufus · Akken tebɣiḍ",
    heroTitle1: "Taḥlawt-ik,",
    heroTitle2: "amezruy-ik.",
    heroSubtitle: "Xemmem taḥlawt-ik, fren yal talqayt, u eǧǧ Roza Bakery ad tesnulfu taḥlawt yiwet kan, am kečč.",
    heroAlt: "Taḥlawt n Roza Bakery",
    badge: "S ufus · Akken tebɣiḍ · Roza ·",
    handmade: "s ufus",
    handmadeText: "Yal asnulfu yettwaxemmem, yettwaxdem akken tebɣiḍ.",
    galleryEyebrow: "Tiwlafin",
    galleryTitle1: "Isnulfa",
    galleryTitle2: "yemgaraden",
    galleryIntro: "Imulliten, timeɣriwin, ccikula neɣ ijeǧǧigen : yal taḥlawt tettawi-d amezruy-is.",
    galleryAll: "Isnulfa-nneɣ akk",
    howEyebrow: "Fessus, akken tebɣiḍ",
    howTitle1: "Amek",
    howTitle2: "iteddu",
    howSteps: [
      { title: "Ad suddseɣ", text: "Ad fernaɣ yal aḥric n tḥlawt-iw, seg génoise alamma d acebbeḥ." },
      { title: "Ad azneɣ tuttra-w", text: "Ad d-iniɣ azemz n usali, isalan-iw d tiktiwin-iw." },
      { title: "Roza Bakery ad d-terr awal", text: "Tuttra-w ad tettwaɣer, sakin ad iyi-d-tini ssuma d wass ma yella yelha." },
      { title: "Ad d-awiɣ taḥlawt-iw", text: "Ass-nni, taḥlawt-iw ad iyi-terǧu deg tḥanut." },
    ],
    keyEyebrow: "Ilaq ad t-tesneḍ",
    keyTitle1: "Uqbel ad",
    keyTitle2: "tessutreḍ",
    keyInfos: [
      { title: "Tuttriwin 3 ar 4 n wussan uqbel, ma drus", text: "D akud i ilaqen akken ad tettwaheyya taḥlawt-ik s leɛqel." },
      { title: "Asali deg tḥanut kan", text: "Ulac asiweḍ : taḥlawt-ik ad k-terǧu ass i d-nemsefham." },
      { title: "Yal taḥlawt tettwaxdem akken tebɣiḍ", text: "Ssuma ad ak-tt-id-tini Roza Bakery mi ara teɣṛ tuttra-k." },
    ],
    finalScript: "kra n tikti ?",
    finalTitle1: "Ad nxemmem akken",
    finalTitle2: "taḥlawt-ik i d-iteddun",
  },

  creations: {
    eyebrow: "Tiwlafin",
    title1: "Wali",
    title2: "isnulfa-nneɣ",
    intro: "Yal taḥlawt tettwaxemmem i yiwen n umdan, i yiwet n tmeɣra, i yiwen n umezruy. Ẓer, sakin suddes tin-ik.",
    filterLabel: "Sizdeg s taggayt",
    all: "Akk",
    count: (n: number) => `${n} n yisnulfa`,
    empty: "Ulac asnulfu deg taggayt-a ar tura.",
    ctaTitle1: "Teɛǧeb-ak kra ?",
    ctaTitle2: "Ad nesnulfu tin-ik",
  },

  how: {
    eyebrow: "Amek iteddu",
    title1: "Seg tikti",
    title2: "ɣer tḥlawt",
    intro: "Tuttra fessusen, tiririt akken tebɣiḍ. Aya d amek ara tettwaxdem taḥlawt-ik.",
    steps: [
      {
        title: "Ad txemmemeḍ",
        text: "Tameɣra, kra n wayen tebɣiḍ, kra n tegnit. Sdukkel tiktiwin-ik, initen-ik d tiwlafin-ik.",
      },
      {
        title: "Ad tsuddseḍ",
        text: "Asurif s usurif, fren génoise, lkrima, inserts, croustillant, igumma, tagrayt d ucebbeḥ.",
      },
      {
        title: "Ad tazneḍ tuttra-k",
        text: "Ini-d azemz n usali (3 ar 4 n wussan uqbel, ma drus), amḍan n yimdanen d isalan-ik.",
      },
      {
        title: "Roza Bakery ad ak-d-tini ssuma",
        text: "Yal asnulfu yettwaɣer s leɛqel. Ssuma d wass ad ak-ten-id-tini uqbel ad tebdu.",
      },
      {
        title: "Ad d-tawiḍ taḥlawt-ik seg tḥanut",
        text: "Ass d wakud i d-temsefhamem. Roza Bakery ur tettak ara asiweḍ.",
      },
    ],
    whyEyebrow: "Awal-nneɣ",
    whyTitle1: "Acuɣer ara tessutreḍ ɣer",
    whyTitle2: "Roza Bakery ?",
  },

  why: [
    { title: "Isnulfa akken tebɣiḍ", text: "Yal taḥlawt tettwasuddes akken i k-yehwa, i tmeɣra-k." },
    { title: "Imukan n lɛali", text: "Lḥir meqqer ɣef ufran n wayen yettwasqedcen." },
    { title: "Axeddim n ufus", text: "Kullec yettwaxdem s ufus, mi ara yettwasuter." },
    { title: "Lḥir ɣef tlqayin", text: "Seg tissist alamma d acebbeḥ, ulac ayen yettwanfen." },
    { title: "Yal taḥlawt d tayiwet", text: "Ulac asnulfu i yecban win i t-id-yezwaren." },
  ],

  about: {
    eyebrow: "Ɣef-nneɣ",
    title1: "Tiḥlawin",
    title2: "s ufus",
    intro: "Roza Bakery txemmim, txeddem tiḥlawin akken tebɣiḍ, i wussan-ik yelhan akk.",
    portraitAlt: "Tawlaft n tmeddakelt n Roza Bakery",
    portraitComing: "Tawlaft ad d-tas",
    storyScript: "amezruy",
    storyTitle1: "Deffir",
    storyTitle2: "yal taḥlawt",
    story1: "[Ad yettwasmed sɣur Roza Bakery : amezruy n tḥanut, win yellan deffir n yisnulfa, tazwara-s.]",
    story2: "[Ad yettwasmed : tarrayt n uxeddim, tiktiwin, ayen yerran yal asnulfu d ayiwen.]",
    valuesEyebrow: "Azalen-nneɣ",
    valuesTitle1: "Lḥir",
    valuesTitle2: "ɣef yal talqayt",
  },

  faq: {
    eyebrow: "Isteqsiyen",
    title1: "Isteqsiyen",
    title2: "i d-yettuɣalen",
    intro: "Ayen akk ilaqen ad t-tesneḍ uqbel ad tsuddseḍ taḥlawt-ik.",
    more: "Ɣur-k asteqsi nniḍen ?",
    writeUs: "Aru-yaɣ-d",
  },

  contact: {
    eyebrow: "Anermis",
    title1: "Ad nemmeslay ɣef",
    title2: "tḥlawt-ik",
    introStart: "Ɣur-k asteqsi uqbel ad tessutreḍ ? Aru-yaɣ-d. I tuttra n tḥlawt, ayen yifen d",
    introLink: "ad tsuddseḍ asnulfu-ik",
    instagram: "Instagram",
    email: "Imayl",
    phone: "Tiliɣri",
    address: "Tansa n usali",
    hours: "Isragen",
    pickupOnly: "Asali deg tḥanut kan — Roza Bakery ur tettak ara asiweḍ.",
    form: {
      name: "Isem",
      phone: "Tiliɣri",
      optional: "(d afrayan)",
      email: "Imayl",
      message: "Izen",
      submit: "Azen izen-iw",
      sending: "Tuzna…",
      thanks: "tanemmirt",
      sent: "Izen-ik yettwazen ♡",
      reply: "Roza Bakery ad ak-d-terr awal s lemɣawla.",
      error: "Ur yezmir ara ad yettwazen.",
    },
  },

  notFound: {
    script: "ay ay…",
    title: "Asebter-a yenger",
    text: "Am uḥric aneggaru n tḥlawt. Uɣal ɣer wayen yesɛan azal.",
  },

  configurator: {
    srTitle: "Suddes taḥlawt-ik",
    progressLabel: "Asurif n usnulfu",
    stepWord: "Asurif",
    stepAria: (i: number, name: string, done: boolean) => `Asurif ${i} : ${name}${done ? " (yemmed)" : ""}`,
    infoStep: {
      name: "Isalan n tuttra",
      title: "Isalan-ik",
      subtitle: "Ini-yaɣ-d melmi d i acḥal n yimdanen. Roza Bakery ad ak-d-terr awal akken ad tsentem.",
    },
    optionalTag: "D afrayan",
    back: "Uɣal",
    prevStep: "Asurif yezrin",
    continue: "Kemmel",
    skip: "Ɛeddi asurif-a",
    toRecap: "Wali agzul",
    myCreation: "Asnulfu-inu",
    choices: (n: number) => `${n} n ufran`,
    summaryAria: "Agzul n usnulfu-inu",
    closeSummary: "Mdel agzul",
    summaryTitle: "Taḥlawt-iw",
    toChoose: "Ad tettwafren",
    photosCount: (n: number) => `${n} n tewlafin n tikti`,
    pickup: "Asali",
    modify: (label: string) => `Beddel : ${label}`,
    chooseError: "Ttxil fren kra akken ad tkemmleḍ.",
    flavorError: (flavorLabel: string, names: string[]) =>
      `Fren ${flavorLabel.toLowerCase()} i : ${names.map((n) => `« ${n} »`).join(", ")}.`,
    addNote: "Rnu talqayt",
    noteLabel: "Talqayt ?",
    notePlaceholder: "Rnu kra n talqayt, kra n wayen tebɣiḍ s tidet…",
    optionalParen: "(d afrayan)",
    customLabel: (label: string) => `Ini-d « ${label} »`,
    customPlaceholder: "Ini-d ayen tebɣiḍ…",
    flavorDefault: "Lbenna",
    flavorsHint: (n: number) => `${n} n yifranen`,
    flavorToChoose: "ad tettwafren",
  },

  helwa: {
    eyebrow: "Helwa · s yiṭuḍan",
    title1: "Tiḥlawin",
    title2: "s yiṭuḍan",
    intro: "Kukiz, tiḥlawin n tmurt… Fren tiḥlawin-ik d umḍan n yiṭuḍan : ssuma tettwaḥsab imir imir.",
    perPiece: "aṭuḍ",
    minQty: (n: number) => `Seg ${n} n yiṭuḍan`,
    add: (name: string) => `Rnu « ${name} »`,
    remove: (name: string) => `Kkes aṭuḍ seg « ${name} »`,
    plus: (name: string) => `Rnu aṭuḍ n « ${name} »`,
    quantity: (name: string) => `Amḍan n yiṭuḍan n « ${name} »`,
    lineTotal: (qty: number, price: string) => `${qty} × ${price}`,
    pieces: (n: number) => `${n} ${n > 1 ? "n yiṭuḍan" : "n uṭuḍ"}`,
    total: "Akk",
    emptyCart: "Ulac ayen i tferneḍ akka tura.",
    order: "Ssuter",
    cartAria: "Ayen i ferneɣ deg Helwa",
    empty: "Ulac tiḥlawin akka tura. Uɣal-d ticki !",
    backToCatalog: "← Beddel ayen i tferneḍ",
    orderEyebrow: "Tuttra n Helwa",
    orderTitle1: "Cwiṭ kan,",
    orderTitle2: "ad tettwazen tuttra",
    orderIntro: "Aru-d isalan-ik d wass ara d-tawiḍ tiḥlawin-ik.",
    selection: "Ayen i ferneɣ",
    modify: "Beddel",
    submit: "Azen tuttra-inu",
    sending: "Tuzna…",
    confirmNote: "Roza Bakery ad ak-d-tini ma yella yelha uqbel ad theggi tuttra-k. Lexlaṣ asmi ara d-tawiḍ, ulac lexlaṣ deg Internet.",
    thanksTitle: "Tuttra-k tettwazen",
    thanksText: "Tanemmirt ! Roza Bakery ad tẓer ma yella yelha, sakin ad ak-d-terr awal akken ad tt-tesentem.",
    backHome: "Uɣal ɣer ugejdan",
    noneTitle: "Ulac tuttra tamaynut",
    noneText: "Tebɣiḍ kukiz neɣ tiḥlawin n tmurt ?",
    seeHelwa: "Wali Helwa",
  },

  photos: {
    script: "tikti",
    title: "Ɣur-k tikti ?",
    description: "Azen-aɣ-d tawlaft neɣ tikti akken ad aɣ-d-tesskneḍ ayen i txemmemeḍ.",
    titleInfo: "Tiwlafin n tikti ?",
    descriptionInfo: "Rnu neɣ semmed tiktiwin-ik : ad ddunt d tuttra-k.",
    add: "Rnu tiwlafin",
    upTo: (max: number) => `Alamma d ${max} n tugniwin · 8 Mo i yal yiwet`,
    maxReached: "Amḍan afellay yewweḍ",
    onlyImages: "Tugniwin kan i yettwaqeblen (JPG, PNG, WEBP, HEIC).",
    tooBig: "Yiwet n tugna tɛedda 8 Mo, ur tettwarna ara.",
    max: (n: number) => `${n} n tewlafin, ma ugar.`,
    listLabel: "Tiwlafin yettwarnan",
    alt: (i: number) => `Tikti ${i}`,
    remove: (i: number) => `Kkes tawlaft ${i}`,
  },

  customer: {
    leadNotice: (min: number, rec: number) => `Tuttriwin ilaq ad ttwaznent ${min} ar ${rec} n wussan uqbel, ma drus.`,
    pickupNotice: "Asali deg tḥanut kan — ulac asiweḍ.",
    contactLegend: "Isalan-ik",
    firstName: "Isem",
    lastName: "Isem n twacult",
    email: "Imayl",
    phone: "Tiliɣri",
    pickupLegend: "Asali",
    date: "Azemz n usali",
    pickupOn: "Asali ass n",
    shortNotice: (rec: number) =>
      `I usnulfu yesɛan aṭas n tlqayin, ssuter ${rec} n wussan uqbel. Roza Bakery ad ak-d-tini ma yella wass yelha.`,
    dateHint: (min: number) => `Izemzen i yellan ddaw n ${min} n wussan ur ttwafernen ara.`,
    slot: "Akud n usali",
    servings: "Amḍan n yimdanen",
    servingsPlaceholder: "Amedya 12",
    minus: "Kkes yiwen n umdan",
    plus: "Rnu yiwen n umdan",
    detailsLegend: "Tilqayin-ik",
    message: "Izen / tilqayin (d afrayan)",
    messagePlaceholder: "Tameɣra, awal ara yettwarun, aleqqaf i ilaqen ad yettwassen…",
  },

  calendar: {
    prevMonth: "Ayyur yezrin",
    nextMonth: "Ayyur d-iteddun",
    unavailable: "ur yelli ara",
    minLead: (n: number) => `${n} n wussan uqbel, ma drus`,
  },

  validation: {
    helwaEmpty: "Fren ɣef wudem amecṭuḥ yiwen n uṭuḍ.",
    helwaUnknown: "Yiwen n uṭuḍ ur yelli ara tura. Ttxil-k kkes-it.",
    helwaInvalid: (name: string) => `Amḍan ur yelhi ara i « ${name} ».`,
    helwaMin: (name: string, min: number) => `« ${name} » : ${min} n yiṭuḍan ma drus.`,
    firstName: "Ttxil, ini-d isem-ik.",
    firstNameLong: "Isem ɣezzif aṭas.",
    lastName: "Ttxil, ini-d isem n twacult.",
    lastNameLong: "Isem n twacult ɣezzif aṭas.",
    emailInvalid: "Tansa-a n yimayl tettban-d ur tṣeḥḥa ara.",
    phone: "Ttxil, ini-d uṭṭun-ik n tiliɣri.",
    phoneInvalid: "Uṭṭun-a n tiliɣri yettban-d ur yṣeḥḥa ara.",
    date: "Ttxil, fren azemz n usali.",
    tooSoon: (min: number) => `Tuttriwin ilaq ad ttwaznent ${min} n wussan uqbel, ma drus.`,
    dateUnavailable: "Azemz-a ur yelli ara i usali.",
    dateInvalid: "Azemz-a ur yṣeḥḥa ara.",
    slot: "Ttxil, fren akud n usali.",
    slotUnknown: "Akud-a ur yettwassen ara.",
    servings: "Ttxil, ini-d amḍan n yimdanen.",
    servingsInvalid: "Amḍan n yimdanen ur yṣeḥḥa ara.",
    messageLong: "Izen ɣezzif aṭas.",
    stepChoose: (step: string) => `Asurif « ${step} » : ttxil fren kra.`,
    stepSingle: (step: string) => `Asurif « ${step} » : yiwen n ufran kan.`,
    stepUnknown: (step: string) => `Asurif « ${step} » : afran ur yettwassen ara.`,
    stepNotesLong: (step: string) => `Asurif « ${step} » : tilqayin ɣezzifit aṭas.`,
    stepFlavor: (step: string, flavorLabel: string, option: string) =>
      `Asurif « ${step} » : fren ${flavorLabel.toLowerCase()} i « ${option} ».`,
    customLong: "Yiwet n talqayt teɣzef aṭas.",
  },

  recap: {
    incompleteScript: "qrib…",
    incompleteTitle: "Asnulfu-ik ur yemmid ara ar tura",
    incompleteText: "Kemmel asuddes akken ad tfakkeḍ tuttra-k.",
    resume: "Kemmel asnulfu-inu",
    backToCreation: "← Uɣal ɣer usnulfu-inu",
    eyebrow: "Agzul",
    title1: "Asnulfu-ik,",
    title2: "s yiwet n tmuɣli",
    intro:
      "Senqed yal talqayt uqbel ad tazneḍ tuttra-k. Ur tettwasuter kra ar tura : Roza Bakery ad teɣṛ asnulfu-ik, sakin ad ak-d-terr awal.",
    noPayment: "Ulac lexlaṣ deg usmel.",
    privacy: "Isalan-ik ttwasqedcen kan i tuttra-k akked akken ad k-d-nessiwel.",
    honeypot: "Ur t-ttaččar ara",
    submit: "Ssuter taḥlawt-iw",
    sending: "Tuzna…",
    genericError: "Teḍra-d tuccḍa.",
    networkError: "Tuttra-k ur tezmir ara ad tettwazen tura. Senqed tuqqna-k, ɛreḍ tikkelt nniḍen.",
    myCake: "Taḥlawt-iw",
    pickupTitle: "Azemz n usali",
    date: "Azemz",
    slot: "Akud",
    servings: "Imdanen",
    place: "Amḍiq",
    onSite: "Asali deg tḥanut",
    customerTitle: "Isalan n umsaɣ",
    name: "Isem",
    email: "Imayl",
    phone: "Tiliɣri",
    message: "Izen",
    modify: "Beddel",
    reference: "Tamsisant",
    inspirationJoined: (n: number) => `${n} n tewlafin n tikti yettwarnan`,
    photosAria: "Tiwlafin n tikti",
  },

  confirmation: {
    title: "Tuttra-k tettwazen",
    text: "Tanemmirt ɣef lettkal-ik. Roza Bakery ad teɣṛ asnulfu-ik, sakin ad ak-d-terr awal akken ad ak-d-tini ssuma d wass ma yella yelha.",
    reference: "Tamsisant",
    nextTitle: "Tura acu ?",
    steps: [
      { title: "Taɣuri", text: "Roza Bakery tettɣaṛ asnulfu-ik." },
      { title: "Asentem", text: "Ad k-d-nessiwel akken ad nesentem ssuma d wass." },
      { title: "Asali", text: "Ad d-tawiḍ taḥlawt-ik seg tḥanut, ass i d-temsefhamem." },
    ],
    home: "Uɣal ɣer ugejdan",
    noneTitle: "Ulac tuttra tamaynut",
    noneText: "Tebɣiḍ ad tsuddseḍ taḥlawt tamaynut ?",
  },

  email: {
    helwaSubject: (ref: string) => `Tuttra-k n Helwa tewweḍ-d ♡ (${ref})`,
    helwaTitle: "Tuttra-k tettwazen ♡",
    helwaIntro: (firstName: string) =>
      `Azul ${firstName}, tanemmirt ɣef tuttra-k ! Roza Bakery ad tẓer ma yella yelha, sakin ad ak-d-terr awal akken ad tt-tesentem.`,
    helwaTextIntro: "Tuttra-k tettwazen. Roza Bakery ad tẓer ma yella yelha, sakin ad ak-d-terr awal akken ad tt-tesentem.",
    total: "Akk",
    payOnPickup: "Lexlaṣ asmi ara d-tawiḍ. Asali deg tḥanut kan.",
    customerSubject: (ref: string) => `Tuttra-k n tḥlawt tewweḍ-d ♡ (${ref})`,
    customerTitle: "Tuttra-k tettwazen ♡",
    customerIntro: (firstName: string) =>
      `Azul ${firstName}, tanemmirt ɣef lettkal-ik. Roza Bakery ad teɣṛ asnulfu-ik, sakin ad ak-d-terr awal akken ad ak-d-tini ssuma d wass ma yella yelha.`,
    pickup: "Asali",
    servings: "Imdanen",
    priceNote: "Ssuma n tḥlawt-ik ad ak-tt-id-tini Roza Bakery mi ara teɣṛ tuttra-k. Asali deg tḥanut kan.",
    reference: "Tamsisant",
    hello: (firstName: string) => `Azul ${firstName},`,
    textIntro:
      "Tuttra-k tettwazen. Roza Bakery ad teɣṛ asnulfu-ik, sakin ad ak-d-terr awal akken ad ak-d-tini ssuma d wass ma yella yelha.",
  },

  dates: {
    // Noms des mois et des jours : standard CLDR pour le kabyle
    months: ["Yennayer", "Fuṛar", "Meɣres", "Yebrir", "Mayyu", "Yunyu", "Yulyu", "Ɣuct", "Ctembeṛ", "Tubeṛ", "Nwambeṛ", "Dujembeṛ"],
    weekdays: ["Yanass", "Sanass", "Kraḍass", "Kuẓass", "Samass", "Sḍisass", "Sayass"],
    weekdaysShort: ["Yan", "San", "Kraḍ", "Kuẓ", "Sam", "Sḍis", "Say"],
    long: (weekday: string, day: number, month: string, year: number) => `${weekday} ${day} ${month} ${year}`,
    monthYear: (month: string, year: number) => `${month} ${year}`,
  },
};
