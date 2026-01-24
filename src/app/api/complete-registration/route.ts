import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, email, ...rest } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { operator: true },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Controlla se l'utente ha già un profilo
    if (user.operator || (user.role === "USER" && user.name && user.surname)) {
      return NextResponse.json(
        { message: "Profile already completed." },
        { status: 400 }
      );
    }

    const dbRole = role === "OPERATOR" ? "OPERATOR" : "USER";

    if (dbRole === "USER") {
      if (!rest.name || !rest.surname) {
        return NextResponse.json(
          { message: "Missing user fields." },
          { status: 400 }
        );
      }
      // Aggiorna utente esistente con dati profilo
      await prisma.user.update({
        where: { email },
        data: {
          name: rest.name,
          surname: rest.surname,
          role: "USER"
        },
      });
    } else if (dbRole === "OPERATOR") {
      if (!rest.name) {
        return NextResponse.json(
          { message: "Missing operator fields." },
          { status: 400 }
        );
      }

      // Crea profilo operatore collegato all'utente
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (!existingUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

      await prisma.operator.create({
        data: {
          organizationName: rest.name, // Mappa name su organizationName
          telephone: "", // Workaround per tipi Prisma Client obsoleti
          user: { connect: { id: existingUser.id } },
        },
      });

      // Aggiorna ruolo su utente
      await prisma.user.update({
        where: { email },
        data: { role: "OPERATOR" },
      });
    }

    // Per aggiornare il ruolo dell'utente (ridondante ma sicuro)
    await prisma.user.update({
      where: { email },
      data: { role: dbRole },
    });

    return NextResponse.json({
      success: true,
      role: dbRole,
      redirectTo: "/",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error while saving." }, { status: 500 });
  }
}
