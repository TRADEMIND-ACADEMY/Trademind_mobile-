import { BookOpen, LineChart, ShieldCheck, BrainCircuit, Target, CalendarDays } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useI18n } from "@/i18n/I18nProvider";

const icons = [BookOpen, LineChart, ShieldCheck, BrainCircuit, Target, CalendarDays];

export function Features() {
  const { t } = useI18n();
  return (
    <section id="features" className="border-t border-border bg-obsidian-gradient py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.features.eyebrow} title={t.features.title} description={t.features.description} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((feature, i) => {
            const Icon = icons[i % icons.length] ?? BookOpen;
            return (
              <Reveal
                key={i}
                delay={i * 70}
                className="group relative overflow-hidden rounded-2xl glass-panel p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lux"
              >
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: "color-mix(in oklab, var(--gold) 40%, transparent)" }}
                />
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg hairline text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl text-ivory">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                <p className="mt-6 text-[0.65rem] tracking-[0.24em] text-gold-soft uppercase">{t.features.badge}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
