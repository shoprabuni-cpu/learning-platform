"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function completeLessonAction(formData: FormData) {
  const lessonId = String(formData.get("lesson_id") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(lessonId)) redirect("/dashboard?lesson=invalid");
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login?error=setup");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: lesson } = await supabase.from("lessons").select("id").eq("id", lessonId).eq("is_published", true).maybeSingle();
  if (!lesson) redirect("/dashboard?lesson=unavailable");

  const { error } = await supabase.from("learning_activity").insert({
    user_id: user.id,
    activity_type: "lesson_completed",
    reference_id: lessonId,
  });
  if (error) redirect("/lessons/" + lessonId + "?error=complete");

  revalidatePath("/dashboard");
  redirect("/lessons/" + lessonId + "?completed=1");
}
