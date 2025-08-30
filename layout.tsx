import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EcoTrack – Carbon Smart Actions",
  description: "Log sustainable actions, earn eco-points, and swap rewards with the community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f7faf8] text-gray-900">
        <header className="bg-white border-b">
          <div className="container-max py-3 flex items-center justify-between">
            <div className="font-semibold">🌿 EcoTrack <span className="badge">Demo</span></div>
            <nav className="text-sm flex gap-4">
              <a href="/">Dashboard</a>
              <a href="/actions">Actions</a>
              <a href="/swap">Swap</a>
              <a href="/sim">Simulator</a>
            </nav>
          </div>
        </header>
        <main className="container-max py-8">{children}</main>
      </body>
    </html>
  );
}
