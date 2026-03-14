"use client";

import Link from "next/link";

const galleryItems = [
  { src: "/gallery/hp-skeleton-gears.png", title: "Harry Potter — Skeleton Gears", price: "£189.99", tag: "Premium" },
  { src: "/gallery/brief-history-time.png", title: "A Brief History of Time", price: "£79.99" },
  { src: "/gallery/alice-wonderland.jpg", title: "Alice in Wonderland", price: "£69.99" },
  { src: "/gallery/dune.png", title: "Dune", price: "£74.99" },
  { src: "/gallery/great-gatsby.png", title: "The Great Gatsby", price: "£69.99" },
  { src: "/gallery/van-gogh.png", title: "Van Gogh Complete Paintings", price: "£89.99", tag: "Art Edition" },
  { src: "/gallery/banksy.png", title: "Banksy", price: "£79.99" },
  { src: "/gallery/klimt.png", title: "Gustav Klimt", price: "£74.99" },
];

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

const testimonials = [
  {
    quote: "I gave my mum a Pride and Prejudice clock for her birthday. She cried. It\u2019s been on her wall ever since.",
    name: "Sarah T.",
  },
  {
    quote: "The craftsmanship is incredible. You can still flip through the pages. It\u2019s a real conversation starter.",
    name: "James M.",
  },
  {
    quote: "Ordered one for my wife\u2019s office \u2014 a first edition Harry Potter clock. She absolutely loves it.",
    name: "David K.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark mb-6 font-medium">
            Personalised Gifts for Book Lovers
          </p>
          <h1 className="fade-in-up fade-in-up-delay-1 font-serif text-4xl md:text-6xl lg:text-7xl leading-tight md:leading-[1.12] text-charcoal mb-8">
            Turn Their Favourite Book Into a Timeless Gift
          </h1>
          <p className="fade-in-up fade-in-up-delay-2 text-lg md:text-xl leading-relaxed text-charcoal/70 mb-10 max-w-2xl mx-auto">
            When you give someone a book, you&rsquo;re giving them a world &mdash; a
            memory, a feeling. But most gifted books sit unread on a shelf. A Book
            Clock transforms that story into a piece of art they&rsquo;ll look at
            every single day.
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

      {/* ─── GALLERY / SHOWCASE ─── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark text-center mb-4 font-medium">
            Handcrafted Book Clocks
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl text-center mb-4">
            Our Collection
          </h2>
          <p className="fade-in-up fade-in-up-delay-2 text-center text-charcoal/60 mb-16 max-w-xl mx-auto">
            Each one made from a real book, transformed into a working clock
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {galleryItems.map((item, i) => (
              <Link
                key={item.src}
                href="/create"
                className={`fade-in-up fade-in-up-delay-${Math.min(i + 1, 5)} group relative block bg-white overflow-hidden transition-all duration-300 hover:shadow-lg`}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.tag && (
                    <span className="absolute top-3 left-3 bg-gold-dark text-cream text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
                      {item.tag}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-12">
                    <h3 className="font-serif text-sm md:text-base text-white leading-snug mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                      {item.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold-dark hover:text-charcoal transition-colors font-medium"
            >
              Create your own
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
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
                Search for any book &mdash; their favourite novel, a childhood
                classic, or a beautiful coffee table book.
              </p>
            </div>

            {/* Step 2 */}
            <div className="fade-in-up fade-in-up-delay-2 text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-warm-gray flex items-center justify-center">
                <span className="font-serif text-xl text-gold-dark">2</span>
              </div>
              <h3 className="font-serif text-xl mb-3">Design the Clock</h3>
              <p className="text-charcoal/60 leading-relaxed">
                Position the clock hands on the cover, choose your style &mdash;
                from classic brass to ornate gothic.
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
                We source the book, build the clock by hand in our London
                workshop, and deliver it gift-ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-28 px-6 bg-warm-gray-light">
        <div className="max-w-5xl mx-auto">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark text-center mb-4 font-medium">
            What People Say
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl text-center mb-16">
            Stories from Our Customers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`fade-in-up fade-in-up-delay-${i + 1} bg-white p-8 border border-warm-gray/60`}
              >
                <div className="font-serif text-3xl text-gold/60 mb-4">&ldquo;</div>
                <p className="text-charcoal/70 leading-relaxed mb-6 italic">
                  {t.quote}
                </p>
                <p className="text-sm font-medium text-charcoal/80">
                  &mdash; {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EMOTIONAL SECTION ─── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-sage mb-4 font-medium">
            More Than a Gift
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl leading-snug mb-8">
            Every time they glance at the clock, they&rsquo;ll think of the
            story &mdash; and the person who gave it to them.
          </h2>
          <p className="fade-in-up fade-in-up-delay-2 text-lg md:text-xl leading-relaxed text-charcoal/65 max-w-2xl mx-auto">
            It&rsquo;s not just a clock. It&rsquo;s not just a book. It&rsquo;s
            both, and it&rsquo;s beautiful.
          </p>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="max-w-24 mx-auto border-t border-gold/40" />

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
            shortcuts &mdash; just careful craftsmanship and a gift that means
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
