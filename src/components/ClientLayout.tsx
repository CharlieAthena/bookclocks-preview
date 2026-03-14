'use client';

import Link from 'next/link';
import PasswordGate from './PasswordGate';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <PasswordGate>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-warm-gray/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl tracking-tight text-charcoal hover:text-gold-dark transition-colors"
          >
            The Book Clocks
          </Link>
          <div className="hidden sm:flex items-center gap-8">
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
      {children}

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
              <Link href="/#how-it-works" className="hover:text-charcoal transition-colors">
                How It Works
              </Link>
              <Link href="/create" className="hover:text-charcoal transition-colors">
                Create Yours
              </Link>
              <Link href="/about" className="hover:text-charcoal transition-colors">
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
    </PasswordGate>
  );
}
