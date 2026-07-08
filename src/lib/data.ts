export const RESTAURANT = {
  name: "Sèves",
  tagline: "Where every plate is a piece of art",
  descriptor: "Fine Dining · Garden Terrace · Bar",
  city: "Dbayeh",
  country: "Lebanon",
  phone: "+961 70 553 301",
  email: "info@seveslb.com",
  streetAddress: "Kabalen el Achkar",
  address: "Kabalen el Achkar, Dbayeh — Mount Lebanon, Lebanon",
  hours: [{ d: "Daily", h: "12:00 PM — 12:00 AM" }],
  social: {
    instagram: "https://www.instagram.com/seves.lb",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
  mapsUrl: "https://maps.app.goo.gl/jSBUZVytPz7Qz9qD6",
  coordinates: { lat: 33.9495, lng: 35.5925 },
  contactImage: "/images/exterior-terrace-night.webp",
} as const;

export type Dish = {
  name: string;
  blurb: string;
  price: string;
  image: string;
  tag: string;
  ingredients: string[];
};

export const SIGNATURE_DISHES: Dish[] = [
  {
    name: "Fig & Pecan Pithivier",
    blurb:
      "Caramelised fig tart crowned with torched goat-cheese mousse, wild berries, candied pecans and aged balsamic.",
    price: "32",
    image: "/images/menu/nutty-tarte.webp",
    tag: "Signature",
    ingredients: ["Fig", "Goat cheese", "Wild berries", "Pecan", "Balsamic"],
  },
  {
    name: "Heritage Roast Chicken",
    blurb:
      "Corn-fed poularde, charred over embers, laid on a tarragon-herb risotto with rosé jus and confit tomatoes.",
    price: "44",
    image: "/images/menu/supreme-rotie.webp",
    tag: "From the fire",
    ingredients: ["Corn-fed poularde", "Tarragon risotto", "Rosé jus", "Confit tomato"],
  },
  {
    name: "Mortadella Carpaccio",
    blurb:
      "Hand-shaved mortadella over whipped pistachio ricotta, lingonberries, lemon zest and lace tuile.",
    price: "28",
    image: "/images/menu/pate-en-croute.webp",
    tag: "Cold cuts",
    ingredients: ["Mortadella", "Pistachio ricotta", "Lingonberry", "Lemon zest"],
  },
  {
    name: "Labneh & Charred Panzanella",
    blurb:
      "Strained labneh, sourdough croutons, pickled radish, pomegranate and a whisper of Aleppo pepper oil.",
    price: "26",
    image: "/images/menu/tomate-seves.webp",
    tag: "Garden",
    ingredients: ["Labneh", "Sourdough", "Pickled radish", "Pomegranate", "Aleppo oil"],
  },
];

export const TASTING_MENU = {
  title: "The Sèves Journey",
  courses: 14,
  price: "185",
  duration: "3.5 hours",
  winePairing: "95",
  description:
    "A choreographed progression through the seasons — from garden to fire, cellar to sweet — composed nightly by our brigade.",
} as const;

export type GalleryItem = { src: string; alt: string; span: string };

export const GALLERY: GalleryItem[] = [
  {
    src: "/images/interior-dining-banquette.webp",
    alt: "Main dining room with emerald velvet banquettes",
    span: "col-span-2 row-span-2 md:col-span-6 md:row-span-2",
  },
  {
    src: "/images/interior-feather-art.webp",
    alt: "Backlit feather sculpture and bar",
    span: "col-span-1 row-span-1 md:col-span-3",
  },
  {
    src: "/images/bar-bonsai-night.webp",
    alt: "Bar with bonsai and curated spirits",
    span: "col-span-1 row-span-1 md:col-span-3",
  },
  {
    src: "/images/interior-pendant-room.webp",
    alt: "Dining room beneath cascading pendant lights",
    span: "col-span-2 row-span-1 md:col-span-6",
  },
  {
    src: "/images/exterior-firewater-city.webp",
    alt: "Terrace with fire bowls and water features",
    span: "col-span-1 row-span-1 md:col-span-4 md:row-span-2",
  },
  {
    src: "/images/exterior-terrace-night.webp",
    alt: "Garden terrace at twilight",
    span: "col-span-1 row-span-1 md:col-span-4",
  },
  {
    src: "/images/interior-banquette-windows.webp",
    alt: "Window seating at dusk",
    span: "col-span-1 row-span-1 md:col-span-4",
  },
  {
    src: "/images/interior-winecart-dusk.webp",
    alt: "Wine service at golden hour",
    span: "col-span-2 row-span-1 md:col-span-5",
  },
  {
    src: "/images/interior-bonsai-window.webp",
    alt: "Bonsai centerpiece on marble",
    span: "col-span-1 row-span-1 md:col-span-4",
  },
  {
    src: "/images/bar-stools-night.webp",
    alt: "The bar after dark",
    span: "col-span-1 row-span-1 md:col-span-3",
  },
  {
    src: "/images/interior-banquette-garden.webp",
    alt: "Garden-view banquette",
    span: "col-span-1 row-span-1 md:col-span-4",
  },
];

export type Testimonial = { quote: string; author: string; role: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "An evening at Sèves is theatre. The light, the plating, the silence between courses — it lingers for days.",
    author: "L'Orient Gourmand",
    role: "Restaurant Critic",
  },
  {
    quote:
      "Every plate truly is a piece of art. The most quietly confident kitchen in the city.",
    author: "Maya Haddad",
    role: "Food Editor",
  },
  {
    quote:
      "The terrace at blue hour, fire and water on either side — pure cinema. Faultless service.",
    author: "James Whitmore",
    role: "Travel & Leisure",
  },
  {
    quote:
      "Refined without pretension. The heritage chicken alone is worth the journey to Beirut.",
    author: "Chef Antoine R.",
    role: "Two-Michelin-star Chef",
  },
];

