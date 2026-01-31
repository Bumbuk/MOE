"use client";

type Props = {
  sizes: string[];
  value?: string | null;
  onChange: (size: string) => void;
  disabledSizes?: string[]; // если каких-то размеров нет в наличии
};

export default function SizeSelector({ sizes, value, onChange, disabledSizes }: Props) {
  const disabled = new Set(disabledSizes ?? []);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Размер</div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const isDisabled = disabled.has(s);
          const isActive = value === s;

          return (
            <button
              key={s}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(s)}
              className={
                "rounded-xl border px-3 py-2 text-sm transition " +
                (isActive
                  ? "border-white bg-white text-black"
                  : "border-neutral-800 bg-neutral-950 text-neutral-200 hover:border-neutral-700") +
                (isDisabled ? " cursor-not-allowed opacity-40 hover:border-neutral-800" : "")
              }
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
