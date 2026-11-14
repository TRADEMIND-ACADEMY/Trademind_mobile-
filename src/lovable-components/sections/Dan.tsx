import { Lock } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/translations";

const copy: Record<Locale, {
  eyebrow: string; title: string; subtitle: string; description: string;
  rulesTitle: string; rules: string[]; previewLabel: string;
  locked: { title: string; tier: string }[];
}> = {
  en: {
    eyebrow: "DAN",
    title: "Discipline & Analysis Navigator",
    subtitle: "Your Trading Intelligence Companion",
    description:
      "DAN is the trading companion built into TRADEMIND ACADEMY. It is software, not a person — and it works only from the data you record in your own journal.",
    rulesTitle: "How DAN works",
    rules: [
      "Specialised exclusively in trading.",
      "Reads only your real journal data — never invents trades, results or emotions.",
      "Says clearly when there is not enough data to conclude.",
      "No signals, no predictions, no promises.",
    ],
    previewLabel: "Preview — locked",
    locked: [
      { title: "DAN Advanced Analysis", tier: "Elite" },
      { title: "Advanced Matrix", tier: "Pro Max" },
      { title: "Advanced Trading Insights", tier: "Elite" },
    ],
  },
  fr: {
    eyebrow: "DAN",
    title: "Discipline & Analysis Navigator",
    subtitle: "Votre compagnon d'intelligence de trading",
    description:
      "DAN est le compagnon de trading intégré à TRADEMIND ACADEMY. C'est un logiciel, pas une personne — et il travaille uniquement à partir des données que vous enregistrez dans votre journal.",
    rulesTitle: "Comment DAN fonctionne",
    rules: [
      "Spécialisé exclusivement dans le trading.",
      "Lit uniquement vos vraies données de journal — n'invente jamais de trades, résultats ou émotions.",
      "Indique clairement lorsque les données sont insuffisantes.",
      "Pas de signaux, pas de prédictions, pas de promesses.",
    ],
    previewLabel: "Aperçu — verrouillé",
    locked: [
      { title: "Analyse avancée DAN", tier: "Elite" },
      { title: "Matrix avancée", tier: "Pro Max" },
      { title: "Insights de trading avancés", tier: "Elite" },
    ],
  },
};

export function Dan() {
  const { locale } = useI18n();
  const c = copy[locale];
  return (
    <section id="dan" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <p className="mt-4 text-center text-xs tracking-[0.28em] text-gold-soft uppercase">{c.subtitle}</p>
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-2xl glass-panel p-8">
            <p className="eyebrow">{c.rulesTitle}</p>
            <ul className="mt-6 space-y-4">
              {c.rules.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1 w-4 shrink-0 bg-gold" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="grid gap-4">
            {c.locked.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl hairline bg-card/50 px-6 py-5">
                <div>
                  <p className="font-display text-lg text-ivory">{item.title}</p>
                  <p className="mt-1 text-[0.62rem] tracking-[0.22em] text-muted-foreground uppercase">{c.previewLabel}</p>
                </div>
                <span className="flex items-center gap-2 rounded-full hairline px-3 py-1.5 text-[0.62rem] tracking-[0.2em] text-gold uppercase">
                  <Lock className="h-3 w-3" /> {item.tier}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
