"use client";

import Link from "next/link";

const giftGenres = [
  {
    title: "For the Fiction Lover",
    description: "Classic novels, modern literary fiction, beloved stories",
    genre: "fiction",
  },
  {
    title: "For the History Buff",
    description: "Wars, civilisations, biographies of great figures",
    genre: "history",
  },
  {
    title: "For the Children's Classic Fan",
    description: "The books that shaped their childhood",
    genre: "childrens",
  },
  {
    title: "For the Cook",
    description: "Iconic cookbooks from their favourite chefs",
    genre: "cooking",
  },
  {
    title: "For the Sci-Fi Fan",
    description: "Asimov, Herbert, Le Guin, and beyond",
    genre: "scifi",
  },
  {
    title: "For the Poetry Reader",
    description: "Verse that moves, comforts, and inspires",
    genre: "poetry",
  },
];

export default function Home() {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark mb-6 font-medium">
            Personalised Gifts for Book Lovers
          </p>
          <h1 className="fade-in-up fade-in-up-delay-1 font-serif text-4xl md:text-6xl leading-tight md:leading-[1.15] text-charcoal mb-8">
            Turn Their Favourite Book Into a Timeless Gift
          </h1>
          <p className="fade-in-up fade-in-up-delay-2 text-lg md:text-xl leading-relaxed text-charcoal/70 mb-10 max-w-2xl mx-auto">
            When you give someone a book, you&rsquo;re giving them a world — a
            memory, a feeling, a piece of who you are. But most gifted books sit
            unread on a shelf. A Book Clock transforms that book into a piece of
            art they&rsquo;ll look at every single day.
          </p>
          <div className="fade-in-up fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-charcoal text-cream px-8 py-4 text-sm tracking-wide uppercase font-medium hover:bg-charcoal/85 transition-colors"
            >
              Create a Book Clock
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <p className="fade-in-up fade-in-up-delay-4 text-sm text-charcoal/45 italic">
            What&rsquo;s your friend or loved one&rsquo;s favourite book?
          </p>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="max-w-24 mx-auto border-t border-gold/40" />

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark text-center mb-4 font-medium">
            How It Works
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl text-center mb-20">
            Three Simple Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-16 md:gap-12">
            {/* Step 1 */}
            <div className="fade-in-up fade-in-up-delay-1 text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-warm-gray flex items-center justify-center">
                <span className="font-serif text-xl text-gold-dark">1</span>
              </div>
              <h3 className="font-serif text-xl mb-3">Choose Their Book</h3>
              <p className="text-charcoal/60 leading-relaxed">
                Search for any book by title or author. We&rsquo;ll find the
                cover art and bring it to life.
              </p>
            </div>

            {/* Step 2 */}
            <div className="fade-in-up fade-in-up-delay-2 text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-warm-gray flex items-center justify-center">
                <span className="font-serif text-xl text-gold-dark">2</span>
              </div>
              <h3 className="font-serif text-xl mb-3">Design the Clock</h3>
              <p className="text-charcoal/60 leading-relaxed">
                Position the clock hands on the cover art and choose your style.
                Make it uniquely theirs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="fade-in-up fade-in-up-delay-3 text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-warm-gray flex items-center justify-center">
                <span className="font-serif text-xl text-gold-dark">3</span>
              </div>
              <h3 className="font-serif text-xl mb-3">
                We Handcraft &amp; Ship
              </h3>
              <p className="text-charcoal/60 leading-relaxed">
                We source the book, build the clock by hand, and deliver it
                gift-ready to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EMOTIONAL SECTION ─── */}
      <section className="py-28 px-6 bg-warm-gray-light">
        <div className="max-w-3xl mx-auto text-center">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-sage mb-4 font-medium">
            More Than a Gift
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl leading-snug mb-8">
            More Than a Gift.
            <br />A Daily Reminder.
          </h2>
          <p className="fade-in-up fade-in-up-delay-2 text-lg md:text-xl leading-relaxed text-charcoal/65 max-w-2xl mx-auto">
            Every time they glance at the clock, they&rsquo;ll think of the
            story — and the person who gave it to them. It&rsquo;s not just a
            clock. It&rsquo;s not just a book. It&rsquo;s both, and it&rsquo;s
            beautiful.
          </p>
        </div>
      </section>

      {/* ─── GIFT IDEAS ─── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark text-center mb-4 font-medium">
            Gift Ideas
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl text-center mb-16">
            A Book Clock for Everyone
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftGenres.map((item, i) => (
              <Link
                key={item.genre}
                href={`/create?genre=${item.genre}`}
                className={`fade-in-up fade-in-up-delay-${Math.min(i + 1, 5)} group block border border-warm-gray hover:border-gold/50 p-8 transition-all duration-300 hover:shadow-sm bg-white`}
              >
                <h3 className="font-serif text-lg mb-2 group-hover:text-gold-dark transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-charcoal/50 leading-relaxed">
                  {item.description}
                </p>
                <span className="inline-block mt-4 text-xs uppercase tracking-widest text-gold-dark opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-28 px-6 bg-warm-gray-light">
        <div className="max-w-3xl mx-auto text-center">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark mb-4 font-medium">
            Transparent Pricing
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl mb-8">
            Simple, Honest Pricing
          </h2>
          <div className="fade-in-up fade-in-up-delay-2 inline-block bg-white border border-warm-gray px-12 py-10 mb-8">
            <p className="font-serif text-4xl md:text-5xl text-charcoal mb-2">
              From &pound;49.99
            </p>
            <p className="text-sm text-charcoal/50 mt-4">
              Price = book + handcrafted clock mechanism + free UK shipping
            </p>
          </div>
          <p className="fade-in-up fade-in-up-delay-3 text-charcoal/60 leading-relaxed max-w-lg mx-auto">
            Each clock is made to order, just for them. No mass production, no
            shortcuts — just careful craftsmanship and a gift that means
            something.
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="fade-in-up font-serif text-3xl md:text-4xl leading-snug mb-6">
            Ready to Create
            <br />
            Something Special?
          </h2>
          <Link
            href="/create"
            className="fade-in-up fade-in-up-delay-1 inline-flex items-center gap-2 bg-charcoal text-cream px-8 py-4 text-sm tracking-wide uppercase font-medium hover:bg-charcoal/85 transition-colors"
          >
            Start with their favourite book
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
