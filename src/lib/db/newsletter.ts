import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function saveNewsletterSubscriber(email: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email" });

  return !error;
}
