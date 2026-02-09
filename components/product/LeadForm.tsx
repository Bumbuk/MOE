"use client";

import { useMemo, useState } from "react";

export default function LeadForm(props: {
  productSlug: string;
  sizes: string[];
}) {
  const [size, setSize] = useState<string>(props.sizes[0] ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const canSend = useMemo(() => {
    return name.trim().length >= 2 && phone.trim().length >= 7 && status !== "sending";
  }, [name, phone, status]);

  async function submit() {
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productSlug: props.productSlug,
          size: size || undefined,
          name,
          phone,
          message: message || undefined,
          website, // honeypot
        }),
      });

      if (!res.ok) throw new Error("Bad response");
      setStatus("ok");
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-4 space-y-4">
      <div className="text-lg font-semibold text-[var(--foreground)]">Оставить заявку</div>

      {/* honeypot поле (скрыто) */}
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {props.sizes.length ? (
        <div className="space-y-2">
          <div className="text-sm text-[#4B7488]">Размер</div>
          <div className="flex flex-wrap gap-2">
            {props.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={
                  "px-3 py-2 rounded-full border text-sm transition " +
                  (size === s
                    ? "border-[#F9B44D] bg-[#F9B44D]/20 text-[#FF6634]"
                    : "border-[#F9B44D] bg-[var(--background)] text-[#4B7488] hover:border-[#EC99A6]")
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-[#4B7488]">Имя</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[#BFAADC] placeholder-[#AAA19C]"
            placeholder="Как к вам обращаться"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-[#4B7488]">Телефон</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[#BFAADC] placeholder-[#AAA19C]"
            placeholder="+7 (999) 123-45-67"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-[#4B7488]">Комментарий</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[90px] rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[#BFAADC] placeholder-[#AAA19C]"
            placeholder="Например: нужна доставка / цвет / уточqweнения"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!canSend}
        className={
          "w-full rounded-xl px-4 py-3 font-semibold transition " +
          (canSend ? "bg-[#F9B44D] text-[#2D2C2A] hover:bg-[#FFBC6E]" : "bg-[#EADDCB] text-[#AAA19C] cursor-not-allowed")
        }
      >
        {status === "sending" ? "Отправляю..." : "Отправить"}
      </button>

      {status === "ok" ? (
        <div className="text-sm text-emerald-500">Заявка отправлена ✅</div>
      ) : null}
      {status === "err" ? (
        <div className="text-sm text-red-500">
          Ошибка отправки. Попробуй ещё раз.
        </div>
      ) : null}
    </div>
  );
}
