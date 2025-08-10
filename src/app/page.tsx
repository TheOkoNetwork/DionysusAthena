'use client';

import { signIn } from 'next-auth/react';
import { useSession } from "next-auth/react";
export default function Home() {
  const { data: session, status } = useSession();

  return (
    
    <div>
      <h1>Login Page</h1>
      {status}
      {status === "authenticated" && (
          <div>
            Welcome {session.user?.name}!
          </div>
        )}
      <button onClick={() => signIn('Zitadel')}>
        Sign In
      </button>
    </div>
  );
}
