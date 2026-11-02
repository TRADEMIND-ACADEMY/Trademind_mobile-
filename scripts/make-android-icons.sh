#!/usr/bin/env bash
# Remplace les icônes Android par défaut (logo bleu Capacitor) par le logo officiel TRADEMIND ACADEMY.
# Usage : bash scripts/make-android-icons.sh   (à lancer APRÈS « npx cap add android »)
set -euo pipefail
SRC="public/icons/icon-512.png"
RES="android/app/src/main/res"
[ -f "$SRC" ] || { echo "Logo source introuvable : $SRC"; exit 1; }
[ -d "$RES" ] || { echo "Projet Android introuvable : $RES"; exit 1; }
IM="convert"; command -v convert >/dev/null 2>&1 || IM="magick"
BG="#0E0A16"
gen() { # densité, taille icône, taille calque adaptatif
  local d="$1" s="$2" f="$3" dir="$RES/mipmap-$1"
  mkdir -p "$dir"
  # icône classique (carrée)
  $IM "$SRC" -resize "${s}x${s}" "$dir/ic_launcher.png"
  # icône ronde
  $IM "$SRC" -resize "${s}x${s}" \( -size "${s}x${s}" xc:none -fill white -draw "circle $((s/2)),$((s/2)) $((s/2)),1" \) -compose DstIn -composite "$dir/ic_launcher_round.png"
  # calque adaptatif : logo à 66 % au centre d'un canevas transparent (zone sûre Android)
  local inner=$(( f * 66 / 100 ))
  $IM -size "${f}x${f}" xc:none \( "$SRC" -resize "${inner}x${inner}" \) -gravity center -composite "$dir/ic_launcher_foreground.png"
}
gen mdpi 48 108
gen hdpi 72 162
gen xhdpi 96 216
gen xxhdpi 144 324
gen xxxhdpi 192 432
# fond du calque adaptatif = fond du logo (évite tout liseré)
mkdir -p "$RES/values"
cat > "$RES/values/ic_launcher_background.xml" <<X
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">$BG</color>
</resources>
X
echo "Icônes TRADEMIND générées :"; ls "$RES"/mipmap-*/ic_launcher*.png | wc -l

# ---- Écran de lancement natif (remplace le splash Capacitor par défaut) ----
mkdir -p "$RES/drawable"
mk_splash() { # fichier, largeur, hauteur, taille du logo
  local out="$1" w="$2" h="$3" l="$4"
  mkdir -p "$(dirname "$out")"
  $IM -size "${w}x${h}" "xc:#05060a" \( "$SRC" -resize "${l}x${l}" \) -gravity center -composite "$out"
}
mk_splash "$RES/drawable/splash.png" 480 480 260
for d in "$RES"/drawable-port-* ; do [ -d "$d" ] && mk_splash "$d/splash.png" 1080 1920 520; done
for d in "$RES"/drawable-land-* ; do [ -d "$d" ] && mk_splash "$d/splash.png" 1920 1080 520; done
for d in "$RES"/drawable-night ; do [ -d "$d" ] && mk_splash "$d/splash.png" 480 480 260; done
echo "Splash TRADEMIND généré"
