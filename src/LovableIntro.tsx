import { useI18n } from "@/i18n/I18nProvider";
import { useEffect, useState } from "react";
import { Monogram } from "@/components/brand/Monogram";

const SEEN_KEY = "tm-intro-seen";

export function Intro() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SEEN_KEY) === "1";
    if (seen || reduced) {
      sessionStorage.setItem(SEEN_KEY, "1");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    setMounted(true);
    document.body.style.overflow = "hidden";
    const outTimer = setTimeout(() => setLeaving(true), 1500);
    const endTimer = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
    }, 2100);
    return () => {
      clearTimeout(outTimer);
      clearTimeout(endTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-obsidian-gradient transition-opacity duration-600"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      <Monogram className="h-16 w-16 animate-fade-up text-gold" />
      <div className="mt-6 text-center">
        <p
          className="animate-fade-up font-display text-2xl tracking-[0.35em] text-ivory sm:text-3xl"
          style={{ animationDelay: "240ms" }}
        >
          TRADEMIND
        </p>
        <p
          className="mt-2 animate-fade-up text-[0.65rem] tracking-[0.5em] text-gold-soft"
          style={{ animationDelay: "420ms" }}
        >
          ACADEMY
        </p>
      </div>
      <p
        className="mt-8 animate-fade-in text-xs tracking-[0.2em] text-muted-foreground"
        style={{ animationDelay: "760ms" }}
      >
        {t.intro.tagline}
      </p>
    </div>
  );
}
