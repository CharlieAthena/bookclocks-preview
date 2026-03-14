"use client";

import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ClockOverlay from "@/components/ClockOverlay";
import {
  HAND_STYLES,
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
/*  Mini preview card — renders book + clock overlay at small size     */
/* ------------------------------------------------------------------ */
function MiniPreview({
  coverUrl,
  centerX,
  centerY,
  handStyle,
  handColor,
  handSize,
  markerStyle,
  markerRadiusFactor = 1.55,
  label,
  onClick,
}: {
  coverUrl: string;
  centerX: number;
  centerY: number;
  handStyle: ClockHandStyle;
  handColor: string;
  handSize: number;
  markerStyle: MarkerStyle;
  markerRadiusFactor?: number;
  label: string;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        setDims({ w: r.width, h: r.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 text-left"
    >
      <div
        ref={ref}
        className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 border-transparent group-hover:border-gold/40 transition-all bg-[#e8e6e0]"
      >
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        )}
        {dims.w > 0 && (
          <ClockOverlay
            centerX={centerX}
            centerY={centerY}
            handStyle={handStyle}
            handColor={handColor}
            handSize={handSize}
            markerStyle={markerStyle}
            containerWidth={dims.w}
            containerHeight={dims.h}
            markerRadiusFactor={markerRadiusFactor}
          />
        )}
      </div>
      <span className="text-xs text-charcoal/50 group-hover:text-charcoal/70 transition-colors text-center leading-tight">
        {label}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Fullscreen preview modal                                          */
/* ------------------------------------------------------------------ */
function FullscreenPreview({
  coverUrl,
  bookTitle,
  centerX,
  centerY,
  handStyle,
  handColor,
  handSize,
  markerStyle,
  markerRadiusFactor = 1.55,
  giverName,
  recipientName,
  onClose,
  onUpdatePosition,
}: {
  coverUrl: string;
  bookTitle: string;
  centerX: number;
  centerY: number;
  handStyle: ClockHandStyle;
  handColor: string;
  handSize: number;
  markerStyle: MarkerStyle;
  markerRadiusFactor?: number;
  giverName: string;
  recipientName: string;
  onClose: () => void;
  onUpdatePosition: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setDims({ w: r.width, h: r.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    onUpdatePosition(x, y);
  };

  const personalisation =
    giverName || recipientName
      ? `A Book Clock of ${bookTitle}${recipientName ? ` for ${recipientName}` : ""}${giverName ? ` from ${giverName}` : ""}`
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Close preview"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="4" x2="16" y2="16" />
          <line x1="16" y1="4" x2="4" y2="16" />
        </svg>
      </button>

      <div className="flex flex-col items-center gap-4 max-h-[90vh] max-w-[90vw]">
        {/* Book + overlay */}
        <div
          ref={containerRef}
          className="relative cursor-crosshair rounded-lg overflow-hidden shadow-2xl"
          style={{ maxHeight: "78vh" }}
          onClick={handleClick}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={bookTitle}
              className="h-full max-h-[78vh] w-auto object-contain block"
              draggable={false}
              onLoad={() => {
                if (containerRef.current) {
                  const r = containerRef.current.getBoundingClientRect();
                  setDims({ w: r.width, h: r.height });
                }
              }}
            />
          ) : (
            <div className="w-[400px] h-[600px] bg-[#e8e6e0] flex items-center justify-center text-charcoal/40 text-sm">
              No cover image
            </div>
          )}
          {dims.w > 0 && (
            <ClockOverlay
              centerX={centerX}
              centerY={centerY}
              handStyle={handStyle}
              handColor={handColor}
              handSize={handSize}
              markerStyle={markerStyle}
              containerWidth={dims.w}
              containerHeight={dims.h}
              markerRadiusFactor={markerRadiusFactor}
            />
          )}
        </div>

        {/* Personalisation text */}
        {personalisation && (
          <p className="text-white/70 text-sm italic text-center max-w-md">
            {personalisation}
          </p>
        )}

        <p className="text-white/40 text-xs">
          Click on the cover to reposition &middot; Press Esc to close
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inner component that uses useSearchParams (needs Suspense)        */
/* ------------------------------------------------------------------ */
function ConfiguratorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookTitle = searchParams.get("title") || "Selected Book";
  const bookAuthor = searchParams.get("author") || "";
  const coverUrl = searchParams.get("cover") || "";
  const giverName = searchParams.get("giver") || "";
  const recipientName = searchParams.get("recipient") || "";

  // --- State ---
  const [centerX, setCenterX] = useState(0.5);
  const [centerY, setCenterY] = useState(0.4);
  const [selectedStyle, setSelectedStyle] = useState<ClockHandStyle>(HAND_STYLES[0]);
  const [selectedColor, setSelectedColor] = useState(HAND_COLORS[0].hex);
  const [selectedSize, setSelectedSize] = useState(HAND_SIZES[1]); // medium
  const [markerStyle, setMarkerStyle] = useState<MarkerStyle>("none");
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [containerDims, setContainerDims] = useState({ w: 0, h: 0 });
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [bookType, setBookType] = useState<"hardback" | "paperback">("hardback");
  const [markerRadius, setMarkerRadius] = useState(1.55); // multiplier for marker circle radius
  const [showRender, setShowRender] = useState(false);

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
  const bookPrice = bookType === "paperback" ? 9.99 : 12.99;
  const clockBasePrice = 25.0;
  const craftFee = 15.0;
  const styleModifier = selectedStyle.priceModifier;
  const totalPrice = bookPrice + clockBasePrice + craftFee + styleModifier;

  // When switching to paperback, if Large is selected, downgrade to Medium
  const effectiveSize = bookType === "paperback" && selectedSize.id === "large"
    ? HAND_SIZES[1] // medium
    : selectedSize;

  // --- Add to Cart ---
  const handleAddToCart = () => {
    const config = {
      bookTitle,
      bookAuthor,
      coverUrl,
      giverName,
      recipientName,
      handStyle: selectedStyle.id,
      handStyleName: selectedStyle.name,
      handColor: selectedColor,
      handColorName: HAND_COLORS.find((c) => c.hex === selectedColor)?.name || "",
      bookType,
      handSize: effectiveSize.id,
      handSizeScale: effectiveSize.scale,
      markerStyle,
      centerX,
      centerY,
      price: totalPrice,
      priceBreakdown: {
        book: bookPrice,
        clockMechanism: clockBasePrice + styleModifier,
        handcrafting: craftFee,
      },
      addedAt: new Date().toISOString(),
    };
    localStorage.setItem("bookClockCart", JSON.stringify(config));
    router.push("/checkout");
  };

  // --- Variation previews ---
  const nextStyleIndex = (HAND_STYLES.findIndex((s) => s.id === selectedStyle.id) + 1) % HAND_STYLES.length;
  const nextStyle = HAND_STYLES[nextStyleIndex];

  // Find a gold/brass variant colour
  const goldColor = HAND_COLORS.find((c) => c.id === "gold")?.hex || "#C5A572";
  const altColor = selectedColor === goldColor
    ? (HAND_COLORS.find((c) => c.id === "brass")?.hex || "#B5893B")
    : goldColor;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <p className="text-sm text-[#2D2D2D]/50 mb-1">
          <Link href="/" className="hover:text-[#C5A572] transition-colors">Home</Link>
          {" / "}
          <Link href="/search" className="hover:text-[#C5A572] transition-colors">Search</Link>
          {" / "}
          <span className="text-[#2D2D2D]/70">Configure</span>
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#2D2D2D]">
          Design Your Clock
        </h1>
        {bookTitle !== "Selected Book" && (
          <p className="text-sm text-[#2D2D2D]/60 mt-1">
            {bookTitle}
            {bookAuthor ? ` by ${bookAuthor}` : ""}
          </p>
        )}
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ====== LEFT: Book cover with clock overlay ====== */}
          <div className="lg:w-[60%] flex-shrink-0">
            <div
              ref={containerRef}
              className="relative bg-[#e8e6e0] rounded-xl overflow-hidden cursor-crosshair select-none shadow-lg"
              style={{ touchAction: "none" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
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
                  <div className="text-center text-[#2D2D2D]/40">
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
                  className="absolute w-3 h-3 border-2 border-[#C5A572]/40 rounded-full pointer-events-none transition-all duration-150 ease-out"
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
                  handSize={effectiveSize.scale}
                  markerStyle={markerStyle}
                  containerWidth={containerDims.w}
                  containerHeight={containerDims.h}
                  markerRadiusFactor={markerRadius}
                />
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-[#2D2D2D]/40">
                Click or drag on the cover to position the clock centre
              </p>
              <button
                onClick={() => setShowFullscreen(true)}
                className="text-xs text-[#C5A572] hover:text-[#a88a57] transition-colors flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4" />
                </svg>
                View Full Size
              </button>
            </div>
          </div>

          {/* ====== RIGHT: Controls panel ====== */}
          <div className="lg:w-[40%] flex flex-col gap-6">
            {/* Book Type Toggle */}
            <section>
              <h3 className="font-serif text-lg text-[#2D2D2D] mb-3">Book Type</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setBookType("hardback")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                    bookType === "hardback"
                      ? "border-[#C5A572] bg-[#C5A572]/5 text-[#a88a57]"
                      : "border-[#e8e6e0] text-[#2D2D2D]/60 hover:border-[#C5A572]/40 bg-white"
                  }`}
                >
                  Hardback
                </button>
                <button
                  onClick={() => {
                    setBookType("paperback");
                    // Downgrade hand size if Large is selected
                    if (selectedSize.id === "large") {
                      setSelectedSize(HAND_SIZES[1]);
                    }
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                    bookType === "paperback"
                      ? "border-[#C5A572] bg-[#C5A572]/5 text-[#a88a57]"
                      : "border-[#e8e6e0] text-[#2D2D2D]/60 hover:border-[#C5A572]/40 bg-white"
                  }`}
                >
                  Paperback
                </button>
              </div>
              {bookType === "hardback" && (
                <p className="text-xs text-[#2D2D2D]/50 mt-2">
                  Typical size: ~15cm &times; 23cm &times; 2.5cm
                </p>
              )}
              {bookType === "paperback" && (
                <p className="text-xs text-[#C5A572] mt-2">
                  Paperback books may not support larger clock mechanisms. We recommend Small or Medium hands.
                </p>
              )}
            </section>

            {/* Hand Style — product photos */}
            <section>
              <h3 className="font-serif text-lg text-[#2D2D2D] mb-3">Hand Style</h3>
              <div className="grid grid-cols-4 gap-2.5">
                {HAND_STYLES.map((style) => {
                  const active = selectedStyle.id === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`relative rounded-lg border-2 p-2 transition-all duration-200 ${
                        active
                          ? "border-[#C5A572] bg-[#C5A572]/5 shadow-sm"
                          : "border-[#e8e6e0] hover:border-[#C5A572]/40 bg-white"
                      }`}
                    >
                      {/* Product photo */}
                      <div className="w-full aspect-square mb-1.5 flex items-center justify-center bg-[#FDFBF7] rounded overflow-hidden">
                        <img
                          src={style.productImage}
                          alt={style.name}
                          className="w-full h-full object-contain p-1"
                          draggable={false}
                          onError={(e) => {
                            // Fallback: hide broken image, show SVG preview
                            (e.target as HTMLImageElement).style.display = "none";
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) parent.classList.add("fallback-svg");
                          }}
                        />
                        {/* SVG fallback rendered behind the img */}
                        <svg viewBox="-16 -50 32 60" className="absolute w-8 h-10 opacity-0 pointer-events-none" aria-hidden>
                          <g transform="rotate(-35)" opacity={active ? 1 : 0.6}>
                            <path d={style.hourHandPath} fill={active ? "#C5A572" : "#666"} transform="scale(0.85)" />
                          </g>
                          <g transform="rotate(60)" opacity={active ? 1 : 0.6}>
                            <path d={style.minuteHandPath} fill={active ? "#C5A572" : "#666"} transform="scale(0.85)" />
                          </g>
                          <circle r="2.5" fill={active ? "#C5A572" : "#666"} />
                        </svg>
                      </div>
                      <p
                        className={`text-[11px] font-medium text-center leading-tight ${
                          active ? "text-[#a88a57]" : "text-[#2D2D2D]/60"
                        }`}
                      >
                        {style.name}
                      </p>
                      {/* Colour variant dots */}
                      {Object.keys(style.variants).length > 1 && (
                        <div className="flex justify-center gap-1 mt-1">
                          {Object.keys(style.variants).map((v) => {
                            const dotColor =
                              v === "black" ? "#1a1a1a" :
                              v === "gold" ? "#C5A572" :
                              v === "silver" ? "#C0C0C0" :
                              v === "brass" ? "#B5893B" : "#888";
                            return (
                              <span
                                key={v}
                                className="w-2.5 h-2.5 rounded-full border border-black/10"
                                style={{ backgroundColor: dotColor }}
                              />
                            );
                          })}
                        </div>
                      )}
                      {style.priceModifier > 0 && (
                        <span className="absolute top-1 right-1 text-[9px] text-[#a88a57] bg-[#C5A572]/10 px-1 py-0.5 rounded-full leading-none">
                          +&pound;{style.priceModifier}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Selected style description */}
              <p className="text-xs text-[#2D2D2D]/50 mt-2 italic">
                {selectedStyle.description}
              </p>
            </section>

            {/* Hand Colour */}
            <section>
              <h3 className="font-serif text-lg text-[#2D2D2D] mb-3">Hand Colour</h3>
              <div className="flex gap-3">
                {HAND_COLORS.map((colour) => {
                  const active = selectedColor === colour.hex;
                  return (
                    <button
                      key={colour.id}
                      onClick={() => setSelectedColor(colour.hex)}
                      className="group flex flex-col items-center gap-1.5"
                      title={colour.name}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                          active
                            ? "border-[#C5A572] scale-110 shadow-md"
                            : "border-[#e8e6e0] group-hover:border-[#C5A572]/40"
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
                          active ? "text-[#a88a57] font-medium" : "text-[#2D2D2D]/50"
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
              <h3 className="font-serif text-lg text-[#2D2D2D] mb-3">Hand Size</h3>
              <div className="flex gap-2">
                {HAND_SIZES.map((size) => {
                  const active = selectedSize.id === size.id;
                  const disabled = bookType === "paperback" && size.id === "large";
                  return (
                    <button
                      key={size.id}
                      onClick={() => !disabled && setSelectedSize(size)}
                      disabled={disabled}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                        disabled
                          ? "border-[#e8e6e0] text-[#2D2D2D]/20 bg-[#f5f5f5] cursor-not-allowed"
                          : active
                            ? "border-[#C5A572] bg-[#C5A572]/5 text-[#a88a57]"
                            : "border-[#e8e6e0] text-[#2D2D2D]/60 hover:border-[#C5A572]/40 bg-white"
                      }`}
                    >
                      {size.name}
                      {disabled && <span className="block text-[9px] text-[#2D2D2D]/30 mt-0.5">N/A for paperback</span>}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Number Markers */}
            <section>
              <h3 className="font-serif text-lg text-[#2D2D2D] mb-3">Number Markers</h3>
              <div className="flex gap-2">
                {MARKER_STYLES.map((ms) => {
                  const active = markerStyle === ms.id;
                  return (
                    <button
                      key={ms.id}
                      onClick={() => setMarkerStyle(ms.id)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                        active
                          ? "border-[#C5A572] bg-[#C5A572]/5 text-[#a88a57]"
                          : "border-[#e8e6e0] text-[#2D2D2D]/60 hover:border-[#C5A572]/40 bg-white"
                      }`}
                    >
                      {ms.name}
                    </button>
                  );
                })}
              </div>

              {/* Marker circle radius slider — only show when markers are active */}
              {markerStyle !== "none" && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-[#2D2D2D]/60">Marker circle size</label>
                    <span className="text-xs text-[#C5A572] font-medium tabular-nums">
                      {Math.round(markerRadius * 100 / 1.55)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.8}
                    max={2.5}
                    step={0.05}
                    value={markerRadius}
                    onChange={(e) => setMarkerRadius(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #C5A572 ${((markerRadius - 0.8) / 1.7) * 100}%, #e8e6e0 ${((markerRadius - 0.8) / 1.7) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-[#2D2D2D]/30 mt-1">
                    <span>Tight</span>
                    <span>Wide</span>
                  </div>
                  <p className="text-[10px] text-[#2D2D2D]/40 mt-1 italic">
                    Purely decorative — adjust to fit the cover design
                  </p>
                </div>
              )}
            </section>

            {/* Divider */}
            <hr className="border-[#e8e6e0]" />

            {/* Price breakdown */}
            <section>
              <h3 className="font-serif text-lg text-[#2D2D2D] mb-3">Price</h3>
              <div className="bg-white rounded-xl border border-[#e8e6e0] p-4 space-y-2">
                <div className="flex justify-between text-sm text-[#2D2D2D]/70">
                  <span>Book ({bookType})</span>
                  <span>&pound;{bookPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#2D2D2D]/70">
                  <span>
                    Clock mechanism
                    {styleModifier > 0 && (
                      <span className="text-[#a88a57] ml-1">
                        (+&pound;{styleModifier} {selectedStyle.name})
                      </span>
                    )}
                  </span>
                  <span>&pound;{(clockBasePrice + styleModifier).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#2D2D2D]/70">
                  <span>Handcrafting</span>
                  <span>&pound;{craftFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#e8e6e0] pt-2 mt-2 flex justify-between font-medium text-[#2D2D2D]">
                  <span>Total</span>
                  <span className="text-lg font-serif">&pound;{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Render & Buy buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRender(true)}
                className="flex-1 py-4 rounded-xl bg-[#2D2D2D] text-white font-medium text-base tracking-wide hover:bg-[#1a1a1a] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                Visualise
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 rounded-xl bg-[#C5A572] text-white font-medium text-base tracking-wide hover:bg-[#a88a57] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Buy &mdash; &pound;{totalPrice.toFixed(2)}
              </button>
            </div>

            {/* Personalisation banner */}
            {(giverName || recipientName) && (
              <div className="bg-[#8B9E7E]/10 border border-[#8B9E7E]/20 rounded-xl p-4 text-center">
                <p className="text-sm text-[#2D2D2D]/70 italic">
                  A Book Clock of{" "}
                  <span className="font-medium text-[#2D2D2D] not-italic">
                    {bookTitle}
                  </span>
                  {giverName && (
                    <>
                      {" "}&mdash; a gift from{" "}
                      <span className="font-medium text-[#2D2D2D] not-italic">
                        {giverName}
                      </span>
                    </>
                  )}
                  {recipientName && (
                    <>
                      {" "}to{" "}
                      <span className="font-medium text-[#2D2D2D] not-italic">
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

      {/* ====== Variation Previews Section ====== */}
      {coverUrl && (
        <div className="bg-[#f3f1eb] border-t border-[#e8e6e0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <h3 className="font-serif text-lg text-[#2D2D2D]/70 mb-5">
              Other variations you might like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
              {/* 1. Current selection */}
              <MiniPreview
                coverUrl={coverUrl}
                centerX={centerX}
                centerY={centerY}
                handStyle={selectedStyle}
                handColor={selectedColor}
                handSize={effectiveSize.scale}
                markerStyle={markerStyle}
                label="Your Design"
                onClick={() => {}}
              />

              {/* 2. Next hand style */}
              <MiniPreview
                coverUrl={coverUrl}
                centerX={centerX}
                centerY={centerY}
                handStyle={nextStyle}
                handColor={selectedColor}
                handSize={effectiveSize.scale}
                markerStyle={markerStyle}
                label={`Try ${nextStyle.name}`}
                onClick={() => setSelectedStyle(nextStyle)}
              />

              {/* 3. Gold/brass variant */}
              <MiniPreview
                coverUrl={coverUrl}
                centerX={centerX}
                centerY={centerY}
                handStyle={selectedStyle}
                handColor={altColor}
                handSize={effectiveSize.scale}
                markerStyle={markerStyle}
                label={altColor === goldColor ? "In Gold" : "In Brass"}
                onClick={() => setSelectedColor(altColor)}
              />

              {/* 4. With roman numerals */}
              <MiniPreview
                coverUrl={coverUrl}
                centerX={centerX}
                centerY={centerY}
                handStyle={selectedStyle}
                handColor={selectedColor}
                handSize={effectiveSize.scale}
                markerStyle="roman"
                label="With Numerals"
                onClick={() => setMarkerStyle("roman")}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen preview modal */}
      {showFullscreen && (
        <FullscreenPreview
          coverUrl={coverUrl}
          bookTitle={bookTitle}
          centerX={centerX}
          centerY={centerY}
          handStyle={selectedStyle}
          handColor={selectedColor}
          handSize={effectiveSize.scale}
          markerStyle={markerStyle}
          markerRadiusFactor={markerRadius}
          giverName={giverName}
          recipientName={recipientName}
          onClose={() => setShowFullscreen(false)}
          onUpdatePosition={(x, y) => {
            setCenterX(x);
            setCenterY(y);
          }}
        />
      )}

      {/* Render / Visualise modal */}
      {showRender && coverUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowRender(false);
          }}
        >
          <button
            onClick={() => setShowRender(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>

          <div className="max-w-5xl w-full mx-4 my-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl text-white mb-2">Your Book Clock</h2>
              <p className="text-white/50 text-sm">
                {bookTitle}{bookAuthor ? ` by ${bookAuthor}` : ""} &middot; {selectedStyle.name} hands in {HAND_COLORS.find(c => c.hex === selectedColor)?.name || ""}
              </p>
            </div>

            {/* Product shots grid — simulated render views */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Shot 1: Front-on hero shot */}
              <div className="bg-[#f5f3ef] rounded-xl p-8 flex flex-col items-center">
                <div className="relative w-full max-w-[220px] mx-auto">
                  <img src={coverUrl} alt={bookTitle} className="w-full rounded shadow-xl" draggable={false} />
                  <svg
                    width="100%" height="100%"
                    viewBox={`0 0 220 330`}
                    className="absolute inset-0 pointer-events-none"
                    style={{ overflow: "visible" }}
                  >
                    <defs>
                      <filter id="renderShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0.5" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.3" />
                      </filter>
                    </defs>
                    <g transform={`translate(${centerX * 220}, ${centerY * 330}) rotate(305) scale(0.55)`}>
                      <path d={selectedStyle.hourHandPath} fill={selectedColor} filter="url(#renderShadow)" />
                    </g>
                    <g transform={`translate(${centerX * 220}, ${centerY * 330}) rotate(60) scale(0.55)`}>
                      <path d={selectedStyle.minuteHandPath} fill={selectedColor} filter="url(#renderShadow)" />
                    </g>
                    <circle cx={centerX * 220} cy={centerY * 330} r={3} fill="#B5893B" stroke="#8B6914" strokeWidth={0.5} />
                  </svg>
                </div>
                <p className="text-xs text-[#2D2D2D]/50 mt-4 font-medium">Front View</p>
              </div>

              {/* Shot 2: Angled perspective */}
              <div className="bg-[#f5f3ef] rounded-xl p-8 flex flex-col items-center">
                <div className="relative w-full max-w-[220px] mx-auto" style={{ perspective: "800px" }}>
                  <div style={{ transform: "rotateY(-15deg) rotateX(5deg)" }}>
                    <img src={coverUrl} alt={bookTitle} className="w-full rounded shadow-xl" draggable={false} />
                    <svg
                      width="100%" height="100%"
                      viewBox={`0 0 220 330`}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <g transform={`translate(${centerX * 220}, ${centerY * 330}) rotate(305) scale(0.55)`}>
                        <path d={selectedStyle.hourHandPath} fill={selectedColor} />
                      </g>
                      <g transform={`translate(${centerX * 220}, ${centerY * 330}) rotate(60) scale(0.55)`}>
                        <path d={selectedStyle.minuteHandPath} fill={selectedColor} />
                      </g>
                      <circle cx={centerX * 220} cy={centerY * 330} r={3} fill="#B5893B" />
                    </svg>
                  </div>
                  {/* Simulated book spine */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#8B7355] to-[#a08868] rounded-l shadow-inner" style={{ transform: "translateX(-22px) rotateY(70deg)", transformOrigin: "right" }} />
                </div>
                <p className="text-xs text-[#2D2D2D]/50 mt-4 font-medium">Angled View</p>
              </div>

              {/* Shot 3: On a shelf / lifestyle context */}
              <div className="bg-gradient-to-b from-[#e8e4dc] to-[#d4cfc5] rounded-xl p-8 flex flex-col items-center justify-end">
                <div className="relative w-full max-w-[180px] mx-auto mb-4">
                  <img src={coverUrl} alt={bookTitle} className="w-full rounded shadow-2xl" draggable={false} />
                  <svg
                    width="100%" height="100%"
                    viewBox={`0 0 180 270`}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <g transform={`translate(${centerX * 180}, ${centerY * 270}) rotate(305) scale(0.45)`}>
                      <path d={selectedStyle.hourHandPath} fill={selectedColor} />
                    </g>
                    <g transform={`translate(${centerX * 180}, ${centerY * 270}) rotate(60) scale(0.45)`}>
                      <path d={selectedStyle.minuteHandPath} fill={selectedColor} />
                    </g>
                    <circle cx={centerX * 180} cy={centerY * 270} r={2.5} fill="#B5893B" />
                  </svg>
                </div>
                {/* Simulated shelf */}
                <div className="w-full h-3 bg-[#8B7355] rounded-sm shadow-md" />
                <p className="text-xs text-[#2D2D2D]/50 mt-4 font-medium">On a Shelf</p>
              </div>

              {/* Shot 4: Gift-wrapped context */}
              <div className="bg-[#FDFBF7] rounded-xl p-8 flex flex-col items-center border border-[#e8e6e0]">
                <div className="relative w-full max-w-[200px] mx-auto">
                  <img src={coverUrl} alt={bookTitle} className="w-full rounded shadow-lg" draggable={false} />
                  <svg
                    width="100%" height="100%"
                    viewBox={`0 0 200 300`}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <g transform={`translate(${centerX * 200}, ${centerY * 300}) rotate(305) scale(0.5)`}>
                      <path d={selectedStyle.hourHandPath} fill={selectedColor} />
                    </g>
                    <g transform={`translate(${centerX * 200}, ${centerY * 300}) rotate(60) scale(0.5)`}>
                      <path d={selectedStyle.minuteHandPath} fill={selectedColor} />
                    </g>
                    <circle cx={centerX * 200} cy={centerY * 300} r={2.5} fill="#B5893B" />
                  </svg>
                </div>
                {(giverName || recipientName) && (
                  <p className="text-sm text-[#2D2D2D]/60 mt-4 italic text-center">
                    &ldquo;{recipientName ? `For ${recipientName}` : "A special gift"}{giverName ? `, with love from ${giverName}` : ""}&rdquo;
                  </p>
                )}
                <p className="text-xs text-[#2D2D2D]/50 mt-2 font-medium">Gift Ready</p>
              </div>

              {/* Shot 5: Close-up of mechanism */}
              <div className="bg-[#f5f3ef] rounded-xl p-8 flex flex-col items-center">
                <div className="relative w-full max-w-[220px] mx-auto overflow-hidden rounded-lg">
                  <img
                    src={coverUrl}
                    alt={bookTitle}
                    className="w-full scale-[2] shadow-xl"
                    style={{
                      transformOrigin: `${centerX * 100}% ${centerY * 100}%`,
                    }}
                    draggable={false}
                  />
                  <svg
                    width="100%" height="100%"
                    viewBox={`0 0 220 330`}
                    className="absolute inset-0 pointer-events-none"
                    style={{ transform: "scale(2)", transformOrigin: `${centerX * 100}% ${centerY * 100}%` }}
                  >
                    <g transform={`translate(${centerX * 220}, ${centerY * 330}) rotate(305) scale(0.55)`}>
                      <path d={selectedStyle.hourHandPath} fill={selectedColor} />
                    </g>
                    <g transform={`translate(${centerX * 220}, ${centerY * 330}) rotate(60) scale(0.55)`}>
                      <path d={selectedStyle.minuteHandPath} fill={selectedColor} />
                    </g>
                    <circle cx={centerX * 220} cy={centerY * 330} r={3} fill="#B5893B" stroke="#8B6914" strokeWidth={0.5} />
                  </svg>
                </div>
                <p className="text-xs text-[#2D2D2D]/50 mt-4 font-medium">Detail Close-Up</p>
              </div>

              {/* Shot 6: Dimensions / specs */}
              <div className="bg-[#2D2D2D] rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="text-white/80 space-y-3">
                  <p className="text-xs text-[#C5A572] uppercase tracking-wider font-medium">Specifications</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-white/40">Style:</span> <span className="text-white">{selectedStyle.name}</span></p>
                    <p><span className="text-white/40">Colour:</span> <span className="text-white">{HAND_COLORS.find(c => c.hex === selectedColor)?.name}</span></p>
                    <p><span className="text-white/40">Size:</span> <span className="text-white">{effectiveSize.name}</span></p>
                    <p><span className="text-white/40">Type:</span> <span className="text-white capitalize">{bookType}</span></p>
                    <p><span className="text-white/40">Movement:</span> <span className="text-white">Silent quartz sweep</span></p>
                    <p><span className="text-white/40">Battery:</span> <span className="text-white">1x AA (included)</span></p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-2xl font-serif text-[#C5A572]">&pound;{totalPrice.toFixed(2)}</p>
                    <p className="text-[10px] text-white/30 mt-1">Free UK shipping</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-white/30 text-[11px] mt-6">
              Renders are for illustration purposes only. The finished product is handcrafted and may vary slightly from the preview.
            </p>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowRender(false)}
                className="px-6 py-3 rounded-xl border border-white/20 text-white/70 text-sm hover:bg-white/5 transition-colors"
              >
                Back to Editor
              </button>
              <button
                onClick={() => { setShowRender(false); handleAddToCart(); }}
                className="px-8 py-3 rounded-xl bg-[#C5A572] text-white font-medium text-sm hover:bg-[#a88a57] transition-colors shadow-lg"
              >
                Buy Now &mdash; &pound;{totalPrice.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ripple keyframes */}
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
        .fallback-svg svg {
          opacity: 0.5 !important;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #C5A572;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #C5A572;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
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
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="text-[#2D2D2D]/40 text-sm">Loading configurator...</div>
        </div>
      }
    >
      <ConfiguratorInner />
    </Suspense>
  );
}
