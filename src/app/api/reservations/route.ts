import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { reservationSchema } from "@/lib/validations";
import { saveReservation } from "@/lib/reservations-store";
import { getAvailability } from "@/lib/availability";

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
    if (slot && !slot.available) {
      return NextResponse.json(
        { error: "This time slot is no longer available" },
        { status: 409 }
      );
    }

    const reference = `SV-${Date.now().toString(36).toUpperCase()}`;

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

    if (process.env.RESEND_API_KEY && process.env.RESERVATION_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sèves <reservations@seves.restaurant>",
          to: process.env.RESERVATION_EMAIL,
          subject: `Reservation request — ${data.name}`,
          text: [
            `Reference: ${reference}`,
            `Name: ${data.name}`,
            `Phone: ${data.phone}`,
            `Email: ${data.email || "—"}`,
            `Date: ${data.date}`,
            `Time: ${data.time}`,
            `Guests: ${data.guests}`,
            `Notes: ${data.notes || "—"}`,
          ].join("\n"),
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
            from: "Sèves <reservations@seves.restaurant>",
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
