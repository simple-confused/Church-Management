import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "XYZ | Sign Up",
  description: "This is our sign up page",
};

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-dvh flex items-center justify-center">
      {children}
    </div>
  );
}

export default layout;
