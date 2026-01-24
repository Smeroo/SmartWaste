import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetError } from "react-hook-form";

// T rappresenta il tipo dei dati del modulo (UserFormValues, OperatorFormValues)
export async function handleFormSubmit<
  T extends Record<string, unknown>
>(params: {
  data: T;
  role: "USER" | "OPERATOR";
  useOAuth: boolean;
  provider?: "google" | "github";
  setError: UseFormSetError<T>;
  router: AppRouterInstance; // istanza router di Next.js, usata per la navigazione e il reindirizzamento
  emailFromProps?: string;
}) {
  // Destruttura i parametri per un accesso più facile (params.data -> data)
  const { data, role, useOAuth, provider, router, emailFromProps } = params;

  const email = useOAuth ? emailFromProps : data.email;

  if (!email) {
    console.error("Email not found.");
    alert("Email is required to complete registration.");
    return;
  }

  const payload = { ...data, email, role };

  try {
    const endpoint = useOAuth ? "/api/complete-registration" : "/api/register";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message || `(${res.status}) Registration failed`);
    }

    // Accedi dopo il completamento della registrazione
    if (useOAuth && provider) {
      await signIn(provider, {
        redirect: true,
        callbackUrl: "/",
        prompt: "none",
      });
    } else {
      // Per la registrazione non OAuth, accedi con le credenziali
      await signIn("credentials", {
        email: data.email as string,
        password: data.password as string,
        redirect: false,
      });
      router.replace("/");
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Email already registered.")) {
        alert("Email already registered. Please try another one.");
      } else if (error.message.includes("Missing")) {
        alert("Please fill in all required fields.");
      } else {
        alert("An error occurred during registration. Please try again.");
      }
    } else {
      alert("An unknown error occurred. Please try again.");
    }
  }
}
