import { Reveal } from "@/components/Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-obsidian-gradient pt-34 pb-16 sm:pt-40 sm:pb-20">
      <div
        className="pointer-events-none absolute top-[-14rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--violet) 40%, transparent)" }}
      />
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 text-4xl leading-[1.1] text-ivory sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </Reveal>
    </section>
  );
}
