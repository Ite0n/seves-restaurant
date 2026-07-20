import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enquirySchema } from "@/lib/validations";
import {
  formatEnquiryWhatsAppMessage,
  saveEnquiry,
} from "@/lib/db/enquiries";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Enquiries are temporarily unavailable. Please email us directly." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const data = enquirySchema.parse(body);

    await saveEnquiry({
      source: data.source,
      sourceId: data.sourceId,
      sourceTitle: data.sourceTitle,
      name: data.name,
      email: data.email,
      preferredDate: data.preferredDate,
      message: data.message,
    });

    const whatsappMessage = formatEnquiryWhatsAppMessage({
      source: data.source,
      sourceId: data.sourceId,
      sourceTitle: data.sourceTitle,
      name: data.name,
      email: data.email,
      preferredDate: data.preferredDate,
      message: data.message,
    });

    const whatsappSent = await sendWhatsAppNotification(whatsappMessage);
    let emailSent = false;

    if (process.env.RESEND_API_KEY && process.env.RESERVATION_EMAIL) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Sèves <info@seveslb.com>",
            to: process.env.RESERVATION_EMAIL,
            subject: `Enquiry — ${data.sourceTitle}`,
            text: whatsappMessage.replace(/\*/g, ""),
          }),
        });
        emailSent = emailResponse.ok;
      } catch {
        emailSent = false;
      }
    }

    return NextResponse.json({ success: true, whatsappSent, emailSent });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Please check your details." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please email us directly." },
      { status: 500 }
    );
  }
}
