import type { Metadata } from "next";
import Link from "next/link";
import { RESTAURANT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${RESTAURANT.name} restaurant website.`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink-900 px-6 py-24 text-cream">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-xs uppercase tracking-luxe text-gold hover:text-cream">
          ← Sèves
        </Link>
        <h1 className="mt-10 font-serif text-4xl text-cream">Privacy Policy</h1>
        <p className="mt-2 text-sm text-cream/50">Politique de confidentialité</p>

        <div className="mt-12 space-y-8 font-light text-sm leading-relaxed text-cream/70">
          <section>
            <h2 className="font-serif text-xl text-cream">Information we collect</h2>
            <p className="mt-3">
              When you reserve a table, enquire about a private experience, or subscribe to our
              journal, we collect the details you provide — name, email, phone, date preferences,
              and message content.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-cream">How we use it</h2>
            <p className="mt-3">
              We use your information solely to respond to reservations and enquiries, confirm
              availability, and send occasional updates if you subscribed to our newsletter.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-cream">Storage & security</h2>
            <p className="mt-3">
              Data is stored securely via Supabase and processed through our reservation systems.
              We do not sell your personal information to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-cream">Contact</h2>
            <p className="mt-3">
              For access, correction, or deletion requests, contact{" "}
              <a href={`mailto:${RESTAURANT.email}`} className="text-gold hover:text-cream">
                {RESTAURANT.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
