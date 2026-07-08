import type { Locale } from "@/lib/i18n";
import type { Dish, EventItem, Experience, FaqItem, GalleryItem, Testimonial } from "@/lib/data";
import {
  CHEF as CHEF_BASE,
  CELLAR as CELLAR_BASE,
  GALLERY,
  GIFT_EXPERIENCES as GIFT_BASE,
  RESTAURANT as REST_BASE,
  SIGNATURE_DISHES,
  STORY_IMAGES,
  TASTING_COURSES as COURSES_BASE,
  TASTING_MENU as TASTING_BASE,
  EXPERIENCES as EXP_BASE,
  EVENTS as EVENTS_BASE,
  FAQ,
  TESTIMONIALS,
} from "@/lib/data";

export type WalkthroughCaption = { at: number; title: string; text: string };

export type LocaleData = {
  restaurant: {
    tagline: string;
    descriptor: string;
    hours: { d: string; h: string }[];
    contactDescription: string;
  };
  dishes: Dish[];
  tastingMenu: {
    title: string;
    description: string;
    duration: string;
    winePairing: string;
  };
  tastingCourses: { chapter: string; title: string; desc: string; image: string }[];
  faq: FaqItem[];
  testimonials: Testimonial[];
  chef: {
    title: string;
    quote: string;
    bio: string[];
    accolades: string[];
    cta: string;
  };
  experiences: Experience[];
  events: EventItem[];
  gifts: { id: string; title: string; description: string; price: string; image: string }[];
  cellar: {
    title: string;
    description: string;
    quote: string;
    sommelierTitle: string;
    featured: { name: string; vintage: string; region: string; note: string; price: string }[];
  };
  gallery: GalleryItem[];
  walkthrough: {
    label: string;
    title: string;
    scrollHint: string;
    captions: WalkthroughCaption[];
  };
  story: {
    label: string;
    title: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
    timeline: { id: string; year: string; event: string }[];
  };
};

const en: LocaleData = {
  restaurant: {
    tagline: "Where every plate is a piece of art",
    descriptor: "Fine Dining · Garden Terrace · Bar",
    hours: [{ d: "Daily", h: "12:00 PM — 12:00 AM" }],
    contactDescription: "where fire, water, and the Mediterranean sky meet.",
  },
  dishes: SIGNATURE_DISHES,
  tastingMenu: {
    title: TASTING_BASE.title,
    description: TASTING_BASE.description,
    duration: TASTING_BASE.duration,
    winePairing: `Wine pairing · $${TASTING_BASE.winePairing}`,
  },
  tastingCourses: [...COURSES_BASE],
  faq: FAQ,
  testimonials: TESTIMONIALS,
  chef: {
    title: CHEF_BASE.title,
    quote: CHEF_BASE.quote,
    bio: [...CHEF_BASE.bio],
    accolades: [...CHEF_BASE.accolades],
    cta: "Dine at the Chef's Table",
  },
  experiences: EXP_BASE,
  events: EVENTS_BASE,
  gifts: [...GIFT_BASE],
  cellar: {
    title: "Head Sommelier",
    description:
      "A curated collection of Lebanese icons and Old World classics — poured with intention.",
    quote: CELLAR_BASE.quote,
    sommelierTitle: CELLAR_BASE.title,
    featured: [...CELLAR_BASE.featured],
  },
  gallery: GALLERY,
  walkthrough: {
    label: "The Experience",
    title: "A cinematic walk through Sèves",
    scrollHint: "Scroll to move through the space",
    captions: [
      { at: 0.04, title: "Arrival", text: "The illuminated façade welcomes you into Sèves." },
      { at: 0.22, title: "The Grand Room", text: "Cascading light over marble and emerald velvet." },
      { at: 0.4, title: "The Table", text: "Intimate banquettes framed by living botanicals." },
      { at: 0.58, title: "The Detail", text: "A backlit feather — craft in every surface." },
      { at: 0.74, title: "The Bar", text: "A curated cellar and barrel-aged signatures." },
      { at: 0.9, title: "The Terrace", text: "Fire and water beneath the Dbayeh sky." },
    ],
  },
  story: {
    label: "Our Story",
    title: "The pursuit of the perfect plate",
    paragraphs: [
      "Sèves — French for the lifeblood that rises through every living thing — is our devotion to the seasons. Our brigade sources from local growers and the morning catch, then composes each plate with the patience of an atelier.",
      "Beneath cascading light, between fire and water, we set a stage where dining becomes a quiet performance.",
    ],
    stats: [
      { value: "2024", label: "Established" },
      { value: "14", label: "Course tasting" },
      { value: "1", label: "Open kitchen" },
    ],
    timeline: [
      { id: "open", year: "2024", event: "Sèves opens in Dbayeh — a garden terrace dream realised." },
      { id: "dining-room", year: "2025", event: "The grand dining room unveils beneath cascading light." },
      { id: "chefs-table", year: "2025", event: "Chef's table and private salon launch for intimate gatherings." },
      { id: "recognition", year: "2026", event: "Recognised among the world's most exciting fine-dining rooms." },
    ],
  },
};

