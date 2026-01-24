import { NextRequest, NextResponse } from 'next/server';
import { getCollectionPointById, updateCollectionPoint, deleteCollectionPoint } from '@/services/collectionPointService';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const pointId = parseInt(id);

        if (isNaN(pointId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const collectionPoint = await getCollectionPointById(pointId);

        if (!collectionPoint) {
            return NextResponse.json({ error: 'Collection point not found' }, { status: 404 });
        }

        return NextResponse.json(collectionPoint);
    } catch (error) {
        console.error('Error fetching collection point:', error);
        return NextResponse.json(
            { error: 'Failed to fetch collection point' },
            { status: 500 }
        );
    }
}
