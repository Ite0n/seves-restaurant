export type Locale = "en" | "fr" | "ar";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "ع" },
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

const ar: Dict = {
  "nav.experience": "التجربة",
  "nav.kitchen": "المطبخ",
  "nav.menu": "القائمة",
  "nav.cellar": "القبو",
  "nav.chef": "الشيف",
  "nav.gallery": "المعرض",
  "nav.visit": "الزيارة",
  "nav.reserve": "احجز",
  "hero.scroll": "مرر",
  "hero.reserve": "احجز طاولة",
  "hero.enter": "ادخل التجربة",
  "season.badge": "صيف 2026 · قائمة تُعدّ كل مساء",
  "reserve.limited": "طاولات محدودة هذا المساء",
  "reserve.available": "طاولات متاحة",
  "sound.on": "الصوت المحيط مفعّل",
  "sound.off": "الصوت المحيط معطّل",
};

const dictionaries: Record<Locale, Dict> = { en, fr, ar };

export function t(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}