const fr: LocaleData = {
  restaurant: {
    tagline: "Où chaque assiette est une œuvre d'art",
    descriptor: "Gastronomie · Terrasse-jardin · Bar",
    hours: [{ d: "Tous les jours", h: "12h00 — 00h00" }],
    contactDescription: "où le feu, l'eau et le ciel méditerranéen se rencontrent.",
  },
  dishes: [
    {
      name: "Pithivier Figues & Pacanes",
      blurb:
        "Tartelette de figues caramélisées, mousse de chèvre flambée, baies sauvages, pacanes confites et balsamique vieilli.",
      price: "32",
      image: "/images/menu/nutty-tarte.png",
      tag: "Signature",
      ingredients: ["Figue", "Fromage de chèvre", "Baies sauvages", "Pacane", "Balsamique"],
    },
    {
      name: "Poularde Rôtie d'Héritage",
      blurb:
        "Poularde nourrie au maïs, grillée au feu de bois, risotto à l'estragon, jus au rosé et tomates confites.",
      price: "44",
      image: "/images/menu/supreme-rotie.png",
      tag: "Du feu",
      ingredients: ["Poularde", "Risotto estragon", "Jus rosé", "Tomate confite"],
    },
    {
      name: "Carpaccio de Mortadelle",
      blurb:
        "Mortadelle tranchée à la main, ricotta pistache fouettée, airelles, zeste de citron et tuile dentelle.",
      price: "28",
      image: "/images/menu/pate-en-croute.png",
      tag: "Charcuterie",
      ingredients: ["Mortadelle", "Ricotta pistache", "Airelle", "Zeste de citron"],
    },
    {
      name: "Labné & Panzanella Grillée",
      blurb:
        "Labné égoutté, croûtons au levain, radis marinés, grenade et filet d'huile au piment d'Alep.",
      price: "26",
      image: "/images/menu/tomate-seves.png",
      tag: "Jardin",
      ingredients: ["Labné", "Levain", "Radis mariné", "Grenade", "Huile d'Alep"],
    },
  ],
  tastingMenu: {
    title: "Le Voyage Sèves",
    description:
      "Une progression chorégraphiée à travers les saisons — du jardin au feu, de la cave au sucré — composée chaque soir par notre brigade.",
    duration: "3h30",
    winePairing: "Accord mets-vins · 95 $",
  },
  tastingCourses: [
    { chapter: "Jardin", title: "Amuse & Jardin", desc: "Tomate Sèves, labné, herbes des plates-bandes de la terrasse.", image: "/images/menu/tomate-seves.png" },
    { chapter: "Mer", title: "De la Côte", desc: "Crudo du jour, ceviche de pêche méditerranéenne.", image: "/images/menu/crudo-du-jour.png" },
    { chapter: "Feu", title: "Braises & Fumée", desc: "Rôti d'héritage, légumes grillés, réduction de jus.", image: "/images/menu/supreme-rotie.png" },
    { chapter: "Terroir", title: "Terroir", desc: "Entrecôte Wagyu, pithivier d'agneau, burghul revisité.", image: "/images/menu/entrecote.png" },
    { chapter: "Cave", title: "Interlude", desc: "Service du sommelier — un pont entre le salé et le sucré.", image: "/images/interior-winecart-dusk.png" },
    { chapter: "Sucré", title: "Finale", desc: "Tarte aux noix, pavlova, mille-feuille — notes de grâce.", image: "/images/menu/nutty-tarte.png" },
  ],
  faq: [
    { q: "Quel est le code vestimentaire ?", a: "Élégance sobre. Nous invitons nos hôtes à s'habiller avec intention — la soirée fait partie de l'expérience." },
    { q: "Accueillez-vous les régimes alimentaires ?", a: "Absolument. Merci de préciser allergies et préférences lors de la réservation ; notre cuisine composera des alternatives avec le même soin." },
    { q: "Combien de temps à l'avance réserver ?", a: "Nous recommandons 2 à 3 semaines pour les week-ends. La table du chef et la salle privée nécessitent un préavis supplémentaire." },
    { q: "Y a-t-il un service de voiturier ?", a: "Le voiturier est offert du mardi au dimanche à partir de 18h. Un stationnement est également disponible sur Kabalen el Achkar." },
    { q: "Puis-je offrir une expérience ?", a: "Des chèques-cadeaux pour les menus dégustation et la salle privée sont disponibles par e-mail. Contactez notre maître d'hôtel pour les détails." },
    { q: "Proposez-vous une carte bar ?", a: "Le bar accueille les visiteurs à partir de 17h avec une carte de petites assiettes et des cocktails signature." },
  ],
  testimonials: [
    { quote: "Une soirée chez Sèves, c'est du théâtre. La lumière, l'assiette, le silence entre les services — cela reste des jours entiers.", author: "L'Orient Gourmand", role: "Critique gastronomique" },
    { quote: "Chaque assiette est vraiment une œuvre d'art. La cuisine la plus sereinement confiante de la ville.", author: "Maya Haddad", role: "Rédactrice culinaire" },
    { quote: "La terrasse à l'heure bleue, le feu et l'eau de chaque côté — du pur cinéma. Service irréprochable.", author: "James Whitmore", role: "Travel & Leisure" },
    { quote: "Raffiné sans prétention. Le poulet d'héritage seul vaut le voyage jusqu'à Beyrouth.", author: "Chef Antoine R.", role: "Chef deux étoiles Michelin" },
  ],
  chef: {
    title: "Chef & Propriétaire",
    quote: "Nous cuisinons ce que la terre offre ce matin-là — rien de plus, rien de moins. Chaque assiette doit sembler inévitable.",
    bio: [
      "Michel Bacha a fondé Sèves avec une vision singulière : un restaurant où le terroir libanais rencontre la technique européenne, dressé avec la retenue d'une galerie.",
      "Sa cuisine ouverte est à la fois scène et atelier — un lieu où le feu, la saisonnalité et le savoir-faire convergent sous une lumière en cascade.",
    ],
    accolades: [
      "World's 50 Best — Discovery",
      "Gault & Millau — 18/20",
      "L'Orient Gourmand — Table de l'année",
    ],
    cta: "Dîner à la Table du Chef",
  },
  experiences: [
    {
      id: "private-dining",
      title: "Salle Privée",
      subtitle: "Le Salon du Jardin",
      description: "Un salon clos surplombant la terrasse — menus sur mesure, service dédié et sélection de cave pour votre occasion.",
      image: "/images/interior-banquette-garden.png",
      capacity: "Jusqu'à 14 convives",
      from: "Sur demande",
    },
    {
      id: "chef-table",
      title: "Table du Chef",
      subtitle: "Au Pass",
      description: "Six places au cœur de la cuisine. Observez la brigade composer chaque service au fil de la soirée.",
      image: "/images/interior-dining-banquette.png",
      capacity: "6 convives",
      from: "220 $ / pers.",
    },
    {
      id: "terrace-events",
      title: "Événements Terrasse",
      subtitle: "Feu & Eau",
      description: "Célébrez sous le ciel de Beyrouth — braseros, bassins miroirs et un menu pensé pour les rassemblements à l'heure dorée.",
      image: "/images/venue-pool-night.png",
      capacity: "Jusqu'à 80 convives",
      from: "Sur demande",
    },
  ],
  events: [
    {
      id: "wine-dinner-july",
      date: "2026-07-18",
      title: "Dîner Vins de la Bekaa",
      subtitle: "Six services · Six verres",
      description: "Une soirée dédiée aux vignerons libanais — chaque plat accordé à un millésime rare de notre cave.",
      image: "/images/interior-winecart-dusk.png",
      price: "165 $ / pers.",
    },
    {
      id: "guest-chef-august",
      date: "2026-08-22",
      title: "Série Chef Invité",
      subtitle: "Chef Antoine R.",
      description: "Un chef deux étoiles Michelin prend les fourneaux pour une nuit — un menu collaboratif avec Michel Bacha.",
      image: "/images/team-chefs.png",
      price: "220 $ / pers.",
    },
    {
      id: "terrace-blue-hour",
      date: "2026-09-05",
      title: "Heure Bleue sur la Terrasse",
      subtitle: "Feu & Eau",
      description: "Canapés à l'heure dorée, cuisine au feu vivant et cocktails tandis que les lumières de la ville s'éveillent.",
      image: "/images/exterior-terrace-night.png",
      price: "95 $ / pers.",
    },
  ],
  gifts: [
    { id: "tasting-gift", title: "Le Voyage Sèves", description: "Chèque-cadeau pour notre menu dégustation 14 services — valable 12 mois.", price: "185 $", image: "/images/brand-monument-sign.png" },
    { id: "chefs-table-gift", title: "Table du Chef", description: "Six places au pass — une soirée inoubliable pour deux.", price: "440 $", image: "/images/interior-dining-banquette.png" },
    { id: "private-dining-gift", title: "Salle Privée", description: "Le Salon du Jardin — menu sur mesure jusqu'à 14 convives.", price: "Sur demande", image: "/images/interior-banquette-garden.png" },
  ],
  cellar: {
    title: "Chef Sommelier",
    description: "Une collection de grands noms libanais et de classiques du Vieux Monde — servie avec intention.",
    quote: "Notre cave est un dialogue entre l'Ancien Monde et le Levant — chaque bouteille choisie pour honorer l'assiette qui la précède.",
    sommelierTitle: "Chef Sommelier",
    featured: [
      { name: "Château Musar", vintage: "2016", region: "Vallée de la Bekaa", note: "Assemblage libanais iconique — figue, cuir, épices.", price: "18" },
      { name: "Domaine des Tourelles", vintage: "2020", region: "Liban", note: "Élégance de cinsault aux herbes méditerranéennes.", price: "14" },
      { name: "Krug", vintage: "Grande Cuvée", region: "Champagne", note: "Célébration en verre — brioche et agrumes.", price: "45" },
      { name: "Gaja", vintage: "2019", region: "Barbaresco", note: "Finesse de nebbiolo — rose, goudron, tanins soyeux.", price: "38" },
    ],
  },
  gallery: [
    { src: "/images/interior-dining-banquette.png", alt: "Salle principale aux banquettes en velours émeraude", span: "col-span-2 row-span-2 md:col-span-6 md:row-span-2" },
    { src: "/images/interior-feather-art.png", alt: "Sculpture de plumes rétroéclairée et bar", span: "col-span-1 row-span-1 md:col-span-3" },
    { src: "/images/bar-bonsai-night.png", alt: "Bar avec bonsaï et spiritueux sélectionnés", span: "col-span-1 row-span-1 md:col-span-3" },
    { src: "/images/interior-pendant-room.png", alt: "Salle à manger sous des suspensions en cascade", span: "col-span-2 row-span-1 md:col-span-6" },
    { src: "/images/exterior-firewater-city.png", alt: "Terrasse avec braseros et jeux d'eau", span: "col-span-1 row-span-1 md:col-span-4 md:row-span-2" },
    { src: "/images/exterior-terrace-night.png", alt: "Terrasse-jardin au crépuscule", span: "col-span-1 row-span-1 md:col-span-4" },
    { src: "/images/interior-banquette-windows.png", alt: "Banquettes face aux fenêtres au crépuscule", span: "col-span-1 row-span-1 md:col-span-4" },
    { src: "/images/interior-winecart-dusk.png", alt: "Service des vins à l'heure dorée", span: "col-span-2 row-span-1 md:col-span-5" },
    { src: "/images/interior-bonsai-window.png", alt: "Centre de table bonsaï sur marbre", span: "col-span-1 row-span-1 md:col-span-4" },
    { src: "/images/bar-stools-night.png", alt: "Le bar après la tombée de la nuit", span: "col-span-1 row-span-1 md:col-span-3" },
    { src: "/images/interior-banquette-garden.png", alt: "Banquette avec vue sur le jardin", span: "col-span-1 row-span-1 md:col-span-4" },
  ],
  walkthrough: {
    label: "L'expérience",
    title: "Une promenade cinématographique chez Sèves",
    scrollHint: "Défiler pour traverser l'espace",
    captions: [
      { at: 0.04, title: "L'arrivée", text: "La façade illuminée vous accueille chez Sèves." },
      { at: 0.22, title: "La Grande Salle", text: "Une lumière en cascade sur le marbre et le velours émeraude." },
      { at: 0.4, title: "La Table", text: "Des banquettes intimes encadrées de végétaux vivants." },
      { at: 0.58, title: "Le Détail", text: "Une plume rétroéclairée — l'artisanat dans chaque surface." },
      { at: 0.74, title: "Le Bar", text: "Une cave sélectionnée et des signatures vieillies en fût." },
      { at: 0.9, title: "La Terrasse", text: "Feu et eau sous le ciel de Dbayeh." },
    ],
  },
  story: {
    label: "Notre histoire",
    title: "La quête de l'assiette parfaite",
    paragraphs: [
      "Sèves — la sève qui monte en chaque être vivant — est notre dévotion aux saisons. Notre brigade s'approvisionne auprès des producteurs locaux et de la pêche du matin, puis compose chaque assiette avec la patience d'un atelier.",
      "Sous une lumière en cascade, entre le feu et l'eau, nous dressons une scène où le repas devient une performance silencieuse.",
    ],
    stats: [
      { value: "2024", label: "Fondation" },
      { value: "14", label: "Services dégustation" },
      { value: "1", label: "Cuisine ouverte" },
    ],
    timeline: [
      { id: "open", year: "2024", event: "Sèves ouvre à Dbayeh — un rêve de terrasse-jardin réalisé." },
      { id: "dining-room", year: "2025", event: "La grande salle se dévoile sous une lumière en cascade." },
      { id: "chefs-table", year: "2025", event: "Lancement de la table du chef et du salon privé." },
      { id: "recognition", year: "2026", event: "Reconnu parmi les salles gastronomiques les plus excitantes au monde." },
    ],
  },
};

const data: Record<Locale, LocaleData> = { en, fr };

export function getLocaleData(locale: Locale): LocaleData {
  return data[locale];
}

export { STORY_IMAGES, REST_BASE as RESTAURANT, CHEF_BASE as CHEF };
