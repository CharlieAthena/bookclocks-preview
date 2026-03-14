"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PriceBreakdown, { calculateTotal } from "@/components/PriceBreakdown";
import type { ClockConfig } from "@/lib/types";

type ShippingZone = "uk" | "eu" | "row";

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  giftMessage: string;
}

interface OrderConfirmation {
  orderNumber: string;
  email: string;
}

const INITIAL_SHIPPING: ShippingForm = {
  fullName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  county: "",
  postcode: "",
  country: "United Kingdom",
  giftMessage: "",
};

function getShippingZone(country: string): ShippingZone {
  const uk = ["united kingdom", "uk", "gb", "great britain"];
  const eu = [
    "austria", "belgium", "bulgaria", "croatia", "cyprus", "czech republic",
    "denmark", "estonia", "finland", "france", "germany", "greece", "hungary",
    "ireland", "italy", "latvia", "lithuania", "luxembourg", "malta",
    "netherlands", "poland", "portugal", "romania", "slovakia", "slovenia",
    "spain", "sweden",
  ];
  const lower = country.toLowerCase().trim();
  if (uk.includes(lower)) return "uk";
  if (eu.includes(lower)) return "eu";
  return "row";
}

export default function CheckoutPage() {
  const [config, setConfig] = useState<ClockConfig | null>(null);
  const [shipping, setShipping] = useState<ShippingForm>(INITIAL_SHIPPING);
  const [shippingZone, setShippingZone] = useState<ShippingZone>("uk");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bookClockOrder");
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    setShippingZone(getShippingZone(shipping.country));
  }, [shipping.country]);

  function updateField(field: keyof ShippingForm, value: string) {
    setShipping((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: config.book,
          config: {
            handStyle: config.handStyle,
            handColor: config.handColor,
            handSize: config.handSize,
            positionX: config.positionX,
            positionY: config.positionY,
          },
          shipping: {
            fullName: shipping.fullName,
            email: shipping.email,
            phone: shipping.phone,
            address1: shipping.address1,
            address2: shipping.address2,
            city: shipping.city,
            county: shipping.county,
            postcode: shipping.postcode,
            country: shipping.country,
          },
          personalisation: {
            giverName: config.giverName,
            recipientName: config.recipientName,
            giftMessage: shipping.giftMessage,
          },
          total: calculateTotal(12.99, config.handStyle, shippingZone),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setConfirmation({
        orderNumber: data.orderNumber,
        email: shipping.email,
      });

      // Clear stored order
      localStorage.removeItem("bookClockOrder");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── NO CONFIG ───
  if (!config) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-2xl mb-4">No order to check out</h1>
          <p className="text-charcoal/60 mb-8 leading-relaxed">
            It looks like you haven&rsquo;t designed a Book Clock yet. Head to
            the configurator to get started.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-charcoal text-cream px-8 py-4 text-sm tracking-wide uppercase font-medium hover:bg-charcoal/85 transition-colors"
          >
            Create a Book Clock
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    );
  }

  // ─── CONFIRMATION ───
  if (confirmation) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-sage/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-sage"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl mb-4">
            Your Book Clock is Being Crafted
          </h1>

          <div className="inline-block bg-warm-gray-light border border-warm-gray px-6 py-3 mb-8">
            <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-1">
              Order Number
            </p>
            <p className="font-mono text-lg text-charcoal font-medium">
              {confirmation.orderNumber}
            </p>
          </div>

          <p className="text-charcoal/60 mb-8 leading-relaxed">
            We&rsquo;ll email you at{" "}
            <span className="text-charcoal font-medium">
              {confirmation.email}
            </span>{" "}
            with updates on your order.
          </p>

          {/* Timeline */}
          <div className="bg-white border border-warm-gray p-8 mb-8 text-left">
            <h3 className="font-serif text-lg mb-6 text-center">
              What Happens Next
            </h3>
            <div className="space-y-6">
              {[
                {
                  label: "Book Sourced",
                  time: "2-3 days",
                  desc: "We find and order the exact edition",
                },
                {
                  label: "Handcrafted",
                  time: "1-2 days",
                  desc: "Clock mechanism fitted and hands positioned",
                },
                {
                  label: "Shipped to You",
                  time: "2-3 days",
                  desc: "Quality checked, packaged, and dispatched",
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-warm-gray flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-gold-dark">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-charcoal text-sm">
                      {step.label}{" "}
                      <span className="text-charcoal/40 font-normal">
                        &middot; {step.time}
                      </span>
                    </p>
                    <p className="text-sm text-charcoal/50">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalised message */}
          {config.giverName && config.recipientName && (
            <div className="bg-warm-gray-light border border-warm-gray p-6 mb-8 italic text-charcoal/70">
              <p>
                Hi {config.giverName}, your Book Clock of{" "}
                <span className="not-italic font-medium text-charcoal">
                  {config.book.title}
                </span>{" "}
                for {config.recipientName} is on its way.
              </p>
            </div>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gold-dark hover:text-charcoal transition-colors uppercase tracking-wide"
          >
            <span aria-hidden="true">&larr;</span>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ─── CHECKOUT FORM ───
  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.25em] text-gold-dark mb-4 font-medium">
            Checkout
          </p>
          <h1 className="font-serif text-3xl md:text-4xl">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* ─── LEFT: FORM ─── */}
            <div className="lg:col-span-2 space-y-10">
              {/* Order Summary Card */}
              <div className="bg-white border border-warm-gray p-6">
                <h2 className="font-serif text-lg mb-5">Your Book Clock</h2>
                <div className="flex gap-6">
                  {/* Cover preview with clock overlay */}
                  <div className="relative flex-shrink-0 w-28">
                    {config.book.coverUrl ? (
                      <div className="relative">
                        <img
                          src={config.book.coverUrl}
                          alt={config.book.title}
                          className="w-28 shadow-md"
                        />
                        {/* Clock hands overlay */}
                        <div
                          className="absolute w-10 h-10"
                          style={{
                            left: `${config.positionX}%`,
                            top: `${config.positionY}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {/* Hour hand */}
                          <div
                            className="absolute left-1/2 bottom-1/2 w-0.5 h-3 origin-bottom rounded-full"
                            style={{
                              backgroundColor: config.handColor || "#2D2D2D",
                              transform: "translateX(-50%) rotate(-30deg)",
                            }}
                          />
                          {/* Minute hand */}
                          <div
                            className="absolute left-1/2 bottom-1/2 w-0.5 h-4 origin-bottom rounded-full"
                            style={{
                              backgroundColor: config.handColor || "#2D2D2D",
                              transform: "translateX(-50%) rotate(60deg)",
                            }}
                          />
                          {/* Centre dot */}
                          <div
                            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                            style={{
                              backgroundColor: config.handColor || "#2D2D2D",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-28 h-40 bg-warm-gray flex items-center justify-center">
                        <span className="text-xs text-charcoal/40">
                          No cover
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg leading-snug mb-1 truncate">
                      {config.book.title}
                    </h3>
                    <p className="text-sm text-charcoal/60 mb-3">
                      {config.book.author}
                    </p>
                    <div className="space-y-1 text-sm text-charcoal/50">
                      <p>
                        <span className="text-charcoal/70">Hands:</span>{" "}
                        {config.handStyle} &middot;{" "}
                        {config.handSize.charAt(0).toUpperCase() +
                          config.handSize.slice(1)}
                      </p>
                      <p>
                        <span className="text-charcoal/70">Colour:</span>{" "}
                        <span
                          className="inline-block w-3 h-3 rounded-full align-middle mr-1 border border-warm-gray"
                          style={{ backgroundColor: config.handColor }}
                        />
                        {config.handColor}
                      </p>
                    </div>
                    {config.giverName && config.recipientName && (
                      <p className="mt-3 text-sm text-gold-dark italic">
                        A gift from {config.giverName} to{" "}
                        {config.recipientName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── SHIPPING ─── */}
              <div>
                <h2 className="font-serif text-lg mb-5">Shipping Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      Full Name <span className="text-gold-dark">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      Email <span className="text-gold-dark">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={shipping.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="07700 900000"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      Address Line 1 <span className="text-gold-dark">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.address1}
                      onChange={(e) => updateField("address1", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="123 Book Lane"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={shipping.address2}
                      onChange={(e) => updateField("address2", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="Flat 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      City <span className="text-gold-dark">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="London"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      County
                    </label>
                    <input
                      type="text"
                      value={shipping.county}
                      onChange={(e) => updateField("county", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="Greater London"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      Postcode <span className="text-gold-dark">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.postcode}
                      onChange={(e) => updateField("postcode", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="SW1A 1AA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value={shipping.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                      placeholder="United Kingdom"
                    />
                  </div>

                  {/* Gift message */}
                  <div className="sm:col-span-2 mt-2">
                    <label className="block text-sm text-charcoal/70 mb-1.5">
                      Gift Message{" "}
                      <span className="text-charcoal/40">(optional)</span>
                    </label>
                    <p className="text-xs text-charcoal/40 mb-2">
                      Include a handwritten message with the clock
                    </p>
                    <textarea
                      value={shipping.giftMessage}
                      onChange={(e) =>
                        updateField("giftMessage", e.target.value)
                      }
                      rows={3}
                      maxLength={200}
                      className="w-full border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors resize-none"
                      placeholder="Happy birthday! I know how much this book means to you..."
                    />
                    <p className="text-xs text-charcoal/30 mt-1 text-right">
                      {shipping.giftMessage.length}/200
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── PAYMENT ─── */}
              <div>
                <h2 className="font-serif text-lg mb-5">Payment</h2>
                <div className="bg-white border border-warm-gray p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4 text-charcoal/40">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className="text-xs uppercase tracking-widest">
                      Secure payment powered by Stripe
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/50 mb-6">
                    Card payment will be collected when we confirm your book is
                    available.
                  </p>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-charcoal text-cream px-8 py-4 text-sm tracking-wide uppercase font-medium hover:bg-charcoal/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      <>
                        Complete Order &mdash; &pound;
                        {calculateTotal(
                          12.99,
                          config.handStyle,
                          shippingZone
                        ).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: PRICE SIDEBAR ─── */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <PriceBreakdown
                  bookPrice={12.99}
                  handStyle={config.handStyle}
                  handSize={config.handSize}
                  shippingZone={shippingZone}
                />

                <div className="border border-warm-gray bg-white p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-sage mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-xs text-charcoal/60">
                      Handcrafted to your exact design
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-sage mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-xs text-charcoal/60">
                      Silent quartz movement included
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-sage mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-xs text-charcoal/60">
                      Gift-ready packaging
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-sage mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-xs text-charcoal/60">
                      5-8 working day delivery
                    </p>
                  </div>
                </div>

                <Link
                  href="/create"
                  className="block text-center text-xs text-charcoal/40 hover:text-charcoal/60 transition-colors uppercase tracking-widest"
                >
                  &larr; Back to configurator
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
