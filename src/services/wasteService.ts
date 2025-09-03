import { mongoService } from './mongoService';
import type { IWasteRequest } from '@/models';

export interface CreateWasteRequestData {
  wasteType: 'plastic' | 'paper' | 'metal' | 'e-waste' | 'organic' | 'mixed';
  quantity: number;
  description?: string;
  images?: string[];
  address: string;
  coordinates: { lat: number; lng: number };
  preferredTime: Date;
}

export const wasteService = {
  // Create new waste request
  async createRequest(userId: string, data: CreateWasteRequestData): Promise<string> {
    try {
      const estimatedPrice = this.calculateEstimatedPrice(data.wasteType, data.quantity);
      const greenCoins = Math.floor(estimatedPrice * 2); // 2 green coins per rupee
      
      const requestData = {
        userId,
        ...data,
        status: 'pending' as const,
        estimatedPrice,
        estimatedValue: estimatedPrice,
        greenCoins
      };

      const newRequest = await mongoService.createWasteRequest(requestData);
      return newRequest._id.toString();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create waste request');
    }
  },

  // Get user's waste requests
  async getUserRequests(userId: string): Promise<IWasteRequest[]> {
    try {
      const requests = await mongoService.getWasteRequestsByUser(userId);
      return requests;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch requests');
    }
  },

  // Get available requests for collectors
  async getAvailableRequests(): Promise<IWasteRequest[]> {
    try {
      const requests = await mongoService.getPendingWasteRequests();
      return requests;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch available requests');
    }
  },

  // Assign request to collector
  async assignRequest(requestId: string, collectorId: string, scheduledDate: Date): Promise<void> {
    try {
      await mongoService.updateWasteRequest(requestId, {
        collectorId,
        scheduledDate,
        status: 'assigned'
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to assign request');
    }
  },

  // Update request status
  async updateRequestStatus(
    requestId: string, 
    status: IWasteRequest['status'],
    updates?: Partial<IWasteRequest>
  ): Promise<void> {
    try {
      await mongoService.updateWasteRequest(requestId, {
        status,
        ...updates
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update request status');
    }
  },

  // Calculate estimated price based on waste type and quantity
  calculateEstimatedPrice(wasteType: string, quantity: number): number {
    const rates: { [key: string]: number } = {
      paper: 8,      // ₹8/kg
      plastic: 12,   // ₹12/kg
      metal: 30,     // ₹30/kg
      'e-waste': 25, // ₹25/kg
      organic: 2,    // ₹2/kg
      mixed: 5       // ₹5/kg
    };
    
    return (rates[wasteType] || 5) * quantity;
  },

  // Delete waste request
  async deleteRequest(requestId: string): Promise<void> {
    try {
      await mongoService.deleteWasteRequest(requestId);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete request');
    }
  }
};
