import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {!isHome && (
              <Link href="/">
                <button className="material-icons text-gray-500 hover:text-blue-600 transition">
                  arrow_back
                </button>
              </Link>
            )}
            <Link href="/">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
                ToolGenius
              </h1>
            </Link>
          </div>
          <span className="text-sm text-gray-500">100% Local, Free & Private</span>
        </div>
      </header>

      <main>{children}</main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t bg-white mt-12">
        <p>
          © 2025 ToolGenius. All rights reserved. |{" "}
          <span className="text-green-600">●</span> All processing happens locally in your browser
        </p>
      </footer>
    </div>
  );
}
