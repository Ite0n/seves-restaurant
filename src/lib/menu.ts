export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: string;
  image: string;
};

export type MenuCategory = {
  id: string;
  label: string;
  labelFr: string;
  note: string;
  items: MenuItem[];
};

const img = (id: string) => `/images/menu/${id}.png`;

export const MENU: MenuCategory[] = [
  {
    id: "entrees",
    label: "Starters",
    labelFr: "Nos Entrées",
    note: "Pour commencer l'expérience",
    items: [
      {
        id: "fraicheur-ete",
        name: "Fraîcheur d'Été",
        desc: "Carpaccio de melon, stracciatella, magret fumé, vinaigrette framboise, basilic, pignons de pin",
        price: "23",
        image: img("fraicheur-ete"),
      },
      {
        id: "tomate-seves",
        name: "Tomate Sèves",
        desc: "Tomates confites, crème balsamique, pointe d'ail, labné de chèvre, gel d'arak, sumac, coulis de thym, feuilletée zaatar",
        price: "18",
        image: img("tomate-seves"),
      },
      {
        id: "brioche-saumon",
        name: "Brioche Saumon",
        desc: "Saumon gravlax, brioche citron vert, crémeux d'aneth et câpres, fines herbes, sauce marinière",
        price: "24",
        image: img("brioche-saumon"),
      },
      {
        id: "pate-en-croute",
        name: "Pâté en Croûte",
        desc: "Canard, foie gras, mousseline muhammara, gelée mélasse de grenade, noisettes torréfiées, magrets séchés",
        price: "28",
        image: img("pate-en-croute"),
      },
      {
        id: "tartare-boeuf",
        name: "Tartare de Bœuf",
        desc: "Viande au couteau, tomates séchées, câpres, persil, huile d'olive, crème d'œufs, focaccia toastée, parmesan",
        price: "21",
        image: img("tartare-boeuf"),
      },
      {
        id: "crudo-du-jour",
        name: "Crudo du Jour",
        desc: "Poisson du jour, émulsion de citron confit, piment pickles, radis, espuma de coriandre",
        price: "28",
        image: img("crudo-du-jour"),
      },
      {
        id: "aubergine",
        name: "L'Aubergine",
        desc: "Aubergine à la braise, labné, endives rouges, oignons pickles, grenade, croutons focaccia, huile de basilique",
        price: "18",
        image: img("aubergine"),
      },
    ],
  },
  {
    id: "salades",
    label: "Salads",
    labelFr: "Nos Salades",
    note: "Fraîcheur et équilibre",
    items: [
      {
        id: "amhiye-poulet",
        name: "Amhiye au Poulet",
        desc: "Blanc de poulet à la plancha, blé au thym, kale, tomates cerises colorées, ciboulette, fatteh en crème",
        price: "19",
        image: img("amhiye-poulet"),
      },
      {
        id: "chevre-chaud",
        name: "Chèvre Chaud",
        desc: "Chèvre caramélisé sur feuilletée, fruits rouges, noix de pécan, roquette, sauce balsamique, coulis fruits rouges",
        price: "23",
        image: img("chevre-chaud"),
      },
      {
        id: "crevettes-mangue",
        name: "Crevettes et Mangue",
        desc: "Crevettes, mangue, poivrons grillés, herbes fines, sauce mangue acidulée",
        price: "22",
        image: img("crevettes-mangue"),
      },
      {
        id: "lentilles-saumon",
        name: "Lentilles au Saumon",
        desc: "Saumon fumé, mix de lentilles méditerranéennes, épinards et avocats, sauce printanière",
        price: "24",
        image: img("lentilles-saumon"),
      },
    ],
  },
  {
    id: "classics",
    label: "Classics",
    labelFr: "Les Classics",
    note: "Sauce et garniture au choix",
    items: [
      {
        id: "coquelet",
        name: "Le Coquelet",
        desc: "Demi coquelet désossé, cuit à la braise, garniture et sauce au choix",
        price: "27",
        image: img("coquelet"),
      },
      {
        id: "filet-boeuf",
        name: "Le Filet de Bœuf",
        desc: "Cœur de filet australien MB3, beurre ou braise, garniture et sauce au choix",
        price: "55",
        image: img("filet-boeuf"),
      },
      {
        id: "poisson",
        name: "Le Poisson",
        desc: "Bar de Méditerranée en portefeuille, cuit à la braise, sauce vierge et garniture au choix",
        price: "33",
        image: img("poisson"),
      },
    ],
  },
  {
    id: "principaux",
    label: "Mains",
    labelFr: "Nos Principaux",
    note: "Le cœur de l'assiette",
    items: [
      {
        id: "ballotine-mediterranee",
        name: "Ballotine Méditerranéenne",
        desc: "Volaille farcie champignons et tomates séchées, frikeh, légumes sautés, velouté épinards et vin jaune",
        price: "31",
        image: img("ballotine-mediterranee"),
      },
      {
        id: "supreme-rotie",
        name: "Suprême Rôtie",
        desc: "Suprême de volaille mousseline thym et sumac, vol-au-vent chanklich, purée de carottes, jus de volaille",
        price: "33",
        image: img("supreme-rotie"),
      },
      {
        id: "burghul-banadoura",
        name: "Burghul Banadoura Revisité",
        desc: "Burghul façon risotto, coulis tomates et poivrons, foie d'agneau grillé, huile de menthe, crème yaourt aillée",
        price: "28",
        image: img("burghul-banadoura"),
      },
      {
        id: "entrecote",
        name: "L'Entrecôte",
        desc: "Entrecôte de bœuf Wagyu MB7, mille-feuille de pommes de terre, brocoli grillé, sabayon, sauce vinaigre et ail",
        price: "68",
        image: img("entrecote"),
      },
      {
        id: "pithivier",
        name: "Pithivier",
        desc: "Épaule d'agneau basse température en feuilletée, pilaf de quinoa, carottes et petits pois, jus d'agneau libanais",
        price: "42",
        image: img("pithivier"),
      },
      {
        id: "saumon",
        name: "Le Saumon",
        desc: "Pavé de saumon fondant, osmaliyeh, blette sautée et tarator herbacé",
        price: "38",
        image: img("saumon"),
      },
      {
        id: "gambas-bisque",
        name: "Gambas au Bisque",
        desc: "Gambas grillés laqués au bisque, moughrabieh, tuile de corail",
        price: "32",
        image: img("gambas-bisque"),
      },
      {
        id: "risotto-siyadiyeh",
        name: "Risotto Siyadiyeh",
        desc: "Pavé de maigre, risotto style siyadiyeh, espuma d'oignons frits, tuile au caju",
        price: "33",
        image: img("risotto-siyadiyeh"),
      },
      {
        id: "steak-choux-fleurs",
        name: "Steak Choux Fleurs",
        desc: "Choux-fleurs finis à la braise, tahini muhammara, chimichurri, mélasse",
        price: "22",
        image: img("steak-choux-fleurs"),
      },
      {
        id: "awarma-carbonara",
        name: "Awarma Carbonara",
        desc: "Awarma, jaune d'œuf, parmesan 36 mois, linguini, poudre de zaatar, tuile de parmesan",
        price: "28",
        image: img("awarma-carbonara"),
      },
    ],
  },
  {
    id: "sucres",
    label: "Desserts",
    labelFr: "Nos Sucrés",
    note: "Une finale gracieuse",
    items: [
      {
        id: "panacotta-mangue",
        name: "Panacotta Mangue et Chocolat",
        desc: "Infusion citronnelle sur un tapis de chocolat",
        price: "15",
        image: img("panacotta-mangue"),
      },
      {
        id: "tarte-chocolat",
        name: "Tarte aux Chocolats Fondants",
        desc: "Sablé breton, chocolat fondant, glace vanille",
        price: "12",
        image: img("tarte-chocolat"),
      },
      {
        id: "nutty-tarte",
        name: "Nutty Tarte",
        desc: "Sablé amandes, crème de noix, caramel mou, noix caramélisées, chantilly vanille de Madagascar",
        price: "15",
        image: img("nutty-tarte"),
      },
      {
        id: "cheesecake-orientale",
        name: "Cheese Cake Orientale",
        desc: "Osmaliyeh croustillante, cheesecake saveurs orientales, pistache cristallisée, glace pistaches salées",
        price: "13",
        image: img("cheesecake-orientale"),
      },
      {
        id: "pavlova",
        name: "Sèves Pavlova",
        desc: "Meringue parfumée au rhum, baies variées, coulis fruits rouges, sorbet menthe",
        price: "14",
        image: img("pavlova"),
      },
      {
        id: "tiramisu-matcha",
        name: "Tiramisu Matcha",
        desc: "Mascarpone au matcha, biscuit imbibé, cacao",
        price: "11",
        image: img("tiramisu-matcha"),
      },
      {
        id: "mille-feuille",
        name: "Mille-Feuille Classic",
        desc: "À la gousse de vanille",
        price: "15",
        image: img("mille-feuille"),
      },
    ],
  },
];

export const MENU_CLASSICS_NOTE =
  "Sauces: sabayon aromatisée · au poivre · crème moutarde et thym · vinaigre et ail — Garnitures: légumes du moment · purée · allumettes";
