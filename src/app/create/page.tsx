'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import type { Book } from '@/lib/types';

function CreatePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const genreParam = searchParams.get('genre');

  const [step, setStep] = useState<1 | 2>(1);
  const [recipientName, setRecipientName] = useState('');
  const [giverName, setGiverName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [total, setTotal] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-fill search from genre param
  useEffect(() => {
    if (genreParam && step === 2) {
      setSearchQuery(genreParam);
    }
  }, [genreParam, step]);

  // Save personalisation to localStorage
  useEffect(() => {
    if (recipientName || giverName) {
      localStorage.setItem(
        'bookClockPersonalisation',
        JSON.stringify({ recipientName, giverName })
      );
    }
  }, [recipientName, giverName]);

  const searchBooks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      setHasSearched(false);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_edition_key,isbn,edition_key`);
      const data = await res.json();

      const mappedBooks: Book[] = (data.docs || []).map((doc: Record<string, unknown>) => {
        const coverId = doc.cover_edition_key as string || ((doc.edition_key as string[])?.[0]) || null;
        const isbn = ((doc.isbn as string[])?.[0]) || null;
        return {
          key: doc.key as string,
          title: doc.title as string,
          author: ((doc.author_name as string[])?.[0]) || 'Unknown',
          year: (doc.first_publish_year as number) || null,
          coverId,
          isbn,
          coverUrl: coverId ? `https://covers.openlibrary.org/b/olid/${coverId}-L.jpg` : isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : null,
        };
      });

      setBooks(mappedBooks);
      setTotal(data.numFound || 0);
    } catch (err) {
      console.error('Search failed:', err);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (step !== 2) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchBooks(searchQuery);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, step, searchBooks]);

  function handleSkipToSearch() {
    setStep(2);
  }

  function handleContinueToSearch() {
    if (recipientName.trim() || giverName.trim()) {
      setStep(2);
    }
  }

  function handleSelectBook(book: Book) {
    const params = new URLSearchParams();
    if (book.coverId) params.set('book', book.coverId);
    params.set('title', book.title);
    params.set('author', book.author);
    if (book.coverUrl) params.set('cover', book.coverUrl);
    router.push(`/configure?${params.toString()}`);
  }

  function handleBackToPersonalise() {
    setStep(1);
  }

  // Step 1: Personalisation
  if (step === 1) {
    return (
      <div className="min-h-screen bg-cream">
        {/* Header */}
        <header className="border-b border-warm-gray">
          <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl text-charcoal tracking-wide">
              The Book Clocks
            </Link>
            <div className="flex items-center gap-2 text-sm text-charcoal/50">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-medium">1</span>
              <span className="text-charcoal/70 font-medium">Personalise</span>
              <span className="mx-2 text-charcoal/20">/</span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-warm-gray text-charcoal/40 text-xs font-medium">2</span>
              <span className="text-charcoal/40">Find a Book</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-xl px-6 pt-16 pb-24">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal text-center leading-tight mb-3">
            Make it personal
          </h1>
          <p className="text-center text-charcoal/60 text-lg mb-10 max-w-md mx-auto">
            A Book Clock is a thoughtful gift. Tell us who it&apos;s for and we&apos;ll make the experience special.
          </p>

          {/* Preview banner */}
          {(recipientName.trim() || giverName.trim()) && (
            <div className="mb-8 rounded-xl bg-sage/10 border border-sage/20 px-5 py-4 text-center fade-in-up">
              <p className="text-sage font-medium text-sm">
                {giverName.trim() && recipientName.trim() && (
                  <>Hi {giverName} &mdash; here&apos;s the perfect Book Clock for <span className="font-semibold">{recipientName}</span></>
                )}
                {giverName.trim() && !recipientName.trim() && (
                  <>Hi {giverName} &mdash; let&apos;s find the perfect Book Clock</>
                )}
                {!giverName.trim() && recipientName.trim() && (
                  <>Finding the perfect Book Clock for <span className="font-semibold">{recipientName}</span></>
                )}
              </p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-charcoal/70 mb-1.5">
                Who is this gift for?
              </label>
              <input
                id="recipientName"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Samantha"
                className="w-full rounded-lg border border-warm-gray bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>
            <div>
              <label htmlFor="giverName" className="block text-sm font-medium text-charcoal/70 mb-1.5">
                Your name (the gift giver)
              </label>
              <input
                id="giverName"
                type="text"
                value={giverName}
                onChange={(e) => setGiverName(e.target.value)}
                placeholder="e.g. Tom"
                className="w-full rounded-lg border border-warm-gray bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              onClick={handleContinueToSearch}
              disabled={!recipientName.trim() && !giverName.trim()}
              className="w-full rounded-lg bg-gold px-8 py-3.5 text-white font-medium hover:bg-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Book Search
            </button>
            <button
              onClick={handleSkipToSearch}
              className="text-sm text-charcoal/40 hover:text-charcoal/60 transition-colors py-2"
            >
              Skip &mdash; I&apos;ll just search for a book
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Step 2: Book Search
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-warm-gray">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-charcoal tracking-wide">
            The Book Clocks
          </Link>
          <div className="flex items-center gap-2 text-sm text-charcoal/50">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage text-white text-xs font-medium">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
            <span className="text-charcoal/40">Personalise</span>
            <span className="mx-2 text-charcoal/20">/</span>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white text-xs font-medium">2</span>
            <span className="text-charcoal/70 font-medium">Find a Book</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-10 pb-24">
        {/* Back link */}
        <button
          onClick={handleBackToPersonalise}
          className="inline-flex items-center gap-1.5 text-sm text-charcoal/40 hover:text-charcoal/60 transition-colors mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to personalise
        </button>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight mb-3">
            {recipientName.trim()
              ? <>Let&apos;s find the perfect book for <span className="text-gold">{recipientName}</span></>
              : <>Find the perfect book</>
            }
          </h1>
          <p className="text-charcoal/60 text-lg max-w-lg mx-auto">
            Search by title, author, or topic. We&apos;ll turn any book cover into a beautiful working clock.
          </p>
        </div>

        {/* Search input */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a book by title or author..."
              autoFocus
              className="w-full rounded-xl border border-warm-gray bg-white pl-12 pr-4 py-4 text-lg text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 shadow-sm transition-all"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
              </div>
            )}
          </div>
          {hasSearched && !isLoading && books.length > 0 && (
            <p className="mt-3 text-sm text-charcoal/40 text-center">
              Showing {books.length} of {total.toLocaleString()} results
            </p>
          )}
        </div>

        {/* Empty state */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-16 fade-in-up">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 mb-6">
              <svg className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="font-serif text-xl text-charcoal mb-2">
              Every great clock starts with a great book
            </h2>
            <p className="text-charcoal/50 max-w-sm mx-auto">
              Try searching for a favourite novel, a beloved children&apos;s book, or an author {recipientName.trim() ? `${recipientName} loves` : 'you love'}.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Pride and Prejudice', 'The Great Gatsby', 'Harry Potter', 'To Kill a Mockingbird', '1984'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="rounded-full border border-warm-gray bg-white px-4 py-2 text-sm text-charcoal/60 hover:border-gold hover:text-gold transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {hasSearched && !isLoading && books.length === 0 && searchQuery.trim() && (
          <div className="text-center py-16 fade-in-up">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warm-gray-light mb-5">
              <svg className="h-8 w-8 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl text-charcoal mb-2">
              No books found
            </h2>
            <p className="text-charcoal/50 max-w-sm mx-auto">
              Try a different title, author name, or check your spelling.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] rounded-lg bg-warm-gray/50 mb-3" />
                <div className="h-4 bg-warm-gray/50 rounded mb-2 w-3/4" />
                <div className="h-3 bg-warm-gray/30 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Results grid */}
        {!isLoading && books.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {books.map((book, index) => (
              <button
                key={book.key + index}
                onClick={() => handleSelectBook(book)}
                className="group text-left rounded-xl p-3 -m-3 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-warm-gray-light mb-3 relative">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('flex', 'items-center', 'justify-center');
                          const fallback = document.createElement('div');
                          fallback.className = 'text-center px-3';
                          fallback.innerHTML = `
                            <svg class="h-8 w-8 text-charcoal/20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                            <p class="text-xs text-charcoal/30 leading-tight">${book.title.slice(0, 40)}</p>
                          `;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center px-3">
                      <div className="text-center">
                        <svg className="h-8 w-8 text-charcoal/20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        <p className="text-xs text-charcoal/30 leading-tight">{book.title.slice(0, 40)}</p>
                      </div>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full px-4 py-2 text-sm font-medium text-gold shadow-lg">
                      Select
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-sm text-charcoal leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-charcoal/50 mt-0.5 line-clamp-1">
                  {book.author}
                </p>
                {book.year && (
                  <p className="text-xs text-charcoal/30 mt-0.5">{book.year}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </div>
      }
    >
      <CreatePageInner />
    </Suspense>
  );
}
