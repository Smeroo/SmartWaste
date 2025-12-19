import { auth } from "@/auth"
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Handles GET requests to /api/profile
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Fetch user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// Handles PUT requests to /api/profile
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userData = await request.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: userData.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// Handles DELETE requests to /api/profile
export async function DELETE() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    await prisma.user.delete({
      where: { email: session.user.email }
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}