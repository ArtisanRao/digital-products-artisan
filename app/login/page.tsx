'use client';

import { SignIn } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg mt-24 px-4">
      <Card className="p-6 flex justify-center">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/signup"
          afterSignInUrl="/"
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
