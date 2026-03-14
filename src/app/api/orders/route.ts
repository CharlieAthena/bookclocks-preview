import { NextRequest, NextResponse } from "next/server";

function generateOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `BC-${yy}${mm}${dd}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { book, config, shipping, personalisation } = body;

    if (!book?.title || !shipping?.fullName || !shipping?.email) {
      return NextResponse.json(
        { error: "Missing required fields: book title, full name, and email." },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    // Log order for now — replace with database/Stripe in production
    console.log("--- NEW ORDER ---");
    console.log("Order:", orderNumber);
    console.log("Book:", book.title, "by", book.author);
    console.log("Config:", config);
    console.log("Shipping:", shipping);
    console.log("Personalisation:", personalisation);
    console.log("-----------------");

    return NextResponse.json({
      success: true,
      orderNumber,
      message: "Order received. Your Book Clock is being crafted!",
      estimatedDelivery: "5-8 working days",
      email: shipping.email,
    });
  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json(
      { error: "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}
