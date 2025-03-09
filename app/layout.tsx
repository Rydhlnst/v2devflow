import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local"

export const metadata: Metadata = {
  title: "DevFlow",
  description: "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg"
  }
};

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900"
})

const spacegrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-spacegrotesk",
  weight: "100 200 300 400 500 600 700 800 900"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${spacegrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
