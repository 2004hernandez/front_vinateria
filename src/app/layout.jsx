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
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    console.log("🟢 RootLayout montado");

    // Registrar Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`/service-worker.js?v=${Date.now()}`)
        .then((reg) => console.log("✅ Service Worker registrado:", reg.scope))
        .catch((err) => console.error("❌ Error registrando SW:", err));
    }

    // --- Detector real de conexión ---
    const checkConnection = async () => {
      console.log("🔍 Verificando conexión...");

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
          controller.abort();
          console.warn("⏳ Timeout del fetch → posiblemente sin conexión");
        }, 2000);

        const url = "https://httpbin.org/get?ts=" + Date.now();
        console.log("🌐 Fetch a:", url);

        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          console.error("⚠️ Respuesta recibida pero con error HTTP", res.status);
          setIsOnline(false);
          return;
        }

        console.log("🟢 Conexión OK");
        setIsOnline(true);

      } catch (e) {
        console.error("🔴 Error al verificar conexión:", e);
        setIsOnline(false);
      }
    };

    // Ejecutar una vez al cargar
    checkConnection();

    // Revisar cada 4 segundos
    const interval = setInterval(checkConnection, 4000);

    return () => clearInterval(interval);
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
        {/* 🔴 Banner de internet offline */}
        {!isOnline && (
          <div className="w-full bg-red-600 text-white text-center py-2 fixed top-0 left-0 z-50">
            ⚠️ Sin conexión a internet. Algunos datos pueden no estar actualizados.
          </div>
        )}

        <AuthProvider>
          <LogoProvider>
            <Navbar />

            {/* Ajustar margen si aparece banner */}
            <div className={!isOnline ? "mt-10" : ""}>{children}</div>

            <Footer />
          </LogoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
