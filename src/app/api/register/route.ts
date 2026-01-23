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
      surname, // for User
      cellphone,
      vatNumber, // for Operator
      telephone, // for Operator
    } = body;

    // validation of required fields
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

    // Map frontend role to database role
    let dbRole: Role = Role.USER; // Default
    if (role === "AGENCY") {
      dbRole = Role.OPERATOR;
    }

    if (dbRole === Role.USER && (!name || !surname || !cellphone)) {
      return NextResponse.json(
        { message: "Missing User data" },
        { status: 400 }
      );
    }

    if (dbRole === Role.OPERATOR && (!name || !vatNumber || !telephone)) {
      return NextResponse.json(
        { message: "Missing Operator data" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User first
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: dbRole,
        oauthProvider: OAuthProvider.APP,
        name: name,
        surname: dbRole === Role.USER ? surname : undefined, // Only store surname for standard users if schema permits
        cellphone: dbRole === Role.USER ? cellphone : undefined,
      }
    });

    // Create Operator profile if needed
    if (dbRole === Role.OPERATOR) {
      await prisma.operator.create({
        data: {
          user: { connect: { id: user.id } },
          organizationName: name, // Map 'name' from form to 'organizationName'
          vatNumber,
          telephone,
        }
      });
    }

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during the registration", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
