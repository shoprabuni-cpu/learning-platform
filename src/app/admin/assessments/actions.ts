"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

const OPTION_KEYS = ["a", "b", "c", "d"] as const;
type Supabase = Awaited<ReturnType<typeof createClient>>;

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function booleanValue(input: string) {
  if (input === "true") return true;
  if (input === "false") return false;
  return null;
}

function slugify(input: string) {
  return input.normalize("NFKD").toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validDateOnly(input: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return false;
  const date = new Date(`${input}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === input;
}

function ghanaDateTimeToIso(input: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input)) return null;
  const date = new Date(`${input}:00+00:00`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 16) !== input) return null;
  return date.toISOString();
}

async function questionCanBePublishedAsChallenge(supabase: Supabase, questionId: string) {
  const [{ data: question, error: questionError }, { data: answerKey, error: answerError }] = await Promise.all([
    supabase.from("practice_questions").select("topic_id,is_published").eq("id", questionId).maybeSingle(),
    supabase.from("practice_answer_keys").select("question_id").eq("question_id", questionId).maybeSingle(),
  ]);
  if (questionError || answerError || !question?.is_published || !answerKey) return false;

  const { data: topic, error: topicError } = await supabase
    .from("topics").select("subject_id,is_published").eq("id", question.topic_id).maybeSingle();
  if (topicError || !topic?.is_published) return false;

  const { data: subject, error: subjectError } = await supabase
    .from("subjects").select("is_published").eq("id", topic.subject_id).maybeSingle();
  return !subjectError && subject?.is_published === true;
}

export async function createPracticeQuestionAction(formData: FormData) {
  const prompt = value(formData, "prompt");
  const topicId = value(formData, "topic_id");
  const explanation = value(formData, "explanation");
  const difficulty = value(formData, "difficulty");
  const correctOption = value(formData, "correct_option_key");
  const options = OPTION_KEYS.map((key) => ({ key, text: value(formData, `option_${key}`) }));
  const slug = slugify(prompt).slice(0, 80);

  if (
    !prompt || prompt.length > 1000 || !slug || !topicId ||
    options.some((option) => !option.text || option.text.length > 250) ||
    explanation.length > 2000 || !OPTION_KEYS.includes(correctOption as typeof OPTION_KEYS[number]) ||
    !["introductory", "core", "advanced"].includes(difficulty)
  ) {
    redirect("/admin/assessments?error=question");
  }

  const { supabase, user } = await requireAdmin();
  const { data: question, error: questionError } = await supabase
    .from("practice_questions")
    .insert({
      slug,
      topic_id: topicId,
      prompt,
      options: options as Json,
      explanation,
      difficulty,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (questionError || !question) redirect("/admin/assessments?error=save");

  const { error: answerError } = await supabase.from("practice_answer_keys").insert({
    question_id: question.id,
    correct_option_key: correctOption,
  });
  if (answerError) {
    await supabase.from("practice_questions").delete().eq("id", question.id);
    redirect("/admin/assessments?error=save");
  }

  revalidatePath("/admin/assessments");
  redirect("/admin/assessments?created=question");
}

export async function setQuestionPublishedAction(formData: FormData) {
  const id = value(formData, "id");
  const published = booleanValue(value(formData, "published"));
  if (!id || published === null) redirect("/admin/assessments?error=input");

  const { supabase } = await requireAdmin();
  if (published) {
    const { data: answerKey, error: answerError } = await supabase
      .from("practice_answer_keys").select("question_id").eq("question_id", id).maybeSingle();
    if (answerError || !answerKey) redirect("/admin/assessments?error=answer-key");
  }

  const { error } = await supabase.from("practice_questions").update({ is_published: published }).eq("id", id);
  if (error) redirect("/admin/assessments?error=save");
  revalidatePath("/admin/assessments");
  revalidatePath("/dashboard");
  redirect("/admin/assessments?updated=question");
}

export async function scheduleDailyChallengeAction(formData: FormData) {
  const challengeDate = value(formData, "challenge_date");
  const questionId = value(formData, "question_id");
  const published = booleanValue(value(formData, "published"));
  if (!validDateOnly(challengeDate) || !questionId || published === null) {
    redirect("/admin/assessments?error=challenge");
  }

  const { supabase } = await requireAdmin();
  if (published && !(await questionCanBePublishedAsChallenge(supabase, questionId))) {
    redirect("/admin/assessments?error=chain");
  }

  const { data: existing, error: existingError } = await supabase
    .from("daily_challenges").select("id,question_id").eq("challenge_date", challengeDate).maybeSingle();
  if (existingError) redirect("/admin/assessments?error=save");
  if (existing && existing.question_id !== questionId) {
    const { count, error: attemptsError } = await supabase
      .from("quiz_attempts").select("id", { count: "exact", head: true }).eq("daily_challenge_id", existing.id);
    if (attemptsError || (count ?? 0) > 0) redirect("/admin/assessments?error=attempts");
  }

  const { error } = await supabase.from("daily_challenges").upsert(
    { challenge_date: challengeDate, question_id: questionId, is_published: published },
    { onConflict: "challenge_date" },
  );
  if (error) redirect("/admin/assessments?error=save");
  revalidatePath("/admin/assessments");
  revalidatePath("/dashboard");
  redirect("/admin/assessments?created=challenge");
}

export async function setDailyChallengePublishedAction(formData: FormData) {
  const id = value(formData, "id");
  const published = booleanValue(value(formData, "published"));
  if (!id || published === null) redirect("/admin/assessments?error=input");

  const { supabase } = await requireAdmin();
  if (published) {
    const { data: challenge, error: challengeError } = await supabase
      .from("daily_challenges").select("question_id").eq("id", id).maybeSingle();
    if (challengeError || !challenge || !(await questionCanBePublishedAsChallenge(supabase, challenge.question_id))) {
      redirect("/admin/assessments?error=chain");
    }
  }

  const { error } = await supabase.from("daily_challenges").update({ is_published: published }).eq("id", id);
  if (error) redirect("/admin/assessments?error=save");
  revalidatePath("/admin/assessments");
  revalidatePath("/dashboard");
  redirect("/admin/assessments?updated=challenge");
}

export async function createExamAction(formData: FormData) {
  const title = value(formData, "title");
  const subjectId = value(formData, "subject_id");
  const schoolId = value(formData, "school_id");
  const scheduledAt = ghanaDateTimeToIso(value(formData, "scheduled_at"));
  const slug = slugify(title).slice(0, 80);
  if (!title || title.length > 160 || !slug || !scheduledAt) redirect("/admin/assessments?error=exam");

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("exam_calendar").insert({
    slug,
    title,
    subject_id: subjectId || null,
    school_id: schoolId || null,
    scheduled_at: scheduledAt,
    created_by: user.id,
  });
  if (error) redirect("/admin/assessments?error=save");
  revalidatePath("/admin/assessments");
  revalidatePath("/dashboard");
  redirect("/admin/assessments?created=exam");
}

export async function setExamPublishedAction(formData: FormData) {
  const id = value(formData, "id");
  const published = booleanValue(value(formData, "published"));
  if (!id || published === null) redirect("/admin/assessments?error=input");

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("exam_calendar").update({ is_published: published }).eq("id", id);
  if (error) redirect("/admin/assessments?error=save");
  revalidatePath("/admin/assessments");
  revalidatePath("/dashboard");
  redirect("/admin/assessments?updated=exam");
}
