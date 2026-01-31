"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    </form>
  );
}
