"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { useConfigStore } from "@/stores/useConfigStore";

export default function SignInPage() {
  const config = useConfigStore((state) => state.config);
  const { status: sessionStatus } = useSession();


  useEffect(() => {
    if (config) {
      if (sessionStatus === "unauthenticated") {
        return;
      }
      //If already signed in, redirect to home
      if (sessionStatus === "authenticated") {
        location.href='/signout'
      }
    }
  }, [config, sessionStatus]); // Add sessionStatus here


  if (sessionStatus != "unauthenticated") {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Signing out
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Just a moment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Signed out
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can now close this tab
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}