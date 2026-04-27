/**
 * Clerk Authentication — Structure Prepared (Not Yet Activated)
 *
 * To enable Clerk auth:
 *   1. npm install @clerk/clerk-react
 *   2. Create .env with:  VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
 *   3. Wrap <App /> in <AuthProvider> inside src/main.jsx
 *   4. Replace stub hooks below with real Clerk imports
 *   5. Add <UserButton /> to Nav.jsx (already has a "Sign in" placeholder)
 */

// ─── STUB (not activated) ────────────────────────────────────────────────────

/** Returns a static unauthenticated state until Clerk is activated. */
export function useAuth() {
  return {
    isLoaded:   true,
    isSignedIn: false,
    user:       null,
  };
}

/** Placeholder — renders children or a basic Sign in button. */
export function SignInButton({ children }) {
  return children ?? <button type="button">Sign in</button>;
}

/** Placeholder — renders nothing until Clerk is activated. */
export function UserButton() {
  return null;
}

/** Pass-through provider — replace with ClerkProvider once activated. */
export function AuthProvider({ children }) {
  return children;
}

/*
// ─── ACTIVATE CLERK ──────────────────────────────────────────────────────────
// Uncomment the block below and delete the stubs above.

import {
  ClerkProvider,
  useUser,
  SignInButton  as ClerkSignInButton,
  UserButton    as ClerkUserButton,
} from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env');

export function AuthProvider({ children }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}

export function useAuth() {
  const { isLoaded, isSignedIn, user } = useUser();
  return { isLoaded, isSignedIn, user };
}

export { ClerkSignInButton as SignInButton, ClerkUserButton as UserButton };
*/
