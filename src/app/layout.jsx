"use client";

import { useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import { AuthProvider } from "../context/authContext";
import { LogoProvider } from "../context/LogoContext";

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

export default function RootLayout({ children }) {
  // 👇 Aquí se mueve toda la lógica del registro del Service Worker
  useEffect(() => {
    console.log("🟢 RootLayout montado");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`/service-worker.js?v=${Date.now()}`) // ← usa tu nombre real
        .then((reg) => {
          console.log("✅ Service Worker registrado:", reg.scope);
        })
        .catch((err) => {
          console.error("❌ Error registrando SW:", err);
        });
    }
  }, []);


  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0057D9" />
        <meta name="application-name" content="Vinatería PWA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vinatería" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LogoProvider>
            <Navbar />
            {children}
            <Footer />
          </LogoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
