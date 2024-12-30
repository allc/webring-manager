import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@mantine/core/styles.css';

import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import NavBar from "@/components/Navbar";
import UserProvider from "./UserProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Webring Manager",
  description: "Webring Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider>
          <UserProvider>
            <NavBar />
            <Container>
              {children}
            </Container>
          </UserProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
