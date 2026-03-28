'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const EMAIL_RATE_LIMIT_MESSAGE =
  'Too many sign-up or password reset attempts. Please try again in about an hour, or use a different email.';

function isEmailRateLimitError(error: { message?: string; status?: number }): boolean {
  const msg = (error.message ?? '').toLowerCase();
  return (
    error.status === 429 ||
    msg.includes('rate limit') ||
    msg.includes('429') ||
    msg.includes('too many requests')
  );
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    return {
      error: isEmailRateLimitError(error) ? EMAIL_RATE_LIMIT_MESSAGE : error.message,
    };
  }
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirect') as string) || '/';

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      error: isEmailRateLimitError(error) ? EMAIL_RATE_LIMIT_MESSAGE : error.message,
    };
  }
  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
