"use client";

import { useState, useEffect } from "react";

export default function ConnectionProvider({ children }) {
  const [isOffline, setIsOffline] = useState(null);

  // ✔ No usar Google (CORS bloquea)
  async function checkRealConnection() {
    try {
      await fetch("https://cors.cloudflare.com", { method: "HEAD" });
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    console.log("🔥 ConnectionProvider montado — verificando conexión...");

    checkRealConnection().then((online) => {
      setIsOffline(!online);
      console.log("🌐 Estado inicial real:", online ? "ONLINE" : "OFFLINE");
    });

    function handleOffline() {
      console.log("🔴 Evento: offline");
      setIsOffline(true);
    }

    function handleOnline() {
      console.log("🟢 Evento: online");

      // obligación: verificar inmediatamente
      checkRealConnection().then((online) => {
        setIsOffline(!online);
        console.log("🔄 Verificación tras evento:", online);
      });
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-3 rounded-xl shadow-xl z-[9999] animate-pulse">
          🔴 Sin conexión — revisa tu internet
        </div>
      )}
      {children}
    </>
  );
}
