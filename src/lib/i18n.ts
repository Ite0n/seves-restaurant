export type Locale = "en" | "fr";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.experience": "Experience",
  "nav.kitchen": "Kitchen",
  "nav.menu": "Menu",
  "nav.cellar": "Cellar",
  "nav.chef": "Chef",
  "nav.gallery": "Gallery",
  "nav.visit": "Visit",
  "nav.reserve": "Reserve",
  "hero.scroll": "Scroll",
  "hero.reserve": "Reserve a Table",
  "hero.enter": "Enter the Experience",
  "season.badge": "Summer 2026 · Menu composed nightly",
  "reserve.limited": "Limited tables this evening",
  "reserve.available": "Tables available",
  "sound.on": "Ambient sound on",
  "sound.off": "Ambient sound off",
};

const fr: Dict = {
  "nav.experience": "L'expérience",
  "nav.kitchen": "Cuisine",
  "nav.menu": "Menu",
  "nav.cellar": "Cave",
  "nav.chef": "Chef",
  "nav.gallery": "Galerie",
  "nav.visit": "Visite",
  "nav.reserve": "Réserver",
  "hero.scroll": "Défiler",
  "hero.reserve": "Réserver une table",
  "hero.enter": "Entrer dans l'expérience",
  "season.badge": "Été 2026 · Menu composé chaque soir",
  "reserve.limited": "Tables limitées ce soir",
  "reserve.available": "Tables disponibles",
  "sound.on": "Ambiance sonore activée",
  "sound.off": "Ambiance sonore désactivée",
};

const dictionaries: Record<Locale, Dict> = { en, fr };

export function t(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}
