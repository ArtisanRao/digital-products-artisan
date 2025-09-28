// lib/clerk-stub.tsx
'use client';
import * as React from 'react';

export const ClerkProvider = ({ children }: any) => <>{children}</>;
export const SignedIn = ({ children }: any) => <>{children}</>;
export const SignedOut = ({ children }: any) => <>{children}</>;
export const SignIn = () => null;
export const SignUp = () => null;
export const UserButton = () => null;

export const useUser = () => ({ isSignedIn: false, user: null });
export const useAuth = () => ({
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  signOut: async () => {},
});

export const auth = () => ({ userId: null });
export const currentUser = async () => null;

export default ClerkProvider;
