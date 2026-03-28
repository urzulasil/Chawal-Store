import Link from 'next/link';
import SignUpForm from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#27ae60] mb-5 sm:mb-6">Sign Up</h1>
        <SignUpForm />
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[#27ae60] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
