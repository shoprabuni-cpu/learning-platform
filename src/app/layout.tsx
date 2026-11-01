import type { Metadata } from "next";
import "./site.css";

export const metadata: Metadata = {
  title: { default: "Learning Platform", template: "%s | Learning Platform" },
  description: "A Ghana-focused learning platform for students, teachers, parents, and schools.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GH" className="scroll-smooth motion-reduce:scroll-auto">
      <body className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-brand-gold selection:text-ink">
        {children}
      </body>
    </html>
  );
}
