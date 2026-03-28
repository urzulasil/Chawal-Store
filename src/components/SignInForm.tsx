'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { signIn } from '@/app/actions/auth';

export default function SignInForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useActionState(
    async (_: unknown, formData: FormData) => {
      const result = await signIn(formData);
      if (result?.error) return { error: result.error };
      return null;
    },
    null as { error?: string } | null
  );

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent text-base"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] focus:border-transparent text-base"
      />
      {state?.error && (
        <p className="text-red-600 text-sm">{state.error}</p>
      )}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-[#27ae60] text-white font-semibold hover:bg-[#1e7e34] transition"
      >
        Sign In
      </button>
    </form>
  );
}
