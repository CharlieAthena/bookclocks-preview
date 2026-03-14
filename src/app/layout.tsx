import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Book Clocks — Turn Their Favourite Book Into a Timeless Gift",
  description:
    "Transform any book into a beautiful, handcrafted clock. The perfect personalised gift for book lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-cream text-charcoal">
        <ClientLayout>
          <main>{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
