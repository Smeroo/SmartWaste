import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

async function getUserFromDb(email: string, plainPassword: string) {
  if (typeof email !== "string") {
    throw new Error("Email must be a string.");
  }

  // Trova l'utente tramite email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Controlla se l'utente esiste e ha una password
  if (!user || !user.password) {
    return null;
  }

  // Confronta la password fornita con la password hashata memorizzata
  const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export default getUserFromDb;
