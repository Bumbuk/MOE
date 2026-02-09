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
      <div className="text-sm font-medium text-[#4B7488]">Размер</div>

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
                  ? "border-[#F9B44D] bg-[#F9B44D]/20 text-[#FF6634]"
                  : "border-[#F9B44D] bg-[var(--background)] text-[#4B7488] hover:border-[#EC99A6]") +
                (isDisabled ? " cursor-not-allowed opacity-40" : "")
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
