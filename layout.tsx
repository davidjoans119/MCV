import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCV-OS | Restaurant Management, Simplified",
  description: "One workspace to manage your restaurant operations."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
