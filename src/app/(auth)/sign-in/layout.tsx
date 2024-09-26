import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "XYZ | Sign In",
  description:
    "This is our sign in page for use can sign in and go to the dashboard and if the user does not have account they can create a new account on sign up page",
};

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-dvh flex items-center justify-center">
      {children}
    </div>
  );
}

export default layout;
