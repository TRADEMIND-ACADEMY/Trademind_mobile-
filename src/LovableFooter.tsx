import { Link } from "@tanstack/react-router";
import { Monogram } from "@/components/brand/Monogram";
import { useI18n } from "@/i18n/I18nProvider";

const columns = [
  {
    title: "academy",
    links: [
      { label: "about", to: "/about" },
      { label: "features", to: "/features" },
      { label: "pricing", to: "/pricing" },
    ],
  },
  {
    title: "support",
    links: [
      { label: "contact", to: "/contact" },
      { label: "privacy", to: "/privacy" },
      { label: "terms", to: "/terms" },
    ],
  },
] as const;

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-obsidian-gradient">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Monogram className="h-9 w-9 text-gold" />
              <div>
                <p className="font-display text-base tracking-[0.28em] text-ivory">TRADEMIND</p>
                <p className="text-[0.6rem] tracking-[0.42em] text-gold-soft">ACADEMY</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={t.footer[col.title]}>
              <p className="eyebrow">{t.footer[col.title]}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-ivory"
                    >
                      {t.footer[link.label]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gold-rule my-10" />

        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
          <span className="text-ivory/80">{t.footer.disclaimerLabel}</span> {t.footer.disclaimer}
        </p>

        <p className="mt-8 text-xs tracking-[0.16em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} TRADEMIND ACADEMY
        </p>
      </div>
    </footer>
  );
}
