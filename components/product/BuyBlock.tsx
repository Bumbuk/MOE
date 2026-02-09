"use client";

import { useState } from "react";
import SizeSelector from "./SizeSelector";
import Button from "../ui/Button";

export default function BuyBlock({ sizes }: { sizes: string[] }) {
  const [size, setSize] = useState<string | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-4">
      <SizeSelector sizes={sizes} value={size} onChange={setSize} />

      <Button
        variant="primary"
        disabled={!size}
        onClick={() => {
          // Пока без реальной логики корзины — позже подключим стор/контекст
          alert(size ? `Добавлено в корзину. Размер: ${size}` : "Выберите размер");
        }}
        className={
          "w-full " +
          (size
            ? "bg-[#FF6634] text-white border-[#FF6634] hover:bg-[#EC99A6]"
            : "bg-[#EADDCB] text-[#AAA19C] border-[#EADDCB] cursor-not-allowed")
        }
      >
        {size ? "Добавить в корзину" : "Выберите размер"}
      </Button>

      <div className="text-xs text-[#4B7488]">
        Подсказка: позже сюда подключим реальную корзину и наличие по размерам.
      </div>
    </div>
  );
}
