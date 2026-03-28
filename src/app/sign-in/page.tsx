import Link from 'next/link';
import { signIn } from '@/app/actions/auth';
import SignInForm from '@/components/SignInForm';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#27ae60] mb-5 sm:mb-6">Sign In</h1>
        <SignInForm redirectTo={redirectTo ?? '/'} />
        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-[#27ae60] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
