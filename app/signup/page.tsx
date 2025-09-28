'use client';

import { SignUp } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-lg mt-24 px-4">
      <Card className="p-6 flex justify-center">
        <SignUp
          path="/signup"
          routing="path"
          signInUrl="/login"
          afterSignUpUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            },
          }}
        />
      </Card>
    </div>
  );
}
