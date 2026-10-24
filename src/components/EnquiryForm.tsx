"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

/**
 * There is no booking or form backend for this business yet, so the form builds
 * a pre-filled email to the shop and opens the visitor's email app.
 * Swap handleSubmit for a server action or form service when one exists.
 */
export function EnquiryForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const subject = `${v("type")} enquiry from ${v("name")}`;
    const details = [
      `Name: ${v("name")}`,
      `Email: ${v("email")}`,
      v("phone") ? `Phone: ${v("phone")}` : null,
      `Enquiry type: ${v("type")}`,
      v("date") ? `Date needed: ${v("date")}` : null,
    ].filter(Boolean);
    const body = `${details.join("\n")}\n\n${v("message")}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const field =
    "w-full rounded-none border-0 border-b border-cocoa/25 bg-transparent px-0 py-3 text-[16px] text-cocoa placeholder:text-cocoa/40 focus:border-raspberry focus:outline-none focus:ring-0";
  const label = "text-[12px] font-medium uppercase tracking-[0.18em] text-cocoa-soft";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
      <label className="flex flex-col gap-1">
        <span className={label}>Your name</span>
        <input name="name" required autoComplete="name" className={field} placeholder="Full name" />
      </label>
      <label className="flex flex-col gap-1">
        <span className={label}>Email</span>
        <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
      </label>
      <label className="flex flex-col gap-1">
        <span className={label}>Phone (optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className={field} placeholder="07…" />
      </label>
      <label className="flex flex-col gap-1">
        <span className={label}>Date needed (optional)</span>
        <input name="date" type="date" className={field} />
      </label>
      <fieldset className="sm:col-span-2">
        <legend className={`${label} mb-3`}>What is it for?</legend>
        <div className="flex flex-wrap gap-2">
          {["Celebration cake", "Corporate gifting", "Event", "Something else"].map((t, i) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-block rounded-full border border-cocoa/25 px-4 py-2 text-[14px] transition-colors peer-checked:border-raspberry peer-checked:bg-raspberry peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-raspberry hover:border-cocoa">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-1 sm:col-span-2">
        <span className={label}>Tell us about it</span>
        <textarea
          name="message"
          required
          rows={4}
          className={`${field} resize-none`}
          placeholder="Occasion, number of guests, flavours, colours, budget…"
        />
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cocoa px-7 py-4 text-[15px] font-medium text-cream transition-colors hover:bg-raspberry"
        >
          Send enquiry <Send className="size-4" aria-hidden />
        </button>
        <p className="text-[13px] text-cocoa-soft" role="status">
          {sent
            ? `Your email app should now be open. If not, email ${email}.`
            : "Opens your email app with everything filled in."}
        </p>
      </div>
    </form>
  );
}
