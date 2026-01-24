import { object, string } from "zod";

// Questi schemi sono usati per validare l'input dell'utente durante i processi di registrazione e login.
const email = string().email("Invalid email");
const password = string()
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters");
const name = string().min(2, "Name is too short").max(50, "Name is too long");
const surname = string()
  .min(2, "Surname is too short")
  .max(50, "Surname is too long");

// Schema di login per utenti e operatori
export const signInSchema = object({
  email,
  password,
});

export const userFields = {
  name,
  surname,
};

export const operatorFields = {
  name,
};

export const userRegisterSchema = signInSchema.extend(userFields);

export const operatorRegisterSchema = signInSchema.extend(operatorFields);

// Schema di login per provider OAuth (email e password sono opzionali)
const optionalSignInSchema = object({
  email: email.optional(),
  password: password.optional(),
});

export const userRegisterSchemaOAuth =
  optionalSignInSchema.extend(userFields);

export const operatorRegisterSchemaOAuth =
  optionalSignInSchema.extend(operatorFields);
