'use client';

import { SignUp } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-lg">
        <Card className="p-6 flex justify-center">
          <SignUp
            routing="path"
            signInUrl="/login"
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
