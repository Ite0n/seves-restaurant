/**
 * Batch-generate menu dish photos via Higgsfield and save to public/images/menu/.
 * Run: node scripts/generate-menu-images.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/images/menu");

const STYLE =
  "Ultra-premium Michelin-star food photography, elegantly plated on artisan white ceramic, dark charcoal table, warm cinematic side lighting, shallow depth of field, appetizing, photorealistic, no text, no watermark, 4:5 vertical";

const DISHES = [
  { id: "fraicheur-ete", prompt: "Summer melon carpaccio with stracciatella, smoked duck breast, raspberry vinaigrette, basil, pine nuts" },
  { id: "tomate-seves", prompt: "Confit tomatoes with goat labneh, balsamic cream, arak gel, sumac, thyme coulis, zaatar puff pastry" },
  { id: "brioche-saumon", prompt: "Salmon gravlax on lime brioche with dill caper cream, fine herbs, mariniere sauce" },
  { id: "pate-en-croute", prompt: "French pate en croute slice with duck foie gras, pomegranate jelly, roasted hazelnuts" },
  { id: "tartare-boeuf", prompt: "Hand-cut beef tartare with sun-dried tomatoes, capers, egg cream, toasted focaccia, parmesan" },
  { id: "crudo-du-jour", prompt: "Fish crudo with preserved lemon emulsion, pickled chili, radish, cilantro espuma" },
  { id: "aubergine", prompt: "Braised whole eggplant with labneh, red endive, pickled onions, pomegranate seeds, focaccia croutons" },
  { id: "amhiye-poulet", prompt: "Lebanese amhiye salad with grilled chicken, herbed wheat, kale, cherry tomatoes, creamy fatteh" },
  { id: "chevre-chaud", prompt: "Caramelized goat cheese on puff pastry with red berries, pecans, arugula, balsamic glaze" },
  { id: "crevettes-mangue", prompt: "Shrimp mango salad with grilled peppers, fine herbs, tangy mango sauce" },
  { id: "lentilles-saumon", prompt: "Smoked salmon with Mediterranean lentil mix, spinach, avocado, spring sauce" },
  { id: "coquelet", prompt: "Half deboned young chicken char-grilled with golden skin, fine dining presentation" },
  { id: "filet-boeuf", prompt: "Australian beef tenderloin MB3 medium rare with elegant garnish, fine dining steak" },
  { id: "poisson", prompt: "Mediterranean sea bass en papillote style, grilled, sauce vierge, herbs" },
  { id: "ballotine-mediterranee", prompt: "Mediterranean chicken ballotine stuffed with mushrooms, frikeh, asparagus, spinach veloute" },
  { id: "supreme-rotie", prompt: "Roasted chicken supreme with thyme sumac mousseline, carrot puree, chicken jus" },
  { id: "burghul-banadoura", prompt: "Bulgur risotto with tomato pepper coulis, grilled lamb liver, mint oil, garlic yogurt" },
  { id: "entrecote", prompt: "Wagyu beef entrecote MB7 with potato mille-feuille, grilled broccoli, sabayon" },
  { id: "pithivier", prompt: "Lamb shoulder pithivier puff pastry with quinoa pilaf, carrots, peas, lamb jus" },
  { id: "saumon", prompt: "Melting salmon fillet with crispy osmaliyeh, sauteed chard, herbaceous tarator" },
  { id: "gambas-bisque", prompt: "Grilled prawns glazed with lobster bisque, moghrabieh pearls, coral tuile" },
  { id: "risotto-siyadiyeh", prompt: "Meagre fish fillet with Lebanese siyadiyeh style risotto, fried onion espuma" },
  { id: "steak-choux-fleurs", prompt: "Whole roasted cauliflower steak with tahini muhammara, chimichurri, molasses" },
  { id: "awarma-carbonara", prompt: "Lebanese awarma carbonara linguini with egg yolk, aged parmesan, zaatar tuile" },
  { id: "panacotta-mangue", prompt: "Mango chocolate panna cotta with lemongrass infusion on chocolate base" },
  { id: "tarte-chocolat", prompt: "Breton shortbread chocolate fondant tart with vanilla ice cream quenelle" },
  { id: "nutty-tarte", prompt: "Nut tart with almond sablé, walnut cream, soft caramel, caramelized nuts, vanilla chantilly" },
  { id: "cheesecake-orientale", prompt: "Oriental cheesecake with crispy osmaliyeh, crystallized pistachio, salted pistachio ice cream" },
  { id: "pavlova", prompt: "Rum meringue pavlova with mixed berries, red fruit coulis, mint sorbet" },
  { id: "tiramisu-matcha", prompt: "Matcha tiramisu with mascarpone layers and cocoa dust, elegant dessert plating" },
  { id: "mille-feuille", prompt: "Classic French vanilla mille-feuille with layered puff pastry and pastry cream" },
];

console.log(`Menu image manifest: ${DISHES.length} dishes → ${OUT_DIR}`);
console.log("Use Higgsfield MCP generate_image with marketing_studio_image model.");
console.log(JSON.stringify(DISHES, null, 2));
