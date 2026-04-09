import { Container } from "@/components/ui/container";

export function AboutContent() {
  return (
    <section className="py-16">
      <Container className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.24em] text-stone-500">О нас</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-950">Про настроение MOE</h1>
        <div className="mt-8 space-y-5 text-base leading-8 text-stone-700">
          <p>
            MOE — это спокойный взгляд на повседневный гардероб: чистые силуэты,
            мягкие фактуры и вещи, которые легко носить каждый день.
          </p>
          <p>
            Нам близок лаконичный подход к одежде, где важны посадка, материал и ощущение
            лёгкости в образе, а не перегруженные детали.
          </p>
          <p>
            В коллекции собраны модели, которые можно сочетать между собой и постепенно
            собирать из них цельный, удобный и выразительный гардероб.
          </p>
        </div>
      </Container>
    </section>
  );
}
