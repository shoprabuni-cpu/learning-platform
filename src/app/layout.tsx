import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Learning Platform", template: "%s | Learning Platform" },
  description: "A Ghana-focused learning platform for students, teachers, parents, and schools.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GH"><body>{children}</body></html>;
}
