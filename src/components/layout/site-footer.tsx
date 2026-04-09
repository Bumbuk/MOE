import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white/70 py-8">
      <Container className="flex flex-col gap-2 text-sm text-stone-600 md:flex-row md:items-center md:justify-between">
        <p>MOE Store. Спокойная коллекция одежды на каждый день.</p>
        <p>Чистые силуэты, мягкие фактуры и продуманные детали.</p>
      </Container>
    </footer>
  );
}
