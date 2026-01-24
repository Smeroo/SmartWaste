import { object, string } from "zod";

// These schemas are used to validate user input during registration and login processes.
const email = string().email("Invalid email");
const password = string()
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters");
const name = string().min(2, "Name is too short").max(50, "Name is too long");
const surname = string()
  .min(2, "Surname is too short")
  .max(50, "Surname is too long");

const vatNumber = string().regex(
  /^[A-Z]{2}\d{11}$/,
  "VAT must be in the format AA12345678910"
);

// Sign in schema for both users and operators
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
  vatNumber: vatNumber.optional(),
};

export const userRegisterSchema = signInSchema.extend(userFields);

export const operatorRegisterSchema = signInSchema.extend(operatorFields);

// Sign in schema for OAuth providers (email and password are optional)
const optionalSignInSchema = object({
  email: email.optional(),
  password: password.optional(),
});

export const userRegisterSchemaOAuth =
  optionalSignInSchema.extend(userFields);

export const operatorRegisterSchemaOAuth =
  optionalSignInSchema.extend(operatorFields);
