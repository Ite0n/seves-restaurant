"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { getMenu, getMenuClassicsNote } from "@/lib/menu";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import MagneticButton from "./ui/MagneticButton";
import SectionAtmosphere from "./ui/SectionAtmosphere";
import { useLocale } from "@/context/LocaleContext";
import { EASE_LUXE } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";

export default function Menu() {
  const { locale, t, data } = useLocale();
  const menu = getMenu(locale);
  const [activeCat, setActiveCat] = useState(menu[0].id);
  const cat = menu.find((c) => c.id === activeCat)!;
  const [activeItem, setActiveItem] = useState(cat.items[0].id);

  const selected =
    cat.items.find((i) => i.id === activeItem) ?? cat.items[0];

  const handleCategoryChange = (id: string) => {
    setActiveCat(id);
    const next = menu.find((c) => c.id === id)!;
    setActiveItem(next.items[0].id);
    trackEvent("menu_category_switch", { category: id });
  };

  const tasting = data.tastingMenu;

  return (
    <section id="menu" className="relative overflow-hidden bg-ink-800 section-pad">
      <SectionAtmosphere />
      <div className="relative mx-auto max-w-content px-6">
        <SectionHeading
          label={t("menu.label")}
          title={
            <>
              {t("menu.titlePrefix")}{" "}
              <span className="gold-gradient">Sèves</span>
              {t("menu.titleSuffix") ? ` ${t("menu.titleSuffix")}` : ""}
            </>
          }
          description={t("menu.description")}
        />

        <Reveal delay={0.1}>
          <div className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-sm border border-gold/20 bg-ink-900/60">
            <div className="grid md:grid-cols-[1fr_auto]">
              <div className="p-8 md:p-10">
                <span className="text-[0.6rem] uppercase tracking-luxe text-gold/80">
                  {t("menu.tasting")}
                </span>
                <h3 className="mt-2 font-serif text-3xl text-cream md:text-4xl">
                  {tasting.title}
                </h3>
                <p className="mt-4 font-light leading-relaxed text-cream/60">
                  {tasting.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-6 text-xs uppercase tracking-wide2 text-cream/45">
                  <span>14 {t("menu.courses")}</span>
                  <span>{tasting.duration}</span>
                  <span>{tasting.winePairing}</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-t border-gold/10 bg-gold/5 p-8 md:border-l md:border-t-0">
                <span className="font-serif text-5xl text-gold">$185</span>
                <span className="mt-2 text-[0.6rem] uppercase tracking-luxe text-cream/40">
                  {t("menu.perPerson")}
                </span>
                <div className="mt-6">
                  <MagneticButton
                    href="#reservation"
                    className="border border-gold/40 bg-transparent px-6 py-3 text-xs text-gold"
                    strength={0.2}
                  >
                    {t("menu.reserve")}
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {menu.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.id)}
              className={`relative rounded-full px-5 py-2.5 text-[0.7rem] uppercase tracking-wide2 transition-colors duration-500 ${
                activeCat === c.id ? "text-ink-900" : "text-cream/60 hover:text-cream"
              }`}
            >
              {activeCat === c.id && (
                <motion.span
                  layoutId="menu-pill"
                  className="absolute inset-0 rounded-full bg-gold"
                  transition={{ duration: 0.5, ease: EASE_LUXE }}
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_LUXE }}
            >
              <p className="mb-8 font-serif text-xl italic text-gold/80">{cat.note}</p>
              <ul className="flex flex-col">
                {cat.items.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.35, ease: EASE_LUXE }}
                    onMouseEnter={() => setActiveItem(item.id)}
                    onFocus={() => setActiveItem(item.id)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveItem(item.id)}
                      className={`group flex w-full items-start gap-4 border-b py-5 text-left transition-colors ${
                        activeItem === item.id
                          ? "border-gold/40"
                          : "border-cream/10 hover:border-gold/20"
                      }`}
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm md:hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          loading="lazy"
                          quality={72}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-serif text-xl transition-colors md:text-2xl ${
                            activeItem === item.id ? "text-gold" : "text-cream group-hover:text-gold"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm font-light leading-relaxed text-cream/50">
                          {item.desc}
                        </p>
                      </div>
                      <span className="mx-1 hidden flex-1 self-end border-b border-dotted border-cream/15 lg:block" />
                      <span className="shrink-0 font-serif text-xl text-gold">${item.price}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              {cat.id === "classics" && (
                <p className="mt-6 text-xs font-light leading-relaxed text-cream/40">
                  {getMenuClassicsNote(locale)}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="relative hidden lg:block">
            <div className="sticky top-28 aspect-[3/4] overflow-hidden rounded-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_LUXE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    sizes="40vw"
                    loading="lazy"
                    className="object-cover"
                    quality={78}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent" />
                  <div className="img-frame absolute inset-0" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <span className="text-[0.6rem] uppercase tracking-luxe text-gold/80">
                  {cat.label}
                </span>
                <p className="mt-1 font-serif text-2xl text-cream">{selected.name}</p>
                <p className="mt-1 font-serif text-lg text-gold">${selected.price}</p>
              </div>
            </div>
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-16 text-center text-xs uppercase tracking-luxe text-cream/40">
            {t("menu.serviceNote")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
