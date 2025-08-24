import type { Metadata } from "next";
import { Thasadith } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const thasadith = Thasadith({
  variable: "--font-thasadith",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cata & Lam Wedding",
  description: "Join us for our wedding celebrations in Vietnam and Romania",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${thasadith.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
