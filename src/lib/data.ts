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
  contactImage: "/images/exterior-terrace-night.png",
} as const;

export type Dish = {
  name: string;
  blurb: string;
  price: string;
  image: string;
  tag: string;
};

export const SIGNATURE_DISHES: Dish[] = [
  {
    name: "Fig & Pecan Pithivier",
    blurb:
      "Caramelised fig tart crowned with torched goat-cheese mousse, wild berries, candied pecans and aged balsamic.",
    price: "32",
    image: "/images/menu/nutty-tarte.png",
    tag: "Signature",
  },
  {
    name: "Heritage Roast Chicken",
    blurb:
      "Corn-fed poularde, charred over embers, laid on a tarragon-herb risotto with rosé jus and confit tomatoes.",
    price: "44",
    image: "/images/menu/supreme-rotie.png",
    tag: "From the fire",
  },
  {
    name: "Mortadella Carpaccio",
    blurb:
      "Hand-shaved mortadella over whipped pistachio ricotta, lingonberries, lemon zest and lace tuile.",
    price: "28",
    image: "/images/menu/pate-en-croute.png",
    tag: "Cold cuts",
  },
  {
    name: "Labneh & Charred Panzanella",
    blurb:
      "Strained labneh, sourdough croutons, pickled radish, pomegranate and a whisper of Aleppo pepper oil.",
    price: "26",
    image: "/images/menu/tomate-seves.png",
    tag: "Garden",
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
  { src: "/images/interior-dining-banquette.png", alt: "Main dining room with emerald velvet banquettes", span: "md:col-span-2 md:row-span-2" },
  { src: "/images/interior-feather-art.png", alt: "Backlit feather sculpture and bar", span: "" },
  { src: "/images/bar-bonsai-night.png", alt: "Bar with bonsai and curated spirits", span: "" },
  { src: "/images/interior-pendant-room.png", alt: "Dining room beneath cascading pendant lights", span: "md:col-span-2" },
  { src: "/images/interior-banquette-windows.png", alt: "Window seating at dusk", span: "" },
  { src: "/images/exterior-firewater-city.png", alt: "Terrace with fire bowls and water features", span: "md:row-span-2" },
  { src: "/images/interior-bonsai-window.png", alt: "Bonsai centerpiece on marble", span: "" },
  { src: "/images/interior-winecart-dusk.png", alt: "Wine service at golden hour", span: "md:col-span-2" },
  { src: "/images/bar-stools-night.png", alt: "The bar after dark", span: "" },
  { src: "/images/interior-banquette-garden.png", alt: "Garden-view banquette", span: "" },
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
  team: "/images/team-chefs.png",
  ambience: "/images/ambience-table-setting.png",
  plateArt: "/images/brand-plate-art.png",
  monument: "/images/brand-monument-sign.png",
} as const;

export const CHEF = {
  name: "Chef Michel Bacha",
  shortName: "Michel",
  title: "Chef & Owner",
  image: "/images/team-chefs.png",
  portrait: "/images/interior-banquette-corner.png",
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
    image: "/images/interior-banquette-garden.png",
    capacity: "Up to 14 guests",
    from: "On request",
  },
  {
    id: "chef-table",
    title: "Chef's Table",
    subtitle: "At the Pass",
    description:
      "Six seats at the heart of the kitchen. Watch the brigade compose each course as the evening unfolds in real time.",
    image: "/images/interior-dining-banquette.png",
    capacity: "6 guests",
    from: "$220 pp",
  },
  {
    id: "terrace-events",
    title: "Terrace Events",
    subtitle: "Fire & Water",
    description:
      "Celebrate beneath the Beirut sky — fire bowls, reflecting pools, and a menu designed for golden-hour gatherings.",
    image: "/images/venue-pool-night.png",
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

export const PRESS = [
  "L'Orient Gourmand",
  "Condé Nast Traveller",
  "World's 50 Best",
  "Gault & Millau",
  "Travel & Leisure",
  "Michelin Guide",
] as const;

export const NAV_LINKS = [
  { label: "Experience", href: "#walkthrough" },
  { label: "Kitchen", href: "#dishes" },
  { label: "Menu", href: "#menu" },
  { label: "Chef", href: "#chef" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#contact" },
] as const;
