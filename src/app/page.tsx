import { LocaleProvider } from "@/context/LocaleContext";
import HomeContent from "@/components/HomeContent";
import VercelAnalytics from "@/components/VercelAnalytics";

export default function Home() {
  return (
    <LocaleProvider>
      <HomeContent />
      <VercelAnalytics />
    </LocaleProvider>
  );
}
