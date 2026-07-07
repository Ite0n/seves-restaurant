import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { reservationSchema } from "@/lib/validations";

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

    // Ready for Resend / Supabase integration via env vars
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
    }

    return NextResponse.json({
      success: true,
      message: "Your reservation request has been received.",
      reference: `SV-${Date.now().toString(36).toUpperCase()}`,
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
