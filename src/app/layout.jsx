"use client";

import { useEffect, useState } from "react";
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
  // 🔴 Estado de conexión
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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

    // --- Eventos conexión ---
    function handleOffline() {
      console.log("🔴 El dispositivo perdió la conexión a internet");
      setIsOffline(true);
    }

    function handleOnline() {
      console.log("🟢 El dispositivo recuperó la conexión a internet");
      setIsOffline(false);
    }

    console.log("📡 Añadiendo listeners de conexión...");
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Cleanup
    return () => {
      console.log("♻️ Limpiando listeners de conexión...");
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
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

            {/* 🔥 Notificación flotante sin conexión */}
            {isOffline && (
              <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-3 rounded-xl shadow-xl z-[9999] animate-pulse">
                🔴 Sin conexión — revisa tu internet
              </div>
            )}

            {children}
            <Footer />
          </LogoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
