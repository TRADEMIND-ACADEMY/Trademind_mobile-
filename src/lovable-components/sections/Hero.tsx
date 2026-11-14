import { useI18n } from "@/i18n/I18nProvider";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { MarketVisual } from "@/components/sections/MarketVisual";

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-obsidian-gradient pt-34 pb-20 sm:pt-40 sm:pb-28">
      <div
        className="pointer-events-none absolute top-[-12rem] left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--violet) 40%, transparent)" }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">{t.hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl leading-[1.08] text-ivory sm:text-5xl md:text-6xl">
              {t.hero.titleLine1}
              <br />
              <span className="text-gradient-gold">{t.hero.titleLine2}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t.hero.description}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button variant="gold" size="xl" asChild>
                <Link to="/pricing">{t.hero.primaryCta}</Link>
              </Button>
              <Button variant="ghostLux" size="xl" asChild>
                <Link to="/features">{t.hero.secondaryCta}</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-8 text-xs leading-relaxed tracking-[0.08em] text-muted-foreground">
              {t.hero.disclaimer}
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <MarketVisual />
        </Reveal>
      </div>
    </section>
  );
}
