import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Layer di servizio per la logica di business dei Punti di Raccolta
 * Separa la logica di business dai gestori delle route API
 */

export interface CollectionPointFilters {
  searchQuery?: string;
  wasteType?: string;
}

export interface CreateCollectionPointData {
  name: string;
  description: string;
  operatorId: string;
  address?: {
    street: string;
    number?: string;
    city: string;
    zip: string;
    country?: string;
    latitude: number;
    longitude: number;
  };
  wasteTypeIds?: number[];
  schedule?: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
    openingTime?: string;
    closingTime?: string;
    notes?: string;
    isAlwaysOpen?: boolean;
  };
  accessibility?: string;
  capacity?: string;
  images?: string[];
}

export interface UpdateCollectionPointData {
  name?: string;
  description?: string;
  address?: {
    street: string;
    number?: string;
    city: string;
    zip: string;
    country?: string;
    latitude: number;
    longitude: number;
  };
  wasteTypeIds?: number[];
  accessibility?: string;
  capacity?: string;
  schedule?: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
    openingTime?: string;
    closingTime?: string;
    notes?: string;
    isAlwaysOpen?: boolean;
  };
}

/**
 * Ottieni tutti i punti di raccolta con filtri opzionali
 */
export async function getCollectionPoints(filters?: CollectionPointFilters) {
  const where: Prisma.CollectionPointWhereInput = {
    isActive: true,
  };

  if (filters?.searchQuery) {
    const searchQuery = filters.searchQuery || "";
    where.OR = [
      { name: { contains: searchQuery } },
      {
        address: {
          city: { contains: searchQuery },
        },
      },
    ];
  }

  if (filters?.wasteType) {
    where.wasteTypes = {
      some: {
        name: { contains: filters.wasteType }
      }
    };
  }

  return await prisma.collectionPoint.findMany({
    where,
    include: {
      address: true,
      wasteTypes: true,
      schedule: true,
      operator: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Ottieni un singolo punto di raccolta tramite ID
 */
export async function getCollectionPointById(id: number) {
  return await prisma.collectionPoint.findUnique({
    where: { id },
    include: {
      address: true,
      wasteTypes: true,
      schedule: true,
      operator: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              surname: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
  });
}

/**
 * Crea un nuovo punto di raccolta
 */
export async function createCollectionPoint(data: CreateCollectionPointData) {
  return await prisma.collectionPoint.create({
    data: {
      name: data.name,
      description: data.description,
      operatorId: data.operatorId,
      accessibility: data.accessibility,
      capacity: data.capacity,
      images: data.images ? JSON.stringify(data.images) : undefined,
      address: data.address
        ? {
          create: {
            street: data.address.street,
            number: data.address.number,
            city: data.address.city,
            zip: data.address.zip,
            country: data.address.country || 'Italy',
            latitude: data.address.latitude,
            longitude: data.address.longitude,
          },
        }
        : undefined,
      wasteTypes: data.wasteTypeIds
        ? {
          connect: data.wasteTypeIds.map((id) => ({ id })),
        }
        : undefined,
      schedule: data.schedule
        ? {
          create: {
            monday: data.schedule.monday || false,
            tuesday: data.schedule.tuesday || false,
            wednesday: data.schedule.wednesday || false,
            thursday: data.schedule.thursday || false,
            friday: data.schedule.friday || false,
            saturday: data.schedule.saturday || false,
            sunday: data.schedule.sunday || false,
            openingTime: data.schedule.openingTime,
            closingTime: data.schedule.closingTime,
            notes: data.schedule.notes,
            isAlwaysOpen: data.schedule.isAlwaysOpen || false,
          },
        }
        : undefined,
    },
    include: {
      address: true,
      wasteTypes: true,
      schedule: true,
    },
  });
}

/**
 * Aggiorna un punto di raccolta esistente
 * Verifica la proprietà prima dell'aggiornamento
 */
export async function updateCollectionPoint(
  id: number,
  userId: string,
  data: UpdateCollectionPointData
) {
  // Verifica la proprietà
  const collectionPoint = await prisma.collectionPoint.findUnique({
    where: { id },
    select: { operatorId: true },
  });

  if (!collectionPoint) {
    throw new Error('Collection point not found');
  }

  if (collectionPoint.operatorId !== userId) {
    throw new Error('Not authorized to update this resource');
  }

  // Aggiorna il punto di raccolta
  return await prisma.collectionPoint.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      accessibility: data.accessibility,
      capacity: data.capacity,
      ...(data.address && {
        address: {
          update: {
            street: data.address.street,
            number: data.address.number,
            city: data.address.city,
            zip: data.address.zip,
            country: data.address.country || 'Italy',
            latitude: data.address.latitude,
            longitude: data.address.longitude,
          },
        },
      }),
      ...(data.wasteTypeIds && {
        wasteTypes: {
          set: data.wasteTypeIds.map((id) => ({ id })),
        },
      }),
      ...(data.schedule && {
        schedule: {
          upsert: {
            create: {
              monday: data.schedule.monday || false,
              tuesday: data.schedule.tuesday || false,
              wednesday: data.schedule.wednesday || false,
              thursday: data.schedule.thursday || false,
              friday: data.schedule.friday || false,
              saturday: data.schedule.saturday || false,
              sunday: data.schedule.sunday || false,
              openingTime: data.schedule.openingTime,
              closingTime: data.schedule.closingTime,
              notes: data.schedule.notes,
              isAlwaysOpen: data.schedule.isAlwaysOpen || false,
            },
            update: {
              monday: data.schedule.monday,
              tuesday: data.schedule.tuesday,
              wednesday: data.schedule.wednesday,
              thursday: data.schedule.thursday,
              friday: data.schedule.friday,
              saturday: data.schedule.saturday,
              sunday: data.schedule.sunday,
              openingTime: data.schedule.openingTime,
              closingTime: data.schedule.closingTime,
              notes: data.schedule.notes,
              isAlwaysOpen: data.schedule.isAlwaysOpen,
            }
          }
        }
      })
    },
    include: {
      address: true,
      wasteTypes: true,
      schedule: true,
    },
  });
}

/**
 * Elimina un punto di raccolta
 * Verifica la proprietà prima dell'eliminazione
 */
export async function deleteCollectionPoint(id: number, userId: string) {
  // Verifica la proprietà
  const collectionPoint = await prisma.collectionPoint.findUnique({
    where: { id },
    select: { operatorId: true },
  });

  if (!collectionPoint) {
    throw new Error('Collection point not found');
  }

  if (collectionPoint.operatorId !== userId) {
    throw new Error('Not authorized to delete this resource');
  }

  // Elimina il punto di raccolta
  await prisma.collectionPoint.delete({
    where: { id },
  });
}
