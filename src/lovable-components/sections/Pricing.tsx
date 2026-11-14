import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useI18n } from "@/i18n/I18nProvider";
import { formatPrice, planCopy, plans } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function Pricing() {
  const { locale } = useI18n();
  const c = planCopy[locale];
  return (
    <section id="pricing" className="border-t border-border bg-obsidian-gradient py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, i) => {
            const p = c.plans[plan.id];
            const elite = plan.id === "ELITE";
            return (
              <Reveal
                key={plan.id}
                delay={i * 80}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-2xl p-8",
                  elite ? "hairline bg-card shadow-lux" : "glass-panel",
                )}
              >
                {elite && (
                  <div
                    className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
                    style={{ background: "color-mix(in oklab, var(--gold) 35%, transparent)" }}
                  />
                )}
                <div className="relative flex items-center justify-between gap-2">
                  <p className="eyebrow">{plan.name}</p>
                  {plan.highlight && (
                    <span className="rounded-full hairline px-3 py-1 text-[0.58rem] tracking-[0.2em] text-gold uppercase">
                      {c.recommended}
                    </span>
                  )}
                </div>
                <p className={cn("relative mt-6 font-display text-4xl", elite ? "text-gradient-gold" : "text-ivory")}>
                  {formatPrice(plan.priceUsd, locale)}
                  {plan.priceUsd > 0 && (
                    <span className="ml-2 font-sans text-xs tracking-[0.14em] text-muted-foreground uppercase">{c.perMonth}</span>
                  )}
                </p>
                <p className="relative mt-2 text-sm text-muted-foreground">{p.note}</p>
                <p className="relative mt-4 text-xs tracking-[0.12em] text-gold-soft uppercase">
                  {plan.monthlyTrades ? c.trades(plan.monthlyTrades) : c.eliteLimit}
                </p>
                <div className="gold-rule my-6" />
                <ul className="relative flex-1 space-y-3">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant={elite ? "gold" : "ghostLux"} size="lg" className="relative mt-8 w-full" disabled>
                  {c.cta}
                </Button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