export const STORY_IMAGES = {
  team: "/images/team-chefs.webp",
  ambience: "/images/ambience-table-setting.webp",
  plateArt: "/images/brand-monument-sign.webp",
} as const;

export const CHEF = {
  name: "Chef Michel Bacha",
  shortName: "Michel",
  title: "Chef & Owner",
  image: "/images/team-chefs.webp",
  portrait: "/images/interior-banquette-corner.webp",
  quote:
    "We cook what the land offers that morning — nothing more, nothing less. Every plate should feel inevitable.",
  bio: [
    "Michel Bacha founded Sèves with a singular vision: a restaurant where Lebanese terroir meets European technique, plated with the restraint of a gallery.",
    "His open kitchen is both stage and atelier — a place where fire, seasonality, and craft converge beneath cascading light.",
  ],
  accolades: [
    "World's 50 Best — Discovery",
    "Gault & Millau — 18/20",
    "L'Orient Gourmand — Table of the Year",
  ],
} as const;

export type Experience = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  capacity: string;
  from: string;
};

export const EXPERIENCES: Experience[] = [
  {
    id: "private-dining",
    title: "Private Dining",
    subtitle: "The Garden Room",
    description:
      "An enclosed salon overlooking the terrace — bespoke menus, dedicated service, and a cellar selection curated for your occasion.",
    image: "/images/interior-banquette-garden.webp",
    capacity: "Up to 14 guests",
    from: "On request",
  },
  {
    id: "chef-table",
    title: "Chef's Table",
    subtitle: "At the Pass",
    description:
      "Six seats at the heart of the kitchen. Watch the brigade compose each course as the evening unfolds in real time.",
    image: "/images/interior-dining-banquette.webp",
    capacity: "6 guests",
    from: "$220 pp",
  },
  {
    id: "terrace-events",
    title: "Terrace Events",
    subtitle: "Fire & Water",
    description:
      "Celebrate beneath the Beirut sky — fire bowls, reflecting pools, and a menu designed for golden-hour gatherings.",
    image: "/images/venue-pool-night.webp",
    capacity: "Up to 80 guests",
    from: "On request",
  },
];

export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    q: "What is the dress code?",
    a: "Smart elegant. We invite guests to dress with intention — the evening is part of the experience.",
  },
  {
    q: "Do you accommodate dietary requirements?",
    a: "Absolutely. Please note allergies and preferences when booking; our kitchen will compose alternatives with the same care.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend reserving 2–3 weeks ahead for weekends. Private dining and the chef's table require additional notice.",
  },
  {
    q: "Is there valet parking?",
    a: "Complimentary valet is available Tuesday through Sunday from 18:00. Street parking is also available on Kabalen el Achkar.",
  },
  {
    q: "Can I purchase a gift experience?",
    a: "Gift certificates for tasting menus and private dining are available by email. Contact our maître d' for details.",
  },
  {
    q: "Do you offer a bar menu?",
    a: "The bar welcomes walk-ins from 17:00 with a curated small-plates menu and signature cocktails.",
  },
];

export const NAV_LINKS = [
  { label: "Experience", href: "#walkthrough", i18nKey: "nav.experience" },
  { label: "Kitchen", href: "#dishes", i18nKey: "nav.kitchen" },
  { label: "Menu", href: "#menu", i18nKey: "nav.menu" },
  { label: "Cellar", href: "#cellar", i18nKey: "nav.cellar" },
  { label: "Chef", href: "#chef", i18nKey: "nav.chef" },
  { label: "Gallery", href: "#gallery", i18nKey: "nav.gallery" },
  { label: "Visit", href: "#contact", i18nKey: "nav.visit" },
] as const;

