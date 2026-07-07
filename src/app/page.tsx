import { LocaleProvider } from "@/context/LocaleContext";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <LocaleProvider>
      <HomeContent />
    </LocaleProvider>
  );
}
