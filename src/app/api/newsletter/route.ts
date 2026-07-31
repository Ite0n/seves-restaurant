import { NextResponse } from "next/server";
import { z } from "zod";
import { saveNewsletterSubscriber } from "@/lib/db/newsletter";
import { checkRateLimit } from "@/lib/rate-limit";

const NEWSLETTER_RATE_LIMIT = {
  namespace: "newsletter",
  limit: 5,
  windowMs: 15 * 60 * 1000,
} as const;

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, NEWSLETTER_RATE_LIMIT);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many newsletter attempts. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter) },
        }
      );
    }

    const body = await request.json();
    const { email } = schema.parse(body);
    const normalized = email.toLowerCase().trim();

    await saveNewsletterSubscriber(normalized);

    if (process.env.RESEND_API_KEY && process.env.NEWSLETTER_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sèves <newsletter@seves.restaurant>",
          to: process.env.NEWSLETTER_EMAIL,
          subject: "New newsletter subscriber",
          text: `Email: ${normalized}`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
}
