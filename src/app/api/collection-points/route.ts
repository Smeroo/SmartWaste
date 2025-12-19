import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { collectionPointService } from '@/services/collectionPointService';

export async function GET(request: NextRequest) {
  try {
    const collectionPoints = await collectionPointService.getAllCollectionPoints();
    return NextResponse.json(collectionPoints);
  } catch (error) {
    console.error('Error fetching collection points:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection points' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (session.user.role !== 'OPERATOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "User not authorized" }, { status: 403 });
    }

    const body = await request.json();
    
    const {
      name,
      description,
      operatorId,
      address,
      wasteTypeIds,
      schedule,
      accessibility,
      capacity,
    } = body;

    const collectionPoint = await collectionPointService.createCollectionPoint({
      name,
      description,
      operatorId,
      address,
      wasteTypeIds,
      schedule,
      accessibility,
      capacity,
    });

    return NextResponse.json(collectionPoint, { status: 201 });
  } catch (error) {
    console.error('Error creating collection point:', error);
    
    // Check if it's a validation error from the service
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create collection point' },
      { status: 500 }
    );
  }
}