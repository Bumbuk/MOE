import * as React from "react";

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border px-3 py-2 text-sm outline-none " +
        "bg-[var(--background)] text-[var(--foreground)] border-[#F9B44D] placeholder-[#AAA19C] focus:border-[#BFAADC] " +
        (props.className ?? "")
      }
    />
  );
}
