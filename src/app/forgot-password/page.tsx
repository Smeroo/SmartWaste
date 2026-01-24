"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  // Stato per memorizzare l'input email dell'utente
  const [email, setEmail] = useState("");
  // Stato per tracciare se il link di reset è stato inviato
  const [sent, setSent] = useState(false);

  // Gestisce l'invio del modulo per il reset della password
  const handleSubmit = async (e: React.FormEvent) => {
    // Previene il comportamento predefinito di invio modulo che causerebbe ricaricamento pagina
    e.preventDefault();

    // Invia richiesta POST all'endpoint API forgot-password
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    // Se la richiesta ha successo, aggiorna lo stato per mostrare messaggio di conferma
    if (res.ok) setSent(true);
  };

  return (
    <div id="forgot-password" className="px-10">
      <section className="w-full min-h-screen flex justify-center items-center pt-28 pb-3">
        <div className="bg-stone-100 rounded-xl shadow-sm max-w-md w-full p-5 sm:p-10 flex flex-col gap-5">
          {/* Titolo */}
          <h1 className="text-center text-xl sm:text-2xl text-balance font-bold sm:mb-5">
            Reset your password
          </h1>
          {/* Mostra messaggio di conferma se l'email è stata inviata, altrimenti mostra il modulo */}
          {sent ? (
            <p className="text-west-side-500 text-center font-medium">
              If your email is correct, a reset link has been sent to your inbox. Please check your email and follow the instructions to reset your password.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="font-medium text-stone-900 pl-1 pb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Aggiorna stato email al cambio input
                  className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                />
              </div>
              {/* Pulsante per inviare il modulo e inviare il link di reset */}
              <button
                type="submit"
                className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-xl border-2 border-west-side-500 text-west-side-500
                hover:bg-west-side-500 hover:text-white
                active:bg-west-side-500 active:text-white
                transition-all duration-150 ease-out active:scale-90 hover:scale-105"
              >
                Send reset link
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
