"use client";

/*
 * FitChips
 *
 * Этот компонент отображает массив «чипов» (маленьких плашек с текстом)
 * и автоматически сокращает их количество, если элементов слишком много.
 * Он показывает первые элементы до заданного лимита, а оставшееся количество
 * выводит в виде «+N». Лимит рассчитывается как количество линий (maxLines)
 * умноженное на 4: в каждой строке обычно помещается 4 чипа среднего размера.
 * Если вы хотите другой лимит, передайте другое значение maxLines.
 */

import { useMemo } from "react";

export type FitChipItem = { key: string; label: string };

type Props = {
  items: FitChipItem[];
  /**
   * Максимальное количество строк, которое может занимать список чипов.
   * По умолчанию 2. Если элементов больше чем вместится, то оставшиеся
   * заменяются на +N.
   */
  maxLines?: number;
  /**
   * CSS‑классы для отдельного чипа. Например: "rounded-full border px-2 py-1 text-xs".
   */
  chipClassName: string;
  /**
   * CSS‑классы для отображения остатка (+N). Например: "rounded-full border px-2 py-1 text-xs".
   */
  moreClassName: string;
};

export default function FitChips({ items, maxLines = 2, chipClassName, moreClassName }: Props) {
  // Максимальное число элементов, которые мы покажем без сокращения.
  // В одной строке помещается примерно четыре средних чипа,
  // умножаем на количество строк.
  const maxVisible = maxLines * 4;
  const visible = useMemo(() => items.slice(0, maxVisible), [items, maxVisible]);
  const rest = items.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1.5 overflow-hidden">
      {visible.map((it) => (
        <span key={it.key} className={chipClassName}>
          {it.label}
        </span>
      ))}
      {rest > 0 ? (
        <span className={moreClassName}>+{rest}</span>
      ) : null}
    </div>
  );
}