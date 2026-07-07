"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import MobileReserveBar from "@/components/ui/MobileReserveBar";
import SoundToggle from "@/components/ui/SoundToggle";
import TimeOfDayTheme from "@/components/TimeOfDayTheme";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Walkthrough from "@/components/Walkthrough";
import Dishes from "@/components/Dishes";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import { useImageWarmup } from "@/hooks/useImageWarmup";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

const TastingJourney = dynamic(() => import("@/components/TastingJourney"));
const Cellar = dynamic(() => import("@/components/Cellar"));
const Chef = dynamic(() => import("@/components/Chef"));
const Story = dynamic(() => import("@/components/Story"));
const Experiences = dynamic(() => import("@/components/Experiences"));
const Events = dynamic(() => import("@/components/Events"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const GiftExperiences = dynamic(() => import("@/components/GiftExperiences"));
const Reservation = dynamic(() => import("@/components/Reservation"));
const Faq = dynamic(() => import("@/components/Faq"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function HomeContent() {
  useImageWarmup();

  return (
    <>
      <TimeOfDayTheme />
      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <SoundToggle />
      <MobileReserveBar />
      <SmoothScroll>
        <main className="relative pb-20 lg:pb-0">
          <Hero />
          <Marquee />
          <Walkthrough />
          <Dishes />
          <Menu />
          <TastingJourney />
          <Cellar />
          <Chef />
          <Story />
          <Experiences />
          <Events />
          <Gallery />
          <Testimonials />
          <GiftExperiences />
          <Reservation />
          <Faq />
          <Contact />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
