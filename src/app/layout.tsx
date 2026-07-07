import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Cinzel, Jost } from "next/font/google";
import { FAQ, RESTAURANT } from "@/lib/data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const SITE_URL = "https://seves.restaurant";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${RESTAURANT.name} — ${RESTAURANT.tagline}`,
    template: `%s · ${RESTAURANT.name}`,
  },
  description:
    "Sèves is an ultra-premium fine-dining destination in Dbayeh, Lebanon. A cinematic garden terrace, an artful seasonal kitchen, and a curated cellar — where every plate is a piece of art.",
  keywords: [
    "Sèves",
    "fine dining Dbayeh",
    "fine dining Beirut",
    "luxury restaurant Lebanon",
    "Michelin star dining",
    "garden terrace restaurant",
    "tasting menu Beirut",
  ],
  authors: [{ name: "Sèves" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: RESTAURANT.name,
    title: `${RESTAURANT.name} — ${RESTAURANT.tagline}`,
    description:
      "A cinematic fine-dining experience in Dbayeh, Lebanon. Where every plate is a piece of art.",
    images: [
      {
        url: "/images/interior-dining-banquette.png",
        width: 1200,
        height: 1600,
        alt: "Sèves dining room",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${RESTAURANT.name} — ${RESTAURANT.tagline}`,
    description: "A cinematic fine-dining experience in Beirut.",
    images: ["/images/interior-dining-banquette.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT.name,
    servesCuisine: "Contemporary fine dining",
    priceRange: "$$$$",
    telephone: RESTAURANT.phone,
    email: RESTAURANT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT.streetAddress,
      addressLocality: RESTAURANT.city,
      addressRegion: "Mount Lebanon",
      addressCountry: "LB",
    },
    url: SITE_URL,
    image: `${SITE_URL}/images/exterior-facade-sign.png`,
    acceptsReservations: true,
    hasMap: RESTAURANT.mapsUrl,
    geo: {
      "@type": "GeoCoordinates",
      latitude: RESTAURANT.coordinates.lat,
      longitude: RESTAURANT.coordinates.lng,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cinzel.variable} ${jost.variable}`}
    >
      <body className="bg-ink-900 text-cream antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
