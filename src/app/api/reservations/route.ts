import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { reservationSchema } from "@/lib/validations";
import { saveReservation } from "@/lib/db/reservations";
import { getAvailability } from "@/lib/availability";
import {
  formatReservationWhatsAppMessage,
  sendWhatsAppNotification,
} from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = reservationSchema.parse(body);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(data.date);
    if (selected < today) {
      return NextResponse.json(
        { error: "Please select a future date" },
        { status: 400 }
      );
    }

    const slots = getAvailability(data.date);
    const slot = slots.find((s) => s.time === data.time);
    if (!slot) {
      return NextResponse.json(
        { error: "Please select a valid time slot" },
        { status: 400 }
      );
    }

    if (!slot.available) {
      return NextResponse.json(
        { error: "This time slot is no longer available" },
        { status: 409 }
      );
    }

    const reference = `SV-${Date.now().toString(36).toUpperCase()}`;
    const whatsappMessage = formatReservationWhatsAppMessage(data, reference);

    await saveReservation({
      reference,
      name: data.name,
      phone: data.phone,
      email: data.email,
      date: data.date,
      time: data.time,
      guests: data.guests,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    });

    const whatsappSent = await sendWhatsAppNotification(whatsappMessage);

    if (process.env.RESEND_API_KEY && process.env.RESERVATION_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sèves <info@seveslb.com>",
          to: process.env.RESERVATION_EMAIL,
          subject: `Reservation request — ${data.name}`,
          text: whatsappMessage.replace(/\*/g, ""),
        }),
      });

      if (data.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Sèves <info@seveslb.com>",
            to: data.email,
            subject: "Your reservation request — Sèves",
            text: `Dear ${data.name},\n\nThank you for your reservation request for ${data.guests} guests on ${data.date} at ${data.time}.\n\nReference: ${reference}\n\nOur maître d' will confirm shortly.\n\nSèves`,
          }),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your reservation request has been received.",
      reference,
      whatsappSent,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Please check your details." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please call us directly." },
      { status: 500 }
    );
  }
}
