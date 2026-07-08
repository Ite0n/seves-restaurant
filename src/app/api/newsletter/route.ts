import { NextResponse } from "next/server";
import { z } from "zod";
import { saveNewsletterSubscriber } from "@/lib/db/newsletter";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export async function POST(request: Request) {
  try {
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
