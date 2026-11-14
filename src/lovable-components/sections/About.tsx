import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useI18n } from "@/i18n/I18nProvider";

export function About() {
  const { t } = useI18n();
  const pillars = t.about.pillars;
  return (
    <section id="about" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} description={t.about.description} />
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={i} delay={i * 70} className="group bg-card/60 p-8 transition-colors hover:bg-card">
              <p className="font-display text-xl text-ivory">{pillar.title}</p>
              <div className="gold-rule mt-4 w-12 transition-all duration-500 group-hover:w-20" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </Reveal>
          ))}
          <Reveal delay={pillars.length * 70} className="flex items-center bg-secondary/40 p-8">
            <p className="font-display text-2xl leading-snug text-gradient-gold">{t.about.quote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
