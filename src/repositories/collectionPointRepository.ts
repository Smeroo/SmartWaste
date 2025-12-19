import { prisma } from '@/lib/prisma';

interface CreateCollectionPointData {
  name: string;
  description: string;
  operatorId: string;
  accessibility?: string;
  capacity?: string;
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
}

export const collectionPointRepository = {
  /**
   * Find all active collection points with related data
   */
  async findAll() {
    return prisma.collectionPoint.findMany({
      where: {
        isActive: true,
      },
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
  },

  /**
   * Find a collection point by ID
   */
  async findById(id: number) {
    return prisma.collectionPoint.findUnique({
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
      },
    });
  },

  /**
   * Create a new collection point
   */
  async create(data: CreateCollectionPointData) {
    return prisma.collectionPoint.create({
      data: {
        name: data.name,
        description: data.description,
        operatorId: data.operatorId,
        accessibility: data.accessibility,
        capacity: data.capacity,
        address: data.address ? {
          create: {
            street: data.address.street,
            number: data.address.number,
            city: data.address.city,
            zip: data.address.zip,
            country: data.address.country || 'Italy',
            latitude: data.address.latitude,
            longitude: data.address.longitude,
          },
        } : undefined,
        wasteTypes: data.wasteTypeIds ? {
          connect: data.wasteTypeIds.map((id) => ({ id })),
        } : undefined,
        schedule: data.schedule ? {
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
        } : undefined,
      },
      include: {
        address: true,
        wasteTypes: true,
        schedule: true,
      },
    });
  },

  /**
   * Update a collection point
   */
  async update(id: number, data: Partial<CreateCollectionPointData>) {
    return prisma.collectionPoint.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        accessibility: data.accessibility,
        capacity: data.capacity,
      },
      include: {
        address: true,
        wasteTypes: true,
        schedule: true,
      },
    });
  },

  /**
   * Delete a collection point
   */
  async delete(id: number) {
    return prisma.collectionPoint.delete({
      where: { id },
    });
  },
};
