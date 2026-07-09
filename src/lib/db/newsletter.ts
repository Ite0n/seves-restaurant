import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function saveNewsletterSubscriber(email: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Database not configured");
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email" });

  if (error) throw error;
}
