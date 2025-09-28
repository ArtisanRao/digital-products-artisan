'use client';

import { SignIn } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-lg">
        <Card className="p-6 flex justify-center">
          <SignIn
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
    </div>
  );
}