export const TASTING_COURSES = [
  { chapter: "Garden", title: "Amuse & Garden", desc: "Tomate Sèves, labneh, herbs from the terrace beds.", image: "/images/menu/tomate-seves.webp" },
  { chapter: "Sea", title: "From the Coast", desc: "Crudo du jour, ceviche of Mediterranean catch.", image: "/images/menu/crudo-du-jour.webp" },
  { chapter: "Fire", title: "Embers & Smoke", desc: "Heritage roast, charred vegetables, jus reduction.", image: "/images/menu/supreme-rotie.webp" },
  { chapter: "Land", title: "Terroir", desc: "Wagyu entrecôte, lamb pithivier, burghul revisité.", image: "/images/menu/entrecote.webp" },
  { chapter: "Cellar", title: "Interlude", desc: "Sommelier pour — a bridge between savoury and sweet.", image: "/images/interior-winecart-dusk.webp" },
  { chapter: "Sweet", title: "Finale", desc: "Nutty tarte, pavlova, mille-feuille — grace notes.", image: "/images/menu/nutty-tarte.webp" },
] as const;

export const CELLAR = {
  sommelier: "Marie-Claire Khoury",
  title: "Head Sommelier",
  quote: "Our cellar is a dialogue between the Old World and the Levant — each bottle chosen to honour the plate before it.",
  featured: [
    { name: "Château Musar", vintage: "2016", region: "Bekaa Valley", note: "Iconic Lebanese blend — fig, leather, spice.", price: "18" },
    { name: "Domaine des Tourelles", vintage: "2020", region: "Lebanon", note: "Cinsault elegance with Mediterranean herbs.", price: "14" },
    { name: "Krug", vintage: "Grande Cuvée", region: "Champagne", note: "Celebration in a glass — brioche and citrus.", price: "45" },
    { name: "Gaja", vintage: "2019", region: "Barbaresco", note: "Nebbiolo finesse — rose, tar, silk tannins.", price: "38" },
  ],
  image: "/images/interior-winecart-dusk.webp",
} as const;

export type EventItem = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price?: string;
};

export const EVENTS: EventItem[] = [
  {
    id: "wine-dinner-july",
    date: "2026-07-18",
    title: "Bekaa Valley Wine Dinner",
    subtitle: "Six courses · Six pours",
    description: "An evening dedicated to Lebanese winemakers — each course paired with a rare vintage from our cellar.",
    image: "/images/interior-winecart-dusk.webp",
    price: "$165 pp",
  },
  {
    id: "guest-chef-august",
    date: "2026-08-22",
    title: "Guest Chef Series",
    subtitle: "Chef Antoine R.",
    description: "A two-Michelin-star guest takes the pass for one night only — a collaborative menu with Michel Bacha.",
    image: "/images/team-chefs.webp",
    price: "$220 pp",
  },
  {
    id: "terrace-blue-hour",
    date: "2026-09-05",
    title: "Blue Hour on the Terrace",
    subtitle: "Fire & Water",
    description: "Golden-hour canapés, live fire cooking, and cocktails as the city lights awaken.",
    image: "/images/exterior-terrace-night.webp",
    price: "$95 pp",
  },
];

export const GIFT_EXPERIENCES = [
  {
    id: "tasting-gift",
    title: "The Sèves Journey",
    description: "Gift certificate for our 14-course tasting menu — valid 12 months.",
    price: "$185",
    image: "/images/brand-monument-sign.webp",
  },
  {
    id: "chefs-table-gift",
    title: "Chef's Table",
    description: "Six seats at the pass — an unforgettable evening for two.",
    price: "$440",
    image: "/images/interior-dining-banquette.webp",
  },
  {
    id: "private-dining-gift",
    title: "Private Dining",
    description: "The Garden Room — bespoke menu for up to 14 guests.",
    price: "On request",
    image: "/images/interior-banquette-garden.webp",
  },
] as const;

export const PRESS_LOGOS = [
  { name: "Michelin Guide", abbr: "MICHELIN" },
  { name: "World's 50 Best", abbr: "50 BEST" },
  { name: "Gault & Millau", abbr: "G&M" },
  { name: "Condé Nast Traveller", abbr: "CN" },
  { name: "Travel & Leisure", abbr: "T&L" },
  { name: "L'Orient Gourmand", abbr: "LOG" },
] as const;

export const SEASON = {
  label: "Summer 2026",
  note: "Menu composed nightly",
} as const;
