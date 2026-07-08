import { getSupabaseAdmin } from "@/lib/supabase/server";

export type EnquiryInput = {
  source: "experience" | "event" | "gift";
  sourceId: string;
  sourceTitle: string;
  name: string;
  email: string;
  preferredDate?: string;
  message?: string;
};

export async function saveEnquiry(input: EnquiryInput): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Database not configured");
  }

  const { error } = await supabase.from("enquiries").insert({
    source: input.source,
    source_id: input.sourceId,
    source_title: input.sourceTitle,
    name: input.name,
    email: input.email,
    preferred_date: input.preferredDate || null,
    message: input.message || null,
  });

  if (error) throw error;
}

export function formatEnquiryWhatsAppMessage(input: EnquiryInput): string {
  return [
    `✨ *New ${input.source} enquiry — Sèves*`,
    "",
    `*${input.source === "event" ? "Event" : input.source === "gift" ? "Gift" : "Experience"}:* ${input.sourceTitle}`,
    `*Name:* ${input.name}`,
    `*Email:* ${input.email}`,
    `*Preferred date:* ${input.preferredDate || "—"}`,
    `*Message:* ${input.message || "—"}`,
  ].join("\n");
}
