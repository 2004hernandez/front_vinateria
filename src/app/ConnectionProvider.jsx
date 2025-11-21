"use client";

import { useState, useEffect } from "react";

export default function ConnectionProvider({ children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    console.log("🔥 ConnectionProvider montado");

    function handleOffline() {
      console.log("🔴 Sin conexión");
      setIsOffline(true);
    }

    function handleOnline() {
      console.log("🟢 Con conexión");
      setIsOffline(false);
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
