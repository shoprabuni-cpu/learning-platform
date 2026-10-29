"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

async function siteOrigin() {
  const requestHeaders = await headers();
  return process.env.NEXT_PUBLIC_SITE_URL || requestHeaders.get("origin") || "http://localhost:3000";
}

function ensureConfigured(destination: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    redirect(destination + "?error=setup");
  }
}

export async function signInAction(formData: FormData) {
  const email = field(formData, "email");
  const password = field(formData, "password");
  if (!email || !password) redirect("/login?error=missing");
  ensureConfigured("/login");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=invalid");
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const fullName = field(formData, "full_name");
  const email = field(formData, "email");
  const password = field(formData, "password");
  const confirmPassword = field(formData, "confirm_password");
  const requestedRole = field(formData, "role");

  if (!fullName || !email || password.length < 8 || password !== confirmPassword) redirect("/register?error=details");
  if (!["student", "teacher", "parent"].includes(requestedRole)) redirect("/register?error=role");
  ensureConfigured("/register");

  const supabase = await createClient();
  const origin = await siteOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin + "/auth/callback?next=/dashboard",
      data: { full_name: fullName, requested_role: requestedRole },
    },
  });

  if (error) redirect("/register?error=signup");
  if (data.session) redirect("/dashboard");
  redirect("/auth/check-email");
}

export async function signInWithGoogleAction() {
  ensureConfigured("/login");
  const supabase = await createClient();
  const origin = await siteOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: origin + "/auth/callback?next=/dashboard" },
  });
  if (error || !data.url) redirect("/login?error=google");
  redirect(data.url);
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = field(formData, "email");
  if (!email) redirect("/auth/forgot-password?error=email");
  ensureConfigured("/auth/forgot-password");
  const supabase = await createClient();
  const origin = await siteOrigin();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin + "/auth/callback?next=/auth/update-password",
  });
  redirect("/auth/forgot-password?sent=1");
}

export async function updatePasswordAction(formData: FormData) {
  const password = field(formData, "password");
  const confirmPassword = field(formData, "confirm_password");
  if (password.length < 8 || password !== confirmPassword) redirect("/auth/update-password?error=password");
  ensureConfigured("/auth/update-password");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/auth/update-password?error=link");
  redirect("/login?updated=1");
}

export async function signOutAction() {
  ensureConfigured("/login");
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
