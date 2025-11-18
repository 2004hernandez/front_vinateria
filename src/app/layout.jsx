"use client";

import { useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("✅ Service Worker registrado con éxito:", registration.scope);
          })
          .catch((error) => {
            console.error("❌ Error al registrar el Service Worker:", error);
          });
      });
    } else {
      console.warn("⚠️ Service Worker no soportado en este navegador.");
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
