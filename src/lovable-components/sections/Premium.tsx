import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export function Premium() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden border-t border-border py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--violet) 40%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.premium.eyebrow} title={t.premium.title} description={t.premium.description} />
        <div className="mt-16 overflow-hidden rounded-3xl hairline bg-card/50">
          <div className="flex items-center gap-3 border-b border-border px-8 py-5">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="eyebrow">{t.premium.plannedLabel}</span>
          </div>
          <ul className="divide-y divide-border">
            {t.premium.items.map((cap, i) => (
              <Reveal
                as="li"
                key={i}
                delay={i * 60}
                className="flex flex-col gap-2 px-8 py-7 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between sm:gap-10"
              >
                <div className="sm:max-w-md">
                  <p className="font-display text-lg text-ivory">{cap.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{cap.body}</p>
                </div>
                <span className="shrink-0 self-start rounded-full hairline px-4 py-1.5 text-[0.62rem] tracking-[0.22em] text-gold-soft uppercase sm:self-auto">
                  {t.premium.comingSoon}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
