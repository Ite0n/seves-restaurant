import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Walkthrough from "@/components/Walkthrough";
import Dishes from "@/components/Dishes";
import Menu from "@/components/Menu";
import Chef from "@/components/Chef";
import Story from "@/components/Story";
import Experiences from "@/components/Experiences";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Reservation from "@/components/Reservation";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <SmoothScroll>
        <main className="relative">
          <Hero />
          <Marquee />
          <Walkthrough />
          <Dishes />
          <Menu />
          <Chef />
          <Story />
          <Experiences />
          <Gallery />
          <Testimonials />
          <Reservation />
          <Faq />
          <Contact />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
