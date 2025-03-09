import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local"
import ThemeProvider from "@/context/Themes";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

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

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body
          className={`${inter.className} ${spacegrotesk.variable} antialiased`}
        >
          <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Toaster/>
        </body>
      </SessionProvider>
    </html>
  );
}

export default Layout;