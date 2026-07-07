import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CustomCursor from "@/components/ui/CustomCursor";
import MobileReserveBar from "@/components/ui/MobileReserveBar";
import SoundToggle from "@/components/ui/SoundToggle";
import TimeOfDayTheme from "@/components/TimeOfDayTheme";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Walkthrough from "@/components/Walkthrough";
import Dishes from "@/components/Dishes";
import Menu from "@/components/Menu";
import TastingJourney from "@/components/TastingJourney";
import Cellar from "@/components/Cellar";
import Chef from "@/components/Chef";
import Story from "@/components/Story";
import Experiences from "@/components/Experiences";
import Events from "@/components/Events";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import GiftExperiences from "@/components/GiftExperiences";
import Reservation from "@/components/Reservation";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/context/LocaleContext";

export default function Home() {
  return (
    <LocaleProvider>
      <TimeOfDayTheme />
      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <SoundToggle />
      <MobileReserveBar />
      <SmoothScroll>
        <main className="relative">
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
    </LocaleProvider>
  );
}
