import { collectionPointRepository } from '@/repositories/collectionPointRepository';

interface CreateCollectionPointInput {
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
}

export const collectionPointService = {
  /**
   * Get all active collection points
   */
  async getAllCollectionPoints() {
    return collectionPointRepository.findAll();
  },

  /**
   * Get a collection point by ID
   */
  async getCollectionPointById(id: number) {
    return collectionPointRepository.findById(id);
  },

  /**
   * Create a new collection point with validation
   */
  async createCollectionPoint(data: CreateCollectionPointInput) {
    // Business logic: validate required fields
    if (!data.name || !data.description || !data.operatorId) {
      throw new Error('Missing required fields: name, description, and operatorId are required');
    }

    // Business logic: validate address if provided
    if (data.address) {
      if (!data.address.street || !data.address.city || !data.address.zip) {
        throw new Error('Incomplete address: street, city, and zip are required');
      }
      if (typeof data.address.latitude !== 'number' || typeof data.address.longitude !== 'number') {
        throw new Error('Invalid coordinates: latitude and longitude must be numbers');
      }
    }

    // Call repository to persist data
    return collectionPointRepository.create(data);
  },

  /**
   * Update a collection point
   */
  async updateCollectionPoint(id: number, data: Partial<CreateCollectionPointInput>) {
    const existingPoint = await collectionPointRepository.findById(id);
    
    if (!existingPoint) {
      throw new Error('Collection point not found');
    }

    return collectionPointRepository.update(id, data);
  },

  /**
   * Delete a collection point
   */
  async deleteCollectionPoint(id: number) {
    const existingPoint = await collectionPointRepository.findById(id);
    
    if (!existingPoint) {
      throw new Error('Collection point not found');
    }

    return collectionPointRepository.delete(id);
  },
};
