import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Gestisce richieste GET a /api/map
// Restituisce tutti i collectionPoints con le loro coordinate
export async function GET() {
    try {
        // Recupera tutti i collectionPoints con le loro coordinate
        const collectionPoints = await prisma.collectionPoint.findMany({
            select: {
                id: true,
                name: true,
                address: {
                    select: {
                        street: true,
                        number: true,
                        city: true,
                        latitude: true,
                        longitude: true
                    }
                }
            }
        });

        // Restituisce i collectionPoints come risposta JSON
        return NextResponse.json(collectionPoints);
    }
    catch (error) {
        // Gestisce eventuali errori che si verificano durante il recupero
        return NextResponse.json({ error: 'Failed to fetch collectionPoints coordinates' }, { status: 500 });
    }
}