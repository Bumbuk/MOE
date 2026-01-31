"use client";

import { useState } from "react";
import SizeSelector from "./SizeSelector";
import Button from "../ui/Button";

export default function BuyBlock({ sizes }: { sizes: string[] }) {
  const [size, setSize] = useState<string | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
      <SizeSelector sizes={sizes} value={size} onChange={setSize} />

      <Button
        variant="primary"
        disabled={!size}
        onClick={() => {
          alert(size ? `Добавлено в корзину. Размер: ${size}` : "Выбери размер");
        }}
        className="w-full"
      >
        {size ? "Добавить в корзину" : "Выберите размер"}
      </Button>

      <div className="text-xs text-neutral-500">
        Подсказка: позже сюда подключим реальную корзину и наличие по размерам.
      </div>
    </div>
  );
}
