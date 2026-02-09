import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const v = props.variant ?? "primary";

  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition border disabled:opacity-50 disabled:cursor-not-allowed";

  const styles: Record<Variant, string> = {
    // Primary buttons use the brand orange/yellow with dark text on hover to emphasise action.
    primary: "bg-[#F9B44D] text-[#2D2C2A] border-[#F9B44D] hover:bg-[#FFBC6E]",
    // Secondary buttons are subtle: light background with brand-coloured text and border.
    secondary: "bg-[var(--background)] text-[#4B7488] border-[#F9B44D] hover:bg-[#FDE9D4]",
    // Ghost buttons are transparent with coloured text; on hover they get a faint background.
    ghost: "bg-transparent text-[#4B7488] border-transparent hover:bg-[#F9B44D]/20",
  };

  return <button {...props} className={`${base} ${styles[v]} ${props.className ?? ""}`} />;
}
