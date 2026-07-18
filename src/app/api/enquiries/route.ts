import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enquirySchema } from "@/lib/validations";
import { EVENTS, EXPERIENCES, GIFT_EXPERIENCES } from "@/lib/data";
import {
  formatEnquiryWhatsAppMessage,
  saveEnquiry,
} from "@/lib/db/enquiries";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type EnquirySource = "experience" | "event" | "gift";

function resolveSourceTitle(source: EnquirySource, sourceId: string) {
  switch (source) {
    case "experience":
      return EXPERIENCES.find((item) => item.id === sourceId)?.title;
    case "event":
      return EVENTS.find((item) => item.id === sourceId)?.title;
    case "gift":
      return GIFT_EXPERIENCES.find((item) => item.id === sourceId)?.title;
  }
}

async function sendEnquiryEmailNotification(
  subjectTitle: string,
  message: string
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !process.env.RESERVATION_EMAIL) {
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Sèves <info@seveslb.com>",
        to: process.env.RESERVATION_EMAIL,
        subject: `Enquiry — ${subjectTitle}`,
        text: message.replace(/\*/g, ""),
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

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
    const sourceTitle = resolveSourceTitle(data.source, data.sourceId);

    if (!sourceTitle) {
      return NextResponse.json(
        { error: "Please choose a valid experience, event, or gift." },
        { status: 400 }
      );
    }

    await saveEnquiry({
      source: data.source,
      sourceId: data.sourceId,
      sourceTitle,
      name: data.name,
      email: data.email,
      preferredDate: data.preferredDate,
      message: data.message,
    });

    const whatsappMessage = formatEnquiryWhatsAppMessage({
      source: data.source,
      sourceId: data.sourceId,
      sourceTitle,
      name: data.name,
      email: data.email,
      preferredDate: data.preferredDate,
      message: data.message,
    });

    const whatsappSent = await sendWhatsAppNotification(whatsappMessage);
    const emailSent = await sendEnquiryEmailNotification(
      sourceTitle,
      whatsappMessage
    );

    if (!whatsappSent && !emailSent) {
      return NextResponse.json(
        {
          error:
            "Your enquiry was saved, but we could not notify the team. Please email us directly.",
        },
        { status: 502 }
      );
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
