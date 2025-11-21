"use client";

import { useEffect, useState } from "react";

export default function ConnectionProvider({ children }) {
  const [isOffline, setIsOffline] = useState(false);

  async function checkLocalPing() {
    try {
      const res = await fetch("/ping.json?cacheBust=" + Date.now(), {
        method: "GET",
        cache: "no-store",
      });

      return res.ok; // Si responde → estás online
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    console.log("⚡ Inicializando detector de conexión...");

    const verify = async () => {
      const online = await checkLocalPing();
      console.log("💾 Ping local:", online);
      setIsOffline(!online);
    };

    verify();

    function handleOnline() {
      console.log("🟢 Evento ONLINE del navegador");
      verify();
    }

    function handleOffline() {
      console.log("🔴 Evento OFFLINE del navegador");
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(verify, 5000); // verificación cada 5s

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg z-[9999] animate-pulse">
          🔴 No hay conexión a Internet
        </div>
      )}

      {children}
    </>
  );
}
