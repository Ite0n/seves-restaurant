# PowerShell: seed menu images from existing dish photography, then replace with generated assets
$base = "c:\Users\Bilal_Ghalayini\Desktop\Seves Restaurant\public\images"
$menu = "$base\menu"
$assets = "C:\Users\Bilal_Ghalayini\.cursor\projects\c-Users-Bilal-Ghalayini-Desktop-Seves-Restaurant\assets"

New-Item -ItemType Directory -Force -Path $menu | Out-Null

$map = @{
  "fraicheur-ete" = "dish-fig-tart-salad.png"
  "tomate-seves" = "dish-labneh-panzanella.png"
  "brioche-saumon" = "dish-mortadella-carpaccio.png"
  "pate-en-croute" = "dish-mortadella-carpaccio.png"
  "tartare-boeuf" = "dish-mortadella-carpaccio.png"
  "crudo-du-jour" = "dish-mortadella-carpaccio.png"
  "aubergine" = "dish-labneh-panzanella.png"
  "amhiye-poulet" = "dish-roast-chicken.png"
  "chevre-chaud" = "dish-fig-tart-white.png"
  "crevettes-mangue" = "dish-fig-tart-salad.png"
  "lentilles-saumon" = "dish-mortadella-carpaccio.png"
  "coquelet" = "dish-roast-chicken.png"
  "filet-boeuf" = "dish-roast-chicken.png"
  "poisson" = "dish-mortadella-carpaccio.png"
  "ballotine-mediterranee" = "dish-roast-chicken.png"
  "supreme-rotie" = "dish-roast-chicken.png"
  "burghul-banadoura" = "dish-labneh-panzanella.png"
  "entrecote" = "dish-roast-chicken.png"
  "pithivier" = "dish-fig-tart-white.png"
  "saumon" = "dish-mortadella-carpaccio.png"
  "gambas-bisque" = "dish-mortadella-carpaccio.png"
  "risotto-siyadiyeh" = "dish-labneh-panzanella.png"
  "steak-choux-fleurs" = "dish-labneh-panzanella.png"
  "awarma-carbonara" = "dish-mortadella-carpaccio.png"
  "panacotta-mangue" = "dish-fig-tart-white.png"
  "tarte-chocolat" = "brand-plate-art.png"
  "nutty-tarte" = "dish-fig-tart-salad.png"
  "cheesecake-orientale" = "dish-fig-tart-white.png"
  "pavlova" = "dish-fig-tart-salad.png"
  "tiramisu-matcha" = "brand-plate-art.png"
  "mille-feuille" = "dish-fig-tart-white.png"
}

foreach ($id in $map.Keys) {
  $src = Join-Path $base $map[$id]
  $dst = Join-Path $menu "$id.png"
  if (Test-Path $src) { Copy-Item $src $dst -Force }
}

# Overlay generated assets (simple filenames only)
if (Test-Path $assets) {
  Get-ChildItem $assets -Filter "*.png" | Where-Object { $_.Name -match '^[a-z0-9-]+\.png$' } | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $menu $_.Name) -Force
  }
}

Write-Host "Menu images ready: $((Get-ChildItem $menu).Count) files"
