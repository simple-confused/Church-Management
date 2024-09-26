import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/my_components/providers/ThemeProvider";
import Script from "next/script";

const inter = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "XYZ | HOME",
  description:
    "XYZ Church Management Services provides an all-encompassing solution for church administration, designed to streamline operations and foster community engagement through a suite of robust tools tailored to the specific needs of congregations. Our platform facilitates effortless member management, comprehensive event scheduling, and seamless communication via integrated email, SMS, and social media channels. Additionally, we offer secure online donation tracking, detailed financial reporting, and efficient volunteer coordination. With a customizable dashboard and advanced reporting and analytics, our user-friendly interface ensures accessibility for all administrative team members, while our commitment to data security, evidenced by robust encryption and regular backups, guarantees the protection of sensitive information. Supported by 24/7 customer assistance and flexible pricing plans to accommodate churches of all sizes, XYZ Church Management Services is dedicated to enhancing organizational efficiency and community connectivity within your church.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
      <Script defer src="https://checkout.razorpay.com/v1/checkout.js"></Script>
    </html>
  );
}
