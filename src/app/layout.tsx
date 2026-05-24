import type { Metadata } from "next";
import { Thasadith, Arizonia, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import { NotificationProvider } from "@/components/NotificationSystem";

const thasadith = Thasadith({
  variable: "--font-thasadith",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const arizonia = Arizonia({
  variable: "--font-arizonia",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Catalina & Lam Wedding",
  description: "Join us for our wedding celebrations in Vietnam and Romania",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="//www.instagram.com/embed.js"></script>
      </head>
      <body
        className={`${thasadith.variable} ${arizonia.variable} ${cormorant.variable} antialiased`}
      >
        <MuiThemeProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
