import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server';

// Handles GET requests to /api/services
// Fetch all services
export async function GET() {
  try {
    // Fetch all waste types
    const services = await prisma.wasteType.findMany();

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}