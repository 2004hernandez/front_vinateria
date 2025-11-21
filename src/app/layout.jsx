"use client";

import { useEffect, useState } from "react";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import { AuthProvider } from "../context/authContext";
import { LogoProvider } from "../context/LogoContext";
import ConnectionProvider from "./ConnectionProvider";
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

  useEffect(() => {
    console.log("🟢 RootLayout montado — iniciando lógica de conexión y SW");

    // --- Registrar SW ---
    if ("serviceWorker" in navigator) {
      console.log("📦 Intentando registrar Service Worker...");

      navigator.serviceWorker
        .register(`/service-worker.js?v=${Date.now()}`)
        .then((reg) => {
          console.log("✅ Service Worker registrado correctamente:", reg.scope);
        })
        .catch((err) => {
          console.error("❌ Error al registrar el Service Worker:", err);
        });
    } else {
      console.log("⚠️ Este navegador NO soporta Service Workers");
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
            <ConnectionProvider>
            <Navbar />
            {children}
            <Footer />
            </ConnectionProvider>
          </LogoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
