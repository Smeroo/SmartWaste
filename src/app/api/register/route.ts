import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Role, OAuthProvider } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      role, // USER || OPERATOR
      name,
      surname, // per Utente
    } = body;

    // validazione dei campi obbligatori
    if (!email || !password || !role) {
      return NextResponse.json({ message: "Missing Data" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Email already registered." },
        { status: 409 }
      );
    }

    // Mappa ruolo frontend su ruolo database
    const dbRole: Role = role === "OPERATOR" ? Role.OPERATOR : Role.USER;

    if (dbRole === Role.USER && (!name || !surname)) {
      return NextResponse.json(
        { message: "Missing User data" },
        { status: 400 }
      );
    }

    if (dbRole === Role.OPERATOR && (!name)) {
      return NextResponse.json(
        { message: "Missing Operator data" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea prima l'Utente
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: dbRole,
        oauthProvider: OAuthProvider.APP,
        name: name,
        surname: dbRole === Role.USER ? surname : undefined,
      }
    });

    // Crea profilo Operatore se necessario
    if (dbRole === Role.OPERATOR) {
      await prisma.operator.create({
        data: {
          organizationName: name, // Mappa 'name' dal modulo su 'organizationName'
          telephone: "", // Workaround per tipi Prisma Client obsoleti
          user: { connect: { id: user.id } },
        }
      });
    }

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during the registration", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
