"use client";

import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ClockOverlay from "@/components/ClockOverlay";
import {
  CLOCK_HAND_STYLES,
  HAND_COLORS,
  HAND_SIZES,
  MARKER_STYLES,
  type MarkerStyle,
  type ClockHandStyle,
} from "@/lib/clock-hands";

/* ------------------------------------------------------------------ */
/*  Ripple animation for click feedback                               */
/* ------------------------------------------------------------------ */
interface Ripple {
  id: number;
  x: number;
  y: number;
}

/* ------------------------------------------------------------------ */
/*  Inner component that uses useSearchParams (needs Suspense)        */
/* ------------------------------------------------------------------ */
function ConfiguratorInner() {
  const searchParams = useSearchParams();

  const bookTitle = searchParams.get("title") || "Selected Book";
  const bookAuthor = searchParams.get("author") || "";
  const coverUrl = searchParams.get("cover") || "";
  const giverName = searchParams.get("giver") || "";
  const recipientName = searchParams.get("recipient") || "";

  // --- State ---
  const [centerX, setCenterX] = useState(0.5);
  const [centerY, setCenterY] = useState(0.4);
  const [selectedStyle, setSelectedStyle] = useState<ClockHandStyle>(
    CLOCK_HAND_STYLES[0]
  );
  const [selectedColor, setSelectedColor] = useState(HAND_COLORS[0].hex);
  const [selectedSize, setSelectedSize] = useState(HAND_SIZES[1]); // medium
  const [markerStyle, setMarkerStyle] = useState<MarkerStyle>("none");
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [containerDims, setContainerDims] = useState({ w: 0, h: 0 });
  const [coverLoaded, setCoverLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rippleCounter = useRef(0);

  // --- Measure container ---
  const measureContainer = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDims({ w: rect.width, h: rect.height });
    }
  }, []);

  useEffect(() => {
    measureContainer();
    window.addEventListener("resize", measureContainer);
    return () => window.removeEventListener("resize", measureContainer);
  }, [measureContainer]);

  // Re-measure when cover image loads (may change container height)
  useEffect(() => {
    if (coverLoaded) measureContainer();
  }, [coverLoaded, measureContainer]);

  // --- Position handling ---
  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      setCenterX(x);
      setCenterY(y);
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      updatePosition(e.clientX, e.clientY);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

      // Spawn ripple
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const rx = e.clientX - rect.left;
        const ry = e.clientY - rect.top;
        const id = ++rippleCounter.current;
        setRipples((prev) => [...prev, { id, x: rx, y: ry }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 700);
      }
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // --- Pricing ---
  const bookPrice = 12.99;
  const clockBasePrice = 25.0;
  const craftFee = 15.0;
  const styleModifier = selectedStyle.priceModifier;
  const totalPrice = bookPrice + clockBasePrice + craftFee + styleModifier;

  // --- Mini hand preview for style cards ---
  const HandPreview = ({ style, active }: { style: ClockHandStyle; active: boolean }) => (
    <svg viewBox="-16 -50 32 60" className="w-full h-full">
      <g transform="rotate(-35)" opacity={active ? 1 : 0.6}>
        <path d={style.hourHandPath} fill={active ? "#C5A572" : "#666"} transform="scale(0.85)" />
      </g>
      <g transform="rotate(60)" opacity={active ? 1 : 0.6}>
        <path d={style.minuteHandPath} fill={active ? "#C5A572" : "#666"} transform="scale(0.85)" />
      </g>
      <circle r="2.5" fill={active ? "#C5A572" : "#666"} />
    </svg>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <p className="text-sm text-charcoal/50 mb-1">
          <span className="hover:text-gold-dark cursor-pointer">Home</span>
          {" / "}
          <span className="hover:text-gold-dark cursor-pointer">Search</span>
          {" / "}
          <span className="text-charcoal/70">Configure</span>
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal">
          Design Your Clock
        </h1>
        {bookTitle !== "Selected Book" && (
          <p className="text-sm text-charcoal/60 mt-1">
            {bookTitle}
            {bookAuthor ? ` by ${bookAuthor}` : ""}
          </p>
        )}
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ====== LEFT: Book cover with clock overlay ====== */}
          <div className="lg:w-[60%] flex-shrink-0">
            <div
              ref={containerRef}
              className="relative bg-warm-gray rounded-xl overflow-hidden cursor-crosshair select-none shadow-lg"
              style={{ touchAction: "none" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Book cover image */}
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={bookTitle}
                  className="w-full h-auto block"
                  draggable={false}
                  onLoad={() => setCoverLoaded(true)}
                  onError={() => setCoverLoaded(true)}
                />
              ) : (
                <div className="w-full aspect-[2/3] flex items-center justify-center">
                  <div className="text-center text-charcoal/40">
                    <svg
                      className="mx-auto mb-3 w-16 h-16 opacity-30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p className="text-sm">No cover image</p>
                    <p className="text-xs mt-1">Click anywhere to position the clock</p>
                  </div>
                </div>
              )}

              {/* Click ripple effects */}
              {ripples.map((r) => (
                <span
                  key={r.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: 0,
                    height: 0,
                    transform: "translate(-50%, -50%)",
                    border: "2px solid rgba(197, 165, 114, 0.6)",
                    animation: "ripple-expand 0.7s ease-out forwards",
                  }}
                />
              ))}

              {/* Position crosshair hint */}
              {containerDims.w > 0 && (
                <div
                  className="absolute w-3 h-3 border-2 border-gold/40 rounded-full pointer-events-none transition-all duration-150 ease-out"
                  style={{
                    left: `${centerX * 100}%`,
                    top: `${centerY * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}

              {/* Clock overlay */}
              {containerDims.w > 0 && (
                <ClockOverlay
                  centerX={centerX}
                  centerY={centerY}
                  handStyle={selectedStyle}
                  handColor={selectedColor}
                  handSize={selectedSize.scale}
                  markerStyle={markerStyle}
                  containerWidth={containerDims.w}
                  containerHeight={containerDims.h}
                />
              )}
            </div>

            <p className="text-xs text-charcoal/40 mt-3 text-center">
              Click or drag on the cover to position the clock centre
            </p>
          </div>

          {/* ====== RIGHT: Controls panel ====== */}
          <div className="lg:w-[40%] flex flex-col gap-6">
            {/* Hand Style */}
            <section>
              <h3 className="font-serif text-lg text-charcoal mb-3">Hand Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {CLOCK_HAND_STYLES.map((style) => {
                  const active = selectedStyle.id === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`relative rounded-lg border-2 p-3 transition-all duration-200 ${
                        active
                          ? "border-gold bg-gold/5 shadow-sm"
                          : "border-warm-gray hover:border-gold/40 bg-white"
                      }`}
                    >
                      <div className="w-full h-16 mb-2">
                        <HandPreview style={style} active={active} />
                      </div>
                      <p
                        className={`text-xs font-medium text-center ${
                          active ? "text-gold-dark" : "text-charcoal/60"
                        }`}
                      >
                        {style.name}
                      </p>
                      {style.priceModifier > 0 && (
                        <span className="absolute top-1.5 right-1.5 text-[10px] text-gold-dark bg-gold/10 px-1.5 py-0.5 rounded-full">
                          +&pound;{style.priceModifier}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Hand Colour */}
            <section>
              <h3 className="font-serif text-lg text-charcoal mb-3">Hand Colour</h3>
              <div className="flex gap-3">
                {HAND_COLORS.map((colour) => {
                  const active = selectedColor === colour.hex;
                  return (
                    <button
                      key={colour.id}
                      onClick={() => setSelectedColor(colour.hex)}
                      className={`group flex flex-col items-center gap-1.5`}
                      title={colour.name}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                          active
                            ? "border-gold scale-110 shadow-md"
                            : "border-warm-gray group-hover:border-gold/40"
                        }`}
                        style={{
                          backgroundColor: colour.hex,
                          boxShadow:
                            colour.hex === "#F5F5F5"
                              ? "inset 0 0 0 1px #ddd"
                              : undefined,
                        }}
                      />
                      <span
                        className={`text-[10px] ${
                          active ? "text-gold-dark font-medium" : "text-charcoal/50"
                        }`}
                      >
                        {colour.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Hand Size */}
            <section>
              <h3 className="font-serif text-lg text-charcoal mb-3">Hand Size</h3>
              <div className="flex gap-2">
                {HAND_SIZES.map((size) => {
                  const active = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                        active
                          ? "border-gold bg-gold/5 text-gold-dark"
                          : "border-warm-gray text-charcoal/60 hover:border-gold/40 bg-white"
                      }`}
                    >
                      {size.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Number Markers */}
            <section>
              <h3 className="font-serif text-lg text-charcoal mb-3">Number Markers</h3>
              <div className="flex gap-2">
                {MARKER_STYLES.map((ms) => {
                  const active = markerStyle === ms.id;
                  return (
                    <button
                      key={ms.id}
                      onClick={() => setMarkerStyle(ms.id)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                        active
                          ? "border-gold bg-gold/5 text-gold-dark"
                          : "border-warm-gray text-charcoal/60 hover:border-gold/40 bg-white"
                      }`}
                    >
                      {ms.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Divider */}
            <hr className="border-warm-gray" />

            {/* Price breakdown */}
            <section>
              <h3 className="font-serif text-lg text-charcoal mb-3">Price</h3>
              <div className="bg-white rounded-xl border border-warm-gray p-4 space-y-2">
                <div className="flex justify-between text-sm text-charcoal/70">
                  <span>Book</span>
                  <span>&pound;{bookPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-charcoal/70">
                  <span>
                    Clock mechanism
                    {styleModifier > 0 && (
                      <span className="text-gold-dark ml-1">
                        (+&pound;{styleModifier} {selectedStyle.name})
                      </span>
                    )}
                  </span>
                  <span>&pound;{(clockBasePrice + styleModifier).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-charcoal/70">
                  <span>Handcrafting</span>
                  <span>&pound;{craftFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-warm-gray pt-2 mt-2 flex justify-between font-medium text-charcoal">
                  <span>Total</span>
                  <span className="text-lg font-serif">&pound;{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Add to Cart */}
            <button className="w-full py-4 rounded-xl bg-gold text-white font-medium text-base tracking-wide hover:bg-gold-dark active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg">
              Add to Cart &mdash; &pound;{totalPrice.toFixed(2)}
            </button>

            {/* Personalisation banner */}
            {(giverName || recipientName) && (
              <div className="bg-sage/10 border border-sage/20 rounded-xl p-4 text-center">
                <p className="text-sm text-charcoal/70 italic">
                  A Book Clock of{" "}
                  <span className="font-medium text-charcoal not-italic">
                    {bookTitle}
                  </span>
                  {giverName && (
                    <>
                      {" "}&mdash; a gift from{" "}
                      <span className="font-medium text-charcoal not-italic">
                        {giverName}
                      </span>
                    </>
                  )}
                  {recipientName && (
                    <>
                      {" "}to{" "}
                      <span className="font-medium text-charcoal not-italic">
                        {recipientName}
                      </span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ripple keyframes (injected inline) */}
      <style>{`
        @keyframes ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 80px;
            height: 80px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper with Suspense boundary                               */
/* ------------------------------------------------------------------ */
export default function ConfigurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-charcoal/40 text-sm">Loading configurator...</div>
        </div>
      }
    >
      <ConfiguratorInner />
    </Suspense>
  );
}
