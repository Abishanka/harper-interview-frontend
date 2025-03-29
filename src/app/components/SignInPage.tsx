
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-[#ff6d63]">Sign In</h1>
        <SignIn />
      </div>
    </div>
  );
}
