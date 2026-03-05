import type { Metadata } from "next";
import { Thasadith, Arizonia } from "next/font/google";
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Arizonia&display=swap" rel="stylesheet" />
        <script async src="//www.instagram.com/embed.js"></script>
      </head>
      <body
        className={`${thasadith.variable} ${arizonia.variable} antialiased`}
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
