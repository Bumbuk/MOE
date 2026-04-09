import { Container } from "@/components/ui/container";

type DatabaseErrorStateProps = {
  title: string;
  description: string;
};

export function DatabaseErrorState({ title, description }: DatabaseErrorStateProps) {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <div className="rounded-[2rem] border border-amber-300 bg-amber-50 p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-700">База данных недоступна</p>
          <h1 className="mt-4 text-3xl font-semibold text-stone-950">{title}</h1>
          <p className="mt-4 text-base leading-7 text-stone-700">{description}</p>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Поднимите PostgreSQL и примените Prisma-команды: `npm run prisma:generate`,
            `npm run prisma:migrate`, `npm run prisma:seed`.
          </p>
        </div>
      </Container>
    </section>
  );
}
