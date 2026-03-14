'use client';

import { useState, useEffect } from 'react';

const CORRECT_PASSWORD = 'mattROCKS1!';
const STORAGE_KEY = 'bookclocks_auth';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    );
  }

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-charcoal mb-2">The Book Clocks</h1>
          <p className="text-charcoal/50 text-sm">Preview access — enter password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoFocus
              className={`w-full rounded-lg border ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-warm-gray'} bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">Incorrect password. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gold px-6 py-3 text-white font-medium hover:bg-gold/90 transition-colors"
          >
            Enter
          </button>
        </form>
        <p className="text-center text-charcoal/30 text-xs mt-8">
          Athena Agency &middot; Preview Build
        </p>
      </div>
    </div>
  );
}
