import { useI18n } from "@/i18n/I18nProvider";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { Monogram } from "@/components/brand/Monogram";

export function FinalCta() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden border-t border-border py-28 sm:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, color-mix(in oklab, var(--violet) 22%, transparent), transparent)",
        }}
      />
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Monogram className="mx-auto h-12 w-12 text-gold" />
        <h2 className="mt-8 text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
          {t.cta.titleStart} <span className="text-gradient-gold">{t.cta.titleAccent}</span>
        </h2>
        <div className="mt-10 flex justify-center">
          <Button variant="gold" size="xl" asChild>
            <Link to="/pricing">{t.cta.button}</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
