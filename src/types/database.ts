export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'collector' | 'admin';
  subtype?: 'trash-generator' | 'ngo-business' | 'diy-marketplace';
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  greenCoins: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WasteRequest {
  id: string;
  userId: string;
  wasteType: 'plastic' | 'paper' | 'metal' | 'e-waste' | 'organic' | 'mixed';
  quantity: number; // in kg
  description?: string;
  images?: string[];
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  preferredTime: Date;
  status: 'pending' | 'assigned' | 'collected' | 'completed' | 'cancelled';
  collectorId?: string;
  scheduledDate?: Date;
  estimatedPrice: number;
  actualPrice?: number;
  greenCoinsEarned?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collector {
  id: string;
  userId: string;
  vehicleType: 'bike' | 'auto' | 'truck' | 'van';
  vehicleNumber: string;
  licenseNumber: string;
  aadharNumber: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  serviceAreas: string[]; // array of area names
  isActive: boolean;
  rating: number;
  totalPickups: number;
  totalEarnings: number;
  completionRate: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents: {
    license: string;
    aadhar: string;
    vehicle: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  collectorId?: string;
  requestId?: string;
  type: 'earning' | 'spending' | 'withdrawal' | 'platform_fee';
  amount: number;
  greenCoins?: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: 'upcycled' | 'eco-friendly' | 'recycled' | 'diy';
  price: number;
  images: string[];
  materials: string[];
  condition: 'new' | 'like-new' | 'good' | 'fair';
  isAvailable: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  platformFee: number;
  sellerAmount: number;
  shippingAddress: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingId?: string;
  createdAt: Date;
  updatedAt: Date;
}
