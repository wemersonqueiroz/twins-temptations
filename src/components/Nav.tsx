"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { TwinMark } from "./icons";
import { CartButton } from "./cart/CartButton";

const links = [
  { href: "/#story", label: "Our story" },
  { href: "/#bakes", label: "The bakes" },
  { href: "/shop", label: "Shop" },
  { href: "/#celebrations", label: "Celebrations" },
  { href: "/#visit", label: "Visit" },
];

type NavProps = { phone: string; phoneHref: string };

export function Nav({ phone, phoneHref }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => href === "/shop" && pathname.startsWith("/shop");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 ${
        scrolled && !open ? "bg-cream/85 py-3 shadow-[0_1px_0_rgba(53,25,26,0.08)] backdrop-blur-md" : "py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-10" aria-label="Main">
        <Link href="/" className="relative z-50 flex items-center gap-2.5 text-cocoa" aria-label="Twins Temptations, home">
          <TwinMark className="h-5 w-8 text-raspberry" />
          <span className="font-display text-[19px] font-medium italic tracking-tight md:text-[21px]">Twins Temptations</span>
        </Link>

        <ul className="hidden items-center gap-8 text-[14px] font-medium lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`group relative py-1 transition-colors hover:text-cocoa ${isActive(l.href) ? "text-cocoa" : "text-cocoa/80"}`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-raspberry transition-transform duration-300 group-hover:scale-x-100 ${
                    isActive(l.href) ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="relative z-50 flex items-center gap-1 sm:gap-2">
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-[14px] font-medium text-cream transition-colors hover:bg-raspberry sm:inline-flex"
          >
            Order online <ArrowRight className="size-4" aria-hidden />
          </Link>
          <CartButton />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-cocoa lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-blush px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="font-display block py-2 text-[40px] leading-tight text-cocoa">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto space-y-3 text-[15px]">
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-cocoa px-6 py-4 font-medium text-cream"
              >
                Order online <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a href={phoneHref} className="block text-center text-cocoa-soft">
                Call {phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
