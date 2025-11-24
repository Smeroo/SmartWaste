"use client";

import { useAuthErrorMessage } from "@/lib/useAuthErrorMessage";
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faEyeSlash, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const errorMessage = useAuthErrorMessage();

  const credentialsAction = (formData: FormData) => {
    signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-28 bg-gradient-to-br from-emerald-500 to-green-700">
      <div className="bg-stone-100 rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-500 p-4 rounded-full mb-4">
            <FontAwesomeIcon icon={faLeaf} className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
            Bentornato su <span className="text-emerald-500">SmartWaste</span>
          </h1>
          <p className="text-stone-600">Accedi al tuo account</p>
        </div>

        {/* Credentials Form */}
        <form action={credentialsAction} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block font-medium text-stone-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 
                       focus:border-emerald-500 focus:outline-none transition text-stone-900"
              placeholder="tua@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-stone-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 
                         focus:border-emerald-500 focus:outline-none transition text-stone-900 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 
                         hover:text-stone-600 transition"
                aria-label={showPassword ? "Nascondi password" : "Mostra password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xl" />
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
            >
              Password dimenticata?
            </Link>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3">
              <p className="text-red-600 text-center font-medium text-sm">
                ⚠️ Credenziali non valide. Riprova.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {/* Signup Button */}
            <Link
              href="/register"
              className="w-full py-4 flex justify-center items-center rounded-2xl 
                       border-2 border-stone-900 text-stone-900 font-bold
                       hover:bg-stone-900 hover:text-stone-100
                       transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
              />
              Registrati
            </Link>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 flex justify-center items-center rounded-2xl 
                       bg-emerald-500 text-white font-bold shadow-lg
                       hover:bg-emerald-600 transition-all duration-300 
                       hover:scale-105 active:scale-95 group"
            >
              Accedi
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-stone-600">
            Non hai un account?{' '}
            <Link href="/register" className="text-emerald-500 font-bold hover:underline">
              Registrati gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}