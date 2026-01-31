import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const v = props.variant ?? "primary";

  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition border disabled:opacity-50 disabled:cursor-not-allowed";

  const styles: Record<Variant, string> = {
    primary: "bg-white text-black border-white hover:opacity-90",
    secondary: "bg-neutral-900 text-white border-neutral-800 hover:border-neutral-700",
    ghost: "bg-transparent text-white border-transparent hover:bg-neutral-900",
  };

  return <button {...props} className={`${base} ${styles[v]} ${props.className ?? ""}`} />;
}
