import { prisma } from "@/lib/prisma";

type OAuthProvider = "GOOGLE" | "GITHUB";

type Role = "USER" | "OPERATOR";

interface CreateUserAndAccountParams {
  email: string;
  provider: string;
  providerAccountId: string;
  role?: Role;
}

export async function createUserAndAccount({
  email,
  provider,
  providerAccountId,
  role = "USER",
}: CreateUserAndAccountParams) {

  // Mappa il ruolo interno al ruolo nel DB
  const dbRole = role;

  const user = await prisma.user.create({
    data: {
      email,
      oauthProvider: provider.toUpperCase() as OAuthProvider,
      oauthId: providerAccountId,
      // @ts-ignore
      role: dbRole,
      name: "", // Richiesto dallo schema
    },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      type: "oauth",
      provider: provider,
      providerAccountId: providerAccountId,
    },
  });

  return user;
}
