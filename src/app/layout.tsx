import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Book Clocks — Turn Their Favourite Book Into a Timeless Gift",
  description:
    "Transform any book into a beautiful, handcrafted clock. The perfect personalised gift for book lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-cream text-charcoal">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-warm-gray/60">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="font-serif text-xl tracking-tight text-charcoal hover:text-gold-dark transition-colors"
            >
              The Book Clocks
            </Link>
            <div className="flex items-center gap-8">
              <Link
                href="/#how-it-works"
                className="text-sm tracking-wide text-charcoal/70 hover:text-charcoal transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/create"
                className="text-sm tracking-wide text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Create Yours
              </Link>
              <Link
                href="/about"
                className="text-sm tracking-wide text-charcoal/70 hover:text-charcoal transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </nav>

        {/* Spacer for fixed nav */}
        <div className="h-16" />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-warm-gray/60 bg-warm-gray-light">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <p className="font-serif text-lg text-charcoal mb-2">
                  The Book Clocks
                </p>
                <p className="text-sm text-charcoal/50">
                  Handcrafted with care in London
                </p>
              </div>
              <div className="flex gap-8 text-sm text-charcoal/50">
                <Link
                  href="/#how-it-works"
                  className="hover:text-charcoal transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/create"
                  className="hover:text-charcoal transition-colors"
                >
                  Create Yours
                </Link>
                <Link
                  href="/about"
                  className="hover:text-charcoal transition-colors"
                >
                  About
                </Link>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-warm-gray/60">
              <p className="text-xs text-charcoal/40">
                &copy; 2026 The Book Clocks. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
