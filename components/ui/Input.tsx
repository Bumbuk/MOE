import * as React from "react";

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none " +
        "focus:border-neutral-600 " +
        (props.className ?? "")
      }
    />
  );
}
