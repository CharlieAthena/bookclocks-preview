"use client";

interface PriceBreakdownProps {
  bookPrice?: number;
  handStyle: string;
  handSize: "small" | "medium" | "large";
  shippingZone?: "uk" | "eu" | "row";
}

const PREMIUM_STYLES = ["Cathedral", "Serpentine"];

function getClockKitPrice(handStyle: string): number {
  return PREMIUM_STYLES.includes(handStyle) ? 12.99 : 8.99;
}

const CRAFTSMANSHIP_FEE = 22.0;

function getShippingPrice(zone: "uk" | "eu" | "row"): number {
  if (zone === "eu") return 9.99;
  if (zone === "row") return 14.99;
  return 0;
}

function getShippingLabel(zone: "uk" | "eu" | "row"): string {
  if (zone === "eu") return "EU Shipping";
  if (zone === "row") return "International Shipping";
  return "UK Shipping";
}

export function calculateTotal(
  bookPrice: number,
  handStyle: string,
  shippingZone: "uk" | "eu" | "row" = "uk"
): number {
  return (
    bookPrice +
    getClockKitPrice(handStyle) +
    CRAFTSMANSHIP_FEE +
    getShippingPrice(shippingZone)
  );
}

export default function PriceBreakdown({
  bookPrice = 12.99,
  handStyle,
  handSize,
  shippingZone = "uk",
}: PriceBreakdownProps) {
  const clockKitPrice = getClockKitPrice(handStyle);
  const shippingPrice = getShippingPrice(shippingZone);
  const shippingLabel = getShippingLabel(shippingZone);
  const total = bookPrice + clockKitPrice + CRAFTSMANSHIP_FEE + shippingPrice;

  const isPremium = PREMIUM_STYLES.includes(handStyle);

  return (
    <div className="border border-warm-gray bg-white p-6">
      <h3 className="font-serif text-lg mb-5 text-charcoal">Price Breakdown</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal/70">Book</span>
          <span className="text-charcoal font-medium">
            &pound;{bookPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal/70">
            Clock Kit
            {isPremium && (
              <span className="ml-1 text-xs text-gold-dark">(premium)</span>
            )}
          </span>
          <span className="text-charcoal font-medium">
            &pound;{clockKitPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal/70">Craftsmanship</span>
          <span className="text-charcoal font-medium">
            &pound;{CRAFTSMANSHIP_FEE.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal/70">{shippingLabel}</span>
          <span className="text-charcoal font-medium">
            {shippingPrice === 0 ? (
              <span className="text-sage">FREE</span>
            ) : (
              <>&pound;{shippingPrice.toFixed(2)}</>
            )}
          </span>
        </div>

        <div className="border-t border-warm-gray pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-charcoal font-medium">Total</span>
            <span className="font-serif text-xl text-charcoal">
              &pound;{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {handSize && (
        <p className="mt-4 text-xs text-charcoal/40">
          {handSize.charAt(0).toUpperCase() + handSize.slice(1)} hands
          &middot; {handStyle} style
        </p>
      )}
    </div>
  );
}
