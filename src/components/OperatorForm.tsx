import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { operatorRegisterSchema, operatorRegisterSchemaOAuth } from "@/lib/zod";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faCheck,
    faEye,
    faSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { handleFormSubmit } from "@/lib/handleFormSubmit";

// Definisci i tipi per i valori del modulo basati sugli schemi Zod
type OperatorFormValues = z.infer<typeof operatorRegisterSchema>;
type OperatorOAuthFormValues = z.infer<typeof operatorRegisterSchemaOAuth>;

// Definisci le props per il componente OperatorForm
type OperatorFormProps = {
    email?: string;
    requiredFields?: {
        name?: boolean;
        email?: boolean;
        password?: boolean;
    };
    layout?: "row" | "col";
    buttons?: "register" | "confirm";
};

export default function OperatorForm({
    email,
    requiredFields,
    layout = "row",
    buttons = "register",
}: OperatorFormProps) {
    // Stato per commutare la visibilità della password
    const [showPassword, setShowPassword] = useState(false);

    // Ottieni parametri di query dall'URL
    const searchParams = useSearchParams();

    // Determina se OAuth è usato in base ai campi obbligatori
    const useOAuth = !requiredFields?.email && !requiredFields?.password;

    // Ottieni email utente da props o URL
    const userEmail = email ?? decodeURIComponent(searchParams.get("email") ?? "");

    // Inizializza react-hook-form con validazione Zod
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<OperatorFormValues>({
        resolver: zodResolver(
            useOAuth ? operatorRegisterSchemaOAuth : operatorRegisterSchema
        ) as unknown as Resolver<
            typeof useOAuth extends true ? OperatorOAuthFormValues : OperatorFormValues
        >,
    });

    const router = useRouter();

    // Stato per memorizzare il provider OAuth (google o github)
    const [provider, setProvider] = useState<"google" | "github" | undefined>(
        undefined
    );

    // Al montaggio, recupera il provider OAuth da localStorage
    useEffect(() => {
        const savedProvider = localStorage.getItem("oauth_provider");
        if (savedProvider === "google" || savedProvider === "github") {
            setProvider(savedProvider);
        }
    }, []);

    // Gestisci invio modulo
    const onSubmit = (data: OperatorFormValues) =>
        handleFormSubmit({
            data,
            role: "OPERATOR",
            useOAuth,
            provider: provider,
            setError,
            router,
            emailFromProps: userEmail,
        });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-5`}>
            {/* Campi Nome e P.IVA (VAT) */}
            <div className="flex flex-col sm:flex-row gap-5">
                {requiredFields?.name && (
                    <div className="w-full flex flex-col text-sm sm:text-base">
                        <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            id="name"
                            name="name"
                            required
                            pattern="[A-Za-z\s]+"
                            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                            placeholder="Enter operator name"
                        />
                    </div>
                )}

            </div>
            {/* Campi Email e Password, nascosti se il layout è "col" */}
            <div className={`flex flex-col sm:flex-row gap-5 ${layout === "col" ? "hidden" : ""}`}>
                {requiredFields?.email && (
                    <div className="w-full flex flex-col text-sm sm:text-base">
                        <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                            Email
                            {errors.email && (<p className="text-red-500">{errors.email.message}</p>)}
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                            placeholder="Enter operator email"
                        />
                    </div>
                )}
                {requiredFields?.password && (
                    <div className="w-full flex flex-col text-sm sm:text-base">
                        <label className="flex justify-between font-medium pl-1 pb-1 text-stone-900">
                            Password
                            {errors.password && (<p className="text-red-500">{errors.password.message}</p>)}
                        </label>
                        <div className="w-full relative">
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                required
                                className="w-full p-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-west-side-500 bg-stone-50"
                                placeholder="Enter operator password"
                            />
                            {/* Pulsante per commutare visibilità password */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 aspect-square h-full flex items-center text-stone-600 hover:text-stone-700 focus:outline-none">
                                <FontAwesomeIcon icon={faEye} className="fa-stack-1x text-stone-600" />
                                {showPassword
                                    ? <FontAwesomeIcon icon={faSlash} className="fa-stack-1x text-red-500" />
                                    : ""}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Pulsanti azione */}
            <div className="flex gap-5 sm:mt-5">
                {buttons === "register" && (
                    <>
                        {/* Link alla pagina di login */}
                        <Link href={"/login"} className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-xl border-2 border-stone-900 text-stone-900
                                                        hover:bg-stone-900 hover:text-stone-100
                                                        active:bg-stone-900 active:text-stone-100
                                                        transition-all duration-150 ease-out active:scale-90 hover:scale-105 group">
                            <FontAwesomeIcon icon={faArrowLeft} className="text-lg group-hover:-translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-150 group-hover:duration-500" />
                            Login
                            <FontAwesomeIcon icon={faArrowLeft} className="text-lg opacity-0" />
                        </Link>
                        {/* Pulsante di invio per la registrazione */}
                        <button type="submit" className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-xl border-2 border-west-side-500 text-west-side-500 
                                                        hover:bg-west-side-500 hover:text-stone-100
                                                        active:bg-west-side-500 active:text-stone-100
                                                        transition-all duration-150 ease-out active:scale-90 hover:scale-105 group">
                            <FontAwesomeIcon icon={faArrowRight} className="text-lg opacity-0" />
                            Signup
                            <FontAwesomeIcon icon={faArrowRight} className="text-lg group-hover:translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-150 group-hover:duration-500" />
                        </button>
                    </>
                )}
                {buttons === "confirm" && (
                    <button
                        type="submit"
                        className="w-full font-medium h-10 sm:h-12 flex justify-center items-center rounded-lg border-2 border-west-side-500 text-west-side-500
                                                                    hover:bg-west-side-500 hover:text-stone-100
                                                                    active:bg-west-side-500 active:text-stone-100
                                                                    transition-all duration-150 ease-out active:scale-90 hover:scale-105 overflow-hidden group">
                        <FontAwesomeIcon icon={faCheck} className="text-lg mr-2 opacity-0" />
                        Confirm
                        <FontAwesomeIcon icon={faCheck} className="text-stone-100 text-lg ml-2 translate-y-[200%] group-hover:translate-y-0 transition duration-150 group-hover:duration-500" />
                    </button>
                )}
            </div>
        </form>
    );
}
