import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server';

// Gestisce richieste GET a /api/services
// Recupera tutti i servizi
export async function GET() {
  try {
    // Recupera tutti i tipi di rifiuto
    const services = await prisma.wasteType.findMany();

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}