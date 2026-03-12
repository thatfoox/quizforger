import { supabase } from "./supabase";

export async function getCurrentTeacher() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session?.user ?? null;
}

export async function signInTeacher(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOutTeacher() {
  return supabase.auth.signOut();
}