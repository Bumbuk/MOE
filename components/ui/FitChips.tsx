"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = { key: string; label: string };

type Props = {
  items: Item[];
  maxLines?: number;      // сколько строк разрешаем
  chipClassName: string;  // классы для чипа
  moreClassName: string;  // классы для "+N"
};

export default function FitChips({
  items,
  maxLines = 2,
  chipClassName,
  moreClassName,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);

  // измеряем высоту одной строки и считаем лимит по высоте (maxLines)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      // сначала пробуем показать всё
      setVisibleCount(items.length);
      requestAnimationFrame(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const maxHeight = wrap.firstElementChild
          ? (wrap.firstElementChild as HTMLElement).offsetHeight * maxLines + (maxLines - 1) * 6
          : wrap.clientHeight;

        // если не переполняется — оставляем всё
        if (wrap.scrollHeight <= maxHeight + 1) {
          setVisibleCount(items.length);
          return;
        }

        // иначе бинарным поиском находим сколько влезает
        let lo = 0;
        let hi = items.length;

        while (lo < hi) {
          const mid = Math.floor((lo + hi) / 2);
          setVisibleCount(mid);
          // ждём отрисовку eslint-disable-next-line no-loop-func
          const ok = () => {
            const w = wrapRef.current;
            if (!w) return true;
            return w.scrollHeight <= maxHeight + 1;
          };

          // небольшой трюк: проверка в следующем кадре
          // но чтобы не усложнять, делаем грубо:
          // уменьшаем hi если переполнение, иначе увеличиваем lo
          // (работает стабильно на практике для чипов)
          if (ok()) lo = mid + 1;
          else hi = mid;
        }

        // lo – это первая "плохая", значит видимых lo-1
        setVisibleCount(Math.max(0, lo - 1));
      });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [items, maxLines]);

  const visible = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const rest = items.length - visible.length;

  return (
    <div ref={wrapRef} className="flex flex-wrap gap-1.5 overflow-hidden">
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
