import { NextRequest, NextResponse } from 'next/server';
import { getCollectionPointById, updateCollectionPoint, deleteCollectionPoint } from '@/services/collectionPointService';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const pointId = parseInt(id);
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const updatedPoint = await updateCollectionPoint(pointId, session.user.id, body);
        return NextResponse.json(updatedPoint);
    } catch (error: any) {
        console.error('Error updating collection point:', error);
        if (error.message === 'Collection point not found') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (error.message === 'Not authorized to update this resource') {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json(
            { error: 'Failed to update collection point' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const pointId = parseInt(id);
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await deleteCollectionPoint(pointId, session.user.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting collection point:', error);
        if (error.message === 'Collection point not found') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (error.message === 'Not authorized to delete this resource') {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json(
            { error: 'Failed to delete collection point' },
            { status: 500 }
        );
    }
}
