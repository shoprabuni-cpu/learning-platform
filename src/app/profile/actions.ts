"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const gradeLevel = String(formData.get("grade_level") ?? "").trim();
  const studyTime = String(formData.get("study_time") ?? "").trim();

  if (fullName.length < 2 || fullName.length > 100) redirect("/profile?error=name");
  if (!["morning", "afternoon", "evening", "flexible"].includes(studyTime)) redirect("/profile?error=preference");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login?error=setup");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("profiles").update({
    full_name: fullName,
    grade_level: gradeLevel || null,
    learning_preferences: { preferred_study_time: studyTime },
    updated_at: new Date().toISOString(),
  }).eq("user_id", user.id);

  if (error) redirect("/profile?error=save");
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  redirect("/profile?saved=1");
}
