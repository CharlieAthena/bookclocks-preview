import Link from "next/link";

const faqs = [
  {
    question: "How long does it take?",
    answer:
      "5-8 working days from order to delivery. We source the book, handcraft the clock, and ship it to you with care.",
  },
  {
    question: "Can I choose any book?",
    answer:
      "Yes -- any book available on Amazon UK. Search by title or author in our configurator and we'll find it.",
  },
  {
    question: "What if the book is out of print?",
    answer:
      "We'll search secondhand sellers and specialist bookshops. If we can find a copy in good condition, we'll use it. If not, we'll let you know before proceeding.",
  },
  {
    question: "Is it a real working clock?",
    answer:
      "Absolutely. Each clock uses a silent quartz movement that runs on 1x AA battery (included). No ticking -- just smooth, quiet timekeeping.",
  },
  {
    question: "What size are they?",
    answer:
      "The clock is the size of the book itself. A standard paperback gives you a compact desk clock; a large hardback becomes a statement piece.",
  },
  {
    question: "Can I return it?",
    answer:
      "Each Book Clock is custom-made to your specification, so we can't accept returns for change of mind. But if there's an issue with quality or the wrong book, get in touch and we'll make it right.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "UK shipping is free on every order. EU delivery is +\u00A39.99, and Rest of World is +\u00A314.99.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark mb-6 font-medium">
            Our Story
          </p>
          <h1 className="fade-in-up fade-in-up-delay-1 font-serif text-4xl md:text-5xl leading-tight mb-8">
            The Story Behind
            <br />
            The Book Clocks
          </h1>
          <p className="fade-in-up fade-in-up-delay-2 text-lg leading-relaxed text-charcoal/70 max-w-2xl mx-auto">
            We believe the best gifts are personal. A book that changed
            someone&rsquo;s life, shaped how they think, or simply made them
            laugh on a rainy afternoon -- that&rsquo;s worth more than anything
            mass-produced. We turn those books into functional works of art: a
            clock they&rsquo;ll look at every day and think of the person who
            gave it.
          </p>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="max-w-24 mx-auto border-t border-gold/40" />

      {/* ─── PROCESS ─── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark text-center mb-4 font-medium">
            The Craft
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl text-center mb-20">
            How We Make Each Clock
          </h2>

          <div className="space-y-16">
            {[
              {
                step: 1,
                title: "We source the exact book",
                description:
                  "From the world's largest bookshops and specialist sellers, we find the precise edition you chose -- the one with the cover art that means something.",
              },
              {
                step: 2,
                title: "Each mechanism is fitted by hand",
                description:
                  "A silent quartz clock movement is carefully installed into the book. No drilling, no damage to the cover -- just precise, considered craftsmanship.",
              },
              {
                step: 3,
                title: "The hands are positioned exactly where you designed them",
                description:
                  "Using the position you set in our configurator, the clock hands are placed to complement the cover art. Your design, brought to life.",
              },
              {
                step: 4,
                title: "Quality checked, packaged, and shipped",
                description:
                  "Every clock is tested, wrapped in protective packaging, and sent to your door. Gift-ready, with care.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="fade-in-up flex gap-8 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-warm-gray flex items-center justify-center">
                  <span className="font-serif text-lg text-gold-dark">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                  <p className="text-charcoal/60 leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-sage font-medium">
              Handcrafted in London
            </p>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="max-w-24 mx-auto border-t border-gold/40" />

      {/* ─── FAQ ─── */}
      <section className="py-28 px-6 bg-warm-gray-light">
        <div className="max-w-3xl mx-auto">
          <p className="fade-in-up text-sm uppercase tracking-[0.25em] text-gold-dark text-center mb-4 font-medium">
            Questions
          </p>
          <h2 className="fade-in-up fade-in-up-delay-1 font-serif text-3xl md:text-4xl text-center mb-16">
            Frequently Asked
          </h2>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border-b border-warm-gray last:border-b-0"
              >
                <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                  <span className="font-medium text-charcoal pr-4">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 text-gold-dark text-xl leading-none group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <p className="pb-6 text-charcoal/60 leading-relaxed max-w-2xl">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6">
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
