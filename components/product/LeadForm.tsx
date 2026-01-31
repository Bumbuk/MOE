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
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 space-y-4">
      <div className="text-lg font-semibold">Оставить заявку</div>

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
          <div className="text-sm text-neutral-400">Размер</div>
          <div className="flex flex-wrap gap-2">
            {props.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={
                  "px-3 py-2 rounded-full border text-sm " +
                  (size === s
                    ? "border-neutral-300 bg-neutral-100 text-neutral-900"
                    : "border-neutral-800 bg-neutral-950 text-neutral-200 hover:border-neutral-700")
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
          <span className="text-sm text-neutral-400">Имя</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 outline-none focus:border-neutral-600"
            placeholder="Как к вам обращаться"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-neutral-400">Телефон</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 outline-none focus:border-neutral-600"
            placeholder="+7 (999) 123-45-67"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-neutral-400">Комментарий</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[90px] rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 outline-none focus:border-neutral-600"
            placeholder="Например: нужна доставка / цвет / уточнения"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!canSend}
        className="w-full rounded-xl bg-neutral-100 px-4 py-3 font-semibold text-neutral-900 disabled:opacity-50"
      >
        {status === "sending" ? "Отправляю..." : "Отправить"}
      </button>

      {status === "ok" ? (
        <div className="text-sm text-emerald-400">Заявка отправлена ✅</div>
      ) : null}
      {status === "err" ? (
        <div className="text-sm text-red-400">
          Ошибка отправки. Попробуй ещё раз.
        </div>
      ) : null}
    </div>
  );
}
