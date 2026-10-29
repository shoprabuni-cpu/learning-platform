"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitDailyQuizAction(formData: FormData) {
  const challengeId = String(formData.get("challenge_id") ?? "").trim();
  const optionKey = String(formData.get("option_key") ?? "").trim();
  if (!challengeId || !optionKey) redirect("/dashboard?quiz=missing");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    redirect("/login?error=setup");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase.rpc("submit_daily_quiz_answer", {
    p_challenge_id: challengeId,
    p_selected_option_key: optionKey,
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("already completed")) redirect("/dashboard?quiz=already");
    if (message.includes("active student")) redirect("/account-pending");
    redirect("/dashboard?quiz=failed");
  }

  const result = data as { correct?: boolean } | null;
  revalidatePath("/dashboard");
  redirect("/dashboard?quiz=" + (result?.correct ? "correct" : "incorrect"));
}
