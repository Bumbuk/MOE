"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qFromUrl = searchParams.get("q") ?? "";
  const inputRef = useRef<HTMLInputElement | null>(null);

  function submit() {
    const q = (inputRef.current?.value ?? "").trim();
    const sp = new URLSearchParams(searchParams.toString());

    if (q) sp.set("q", q);
    else sp.delete("q");

    sp.set("page", "1");
    router.push(`/?${sp.toString()}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="hidden sm:block"
    >
      <input
        key={qFromUrl} // если URL поменялся (back/forward), поле сбросится в значение из URL
        ref={inputRef}
        defaultValue={qFromUrl}
        placeholder="Поиск…"
        className="w-72 rounded-xl border px-3 py-2 text-sm outline-none bg-[var(--background)] text-[var(--foreground)] placeholder-[#AAA19C] border-[#F9B44D] focus:border-[#BFAADC]"
      />
    </form>
  );
}
