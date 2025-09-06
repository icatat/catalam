import type { Metadata } from "next";
import { Thasadith } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import { NotificationProvider } from "@/components/NotificationSystem";

const thasadith = Thasadith({
  variable: "--font-thasadith",
  subsets: ["latin"],
  weight: ["400", "700"],
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
        className={`${thasadith.variable} antialiased`}
      >
        <LanguageProvider>
          <MuiThemeProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </MuiThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
