"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function slugify(input: string) {
  return input.normalize("NFKD").toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function setRoleStatusAction(formData: FormData) {
  const userId = value(formData, "user_id");
  const role = value(formData, "role");
  const status = value(formData, "status");
  if (!userId || !["teacher", "parent", "student"].includes(role) || !["pending", "active", "suspended"].includes(status)) {
    redirect("/admin/users?error=input");
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("user_roles").update({ status }).eq("user_id", userId).eq("role", role);
  if (error) redirect("/admin/users?error=save");
  revalidatePath("/admin/users");
  redirect("/admin/users?updated=1");
}

export async function createSubjectAction(formData: FormData) {
  const name = value(formData, "name");
  const description = value(formData, "description");
  if (!name) redirect("/admin/content?error=subject");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("subjects").insert({ name, slug: slugify(name), description });
  if (error) redirect("/admin/content?error=save");
  revalidatePath("/admin/content");
  redirect("/admin/content?created=subject");
}

export async function createTopicAction(formData: FormData) {
  const name = value(formData, "name");
  const subjectId = value(formData, "subject_id");
  const description = value(formData, "description");
  if (!name || !subjectId) redirect("/admin/content?error=topic");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("topics").insert({ name, slug: slugify(name), description, subject_id: subjectId });
  if (error) redirect("/admin/content?error=save");
  revalidatePath("/admin/content");
  redirect("/admin/content?created=topic");
}

export async function createLessonAction(formData: FormData) {
  const title = value(formData, "title");
  const topicId = value(formData, "topic_id");
  const summary = value(formData, "summary");
  const bodyMarkdown = value(formData, "body_markdown");
  const minutes = Number(value(formData, "estimated_minutes") || "10");
  if (!title || !topicId || !Number.isInteger(minutes) || minutes < 1 || minutes > 240) {
    redirect("/admin/content?error=lesson");
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("lessons").insert({
    title,
    slug: slugify(title),
    topic_id: topicId,
    summary,
    body_markdown: bodyMarkdown,
    estimated_minutes: minutes,
    created_by: user.id,
  });
  if (error) redirect("/admin/content?error=save");
  revalidatePath("/admin/content");
  redirect("/admin/content?created=lesson");
}

export async function setContentPublishedAction(formData: FormData) {
  const kind = value(formData, "kind");
  const id = value(formData, "id");
  const published = value(formData, "published") === "true";
  const table = kind === "subject" ? "subjects" : kind === "topic" ? "topics" : kind === "lesson" ? "lessons" : null;
  if (!table || !id) redirect("/admin/content?error=input");

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(table).update({ is_published: published }).eq("id", id);
  if (error) redirect("/admin/content?error=save");
  revalidatePath("/admin/content");
  redirect("/admin/content?updated=1");
}
