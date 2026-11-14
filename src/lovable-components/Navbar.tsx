import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Monogram, Wordmark } from "@/components/brand/Monogram";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const links = [
  { key: "home", to: "/" },
  { key: "about", to: "/about" },
  { key: "features", to: "/features" },
  { key: "pricing", to: "/pricing" },
  { key: "contact", to: "/contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-panel border-x-0 border-t-0" : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Monogram className="h-8 w-8 text-gold" />
          <Wordmark className="hidden sm:block" />
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[0.8rem] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-ivory"
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-ivory" }}
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSwitcher />
          <Button variant="ghostLux" size="sm" asChild>
            <Link to="/contact">{t.nav.login}</Link>
          </Button>
          <Button variant="gold" size="sm" asChild>
            <Link to="/pricing">{t.nav.getStarted}</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
        <LanguageSwitcher />
        <button
          type="button"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md hairline text-gold"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        </div>
      </nav>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-500 lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="glass-panel mx-4 mb-4 rounded-xl px-6 py-6">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-ivory"
                activeOptions={{ exact: link.to === "/" }}
                activeProps={{ className: "text-ivory" }}
              >
                {t.nav[link.key]}
              </Link>
            ))}
          </div>
          <div className="gold-rule my-6" />
          <div className="flex flex-col gap-3">
            <Button variant="ghostLux" asChild onClick={() => setOpen(false)}>
              <Link to="/contact">{t.nav.login}</Link>
            </Button>
            <Button variant="gold" asChild onClick={() => setOpen(false)}>
              <Link to="/pricing">{t.nav.getStarted}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
