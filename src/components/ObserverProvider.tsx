"use client";
import { Observer } from "tailwindcss-intersect";
import { useEffect } from "react";

// ObserverProvider inizializza l'Intersection Observer per le utility Tailwind CSS
export default function ObserverProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Avvia l'observer quando il componente viene montato
    useEffect(() => {
        Observer.start();
    }, []);

    // Renderizza i children così come sono
    return <>{children}</>;
}