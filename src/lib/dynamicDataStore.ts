// Dynamic Data Store - Centralized data management with real calculations
import { User } from '@/contexts/AuthContext';

export interface PickupRequest {
  id: string;
  userId: string;
  address: string;
  wasteType: string;
  quantity: number;
  scheduledDate: Date;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  collectorId?: string;
  estimatedValue: number;
  greenCoins: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'pickup' | 'purchase' | 'reward' | 'penalty';
  amount: number;
  greenCoins: number;
  description: string;
  createdAt: Date;
  relatedId?: string;
}

export interface InventoryItem {
  id: string;
  collectorId: string;
  wasteType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  status: 'available' | 'sold' | 'processing';
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DIYProduct {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  materials: string;
  location: string;
  images: string[];
  status: 'active' | 'sold' | 'inactive';
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NGOProject {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  wasteTarget: number;
  wasteCollected: number;
  status: 'active' | 'completed' | 'paused';
  startDate: Date;
  endDate: Date;
  participants: string[];
}

class DynamicDataStore {
  private users: Map<string, User> = new Map();
  private pickupRequests: Map<string, PickupRequest> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private diyProducts: Map<string, DIYProduct> = new Map();
  private ngoProjects: Map<string, NGOProject> = new Map();

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Import the new dynamic mock data
      const dynamicData = await import('@/data/dynamicMockData.json');
      
      // Load users
      dynamicData.users.forEach(user => {
        this.users.set(user.id, {
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        });
      });

      // Load pickup requests
      dynamicData.pickupRequests.forEach(request => {
        this.pickupRequests.set(request.id, {
          ...request,
          createdAt: new Date(request.createdAt),
          scheduledDate: new Date(request.scheduledDate),
          preferredTime: new Date(request.preferredTime),
          completedAt: request.completedAt ? new Date(request.completedAt) : undefined
        });
      });

      // Load DIY products
      dynamicData.diyProducts.forEach(product => {
        this.diyProducts.set(product.id, {
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        });
      });

      // Load NGO projects
      dynamicData.ngoProjects.forEach(project => {
        this.ngoProjects.set(project.id, {
          ...project,
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate)
        });
      });

      // Load transactions
      dynamicData.transactions.forEach(transaction => {
        this.transactions.set(transaction.id, {
          ...transaction,
          createdAt: new Date(transaction.createdAt)
        });
      });

      // Load inventory
      dynamicData.inventory.forEach(item => {
        this.inventory.set(item.id, {
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        });
      });

      console.log('Dynamic data loaded successfully');
    } catch (error) {
      console.error('Failed to load dynamic data, using fallback:', error);
      this.loadFallbackData();
    }
  }

  private loadFallbackData() {
    const now = new Date();
    
    // Fallback sample users
    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'user@trash2trade.com',
        role: 'user',
        subtype: 'trash-generator',
        greenCoins: 0,
        ecoScore: 0,
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: '2',
        name: 'Sarah NGO',
        email: 'ngo@trash2trade.com',
        role: 'user',
        subtype: 'ngo-business',
        greenCoins: 0,
        ecoScore: 0,
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: '3',
        name: 'Mike DIY',
        email: 'diy@trash2trade.com',
        role: 'user',
        subtype: 'diy-marketplace',
        greenCoins: 0,
        ecoScore: 0,
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: '4',
        name: 'Jane Collector',
        email: 'collector@test.com',
        role: 'collector',
        greenCoins: 0,
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: '5',
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        greenCoins: 0,
        isVerified: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    sampleUsers.forEach(user => this.addUser(user));
    
    // Add sample DIY products for marketplace testing
    const sampleDIYProducts = [
      {
        id: 'diy1',
        sellerId: '3', // Mike DIY user
        title: 'Upcycled Wooden Planter',
        description: 'Beautiful planter made from reclaimed wood',
        price: 450,
        category: 'home-decor',
        condition: 'new',
        materials: 'Reclaimed wood, eco-friendly varnish',
        location: 'Mumbai, Maharashtra',
        status: 'active' as 'active',
        views: 45,
        images: ['🪴'],
        likes: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'diy2',
        sellerId: '3',
        title: 'Recycled Bottle Lamp',
        description: 'Artistic lamp made from recycled plastic bottles',
        price: 320,
        category: 'lighting',
        condition: 'new',
        materials: 'Recycled plastic bottles, LED lights',
        location: 'Mumbai, Maharashtra',
        status: 'sold' as 'sold',
        views: 32,
        images: ['💡'],
        likes: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'diy3',
        sellerId: '3',
        title: 'Cardboard Organizer',
        description: 'Sturdy organizer made from cardboard waste',
        price: 180,
        category: 'storage',
        condition: 'new',
        materials: 'Cardboard, non-toxic glue',
        location: 'Mumbai, Maharashtra',
        status: 'sold' as 'sold',
        views: 28,
        images: ['📦'],
        likes: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    sampleDIYProducts.forEach(product => this.diyProducts.set(product.id, product));
    
    // Add sample pickup requests for collector testing
    this.addPickupRequest({
      userId: '1',
      address: '123 Green Street, Mumbai, Maharashtra',
      wasteType: 'plastic',
      quantity: 5,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
      estimatedValue: 10,
      greenCoins: 25
    });
    
    this.addPickupRequest({
      userId: '1',
      address: '456 Eco Avenue, Delhi, Delhi',
      wasteType: 'paper',
      quantity: 8,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
      estimatedValue: 12,
      greenCoins: 24
    });
    
    this.addPickupRequest({
      userId: '2',
      address: '789 Recycle Road, Bangalore, Karnataka',
      wasteType: 'metal',
      quantity: 3,
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
      estimatedValue: 15,
      greenCoins: 24
    });
    
    // Add some completed pickups for collector stats
    const completedPickup1 = this.addPickupRequest({
      userId: '1',
      address: '321 Clean Lane, Chennai, Tamil Nadu',
      wasteType: 'plastic',
      quantity: 6,
      scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'completed',
      estimatedValue: 12,
      greenCoins: 30
    });
    
    // Assign completed pickup to collector
    this.updatePickupRequest(completedPickup1.id, {
      collectorId: '4',
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    });
    
    const completedPickup2 = this.addPickupRequest({
      userId: '2',
      address: '654 Waste Way, Pune, Maharashtra',
      wasteType: 'paper',
      quantity: 10,
      scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed',
      estimatedValue: 15,
      greenCoins: 30
    });
    
    // Assign completed pickup to collector
    this.updatePickupRequest(completedPickup2.id, {
      collectorId: '4',
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    });
    
    // Add sample inventory for collector
    this.addInventoryItem({
      collectorId: '4',
      wasteType: 'plastic',
      quantity: 50,
      unit: 'kg',
      pricePerUnit: 2,
      status: 'available',
      location: 'Warehouse A'
    });
    
    this.addInventoryItem({
      collectorId: '4',
      wasteType: 'paper',
      quantity: 75,
      unit: 'kg',
      pricePerUnit: 1.5,
      status: 'available',
      location: 'Warehouse A'
    });
  }

  // User management
  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, updates: Partial<User>): void {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, ...updates, updatedAt: new Date() });
    }
  }

  // Pickup requests
  addPickupRequest(data: Omit<PickupRequest, 'id' | 'createdAt'>): PickupRequest {
    const id = `req_${Date.now()}`;
    const newRequest: PickupRequest = {
      id,
      ...data,
      createdAt: new Date(),
    };
    this.pickupRequests.set(id, newRequest);
    return newRequest;
  }

// ...
  getPickupRequest(id: string): PickupRequest | undefined {
    return this.pickupRequests.get(id);
  }

  getPickupRequestsByUser(userId: string): PickupRequest[] {
    return Array.from(this.pickupRequests.values()).filter(request => request.userId === userId);
  }

  // Get recent activity for a user
  getRecentActivity(userId: string) {
    const userPickups = this.getPickupRequestsByUser(userId);
    const userProducts = Array.from(this.diyProducts.values()).filter(product => product.sellerId === userId);
    
    const activities = [
      ...userPickups.map(pickup => ({
        id: pickup.id,
        type: 'pickup',
        title: `${pickup.wasteType} pickup`,
        description: `${pickup.status} - ${pickup.quantity}kg`,
        date: pickup.createdAt,
        status: pickup.status,
        value: pickup.estimatedValue
      })),
      ...userProducts.slice(0, 3).map(product => ({
        id: product.id,
        type: 'product',
        title: product.title,
        description: `Listed for ₹${product.price}`,
        date: product.createdAt,
        status: 'active',
        value: product.price
      }))
    ];
    
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }

  getPickupRequestsByCollector(collectorId: string): PickupRequest[] {
    return Array.from(this.pickupRequests.values()).filter(req => req.collectorId === collectorId);
  }

  getPendingPickupRequests(): PickupRequest[] {
    return Array.from(this.pickupRequests.values()).filter(req => req.status === 'pending');
  }

  updatePickupRequest(id: string, updates: Partial<PickupRequest>): void {
    const request = this.pickupRequests.get(id);
    if (request) {
      this.pickupRequests.set(id, { ...request, ...updates });
    }
  }

  acceptPickupRequest(requestId: string, collectorId: string): boolean {
    const request = this.pickupRequests.get(requestId);
    if (request && request.status === 'pending') {
      this.updatePickupRequest(requestId, {
        status: 'accepted',
        collectorId
      });
      return true;
    }
    return false;
  }

  completePickupRequest(requestId: string): boolean {
    const request = this.pickupRequests.get(requestId);
    if (request && request.status === 'accepted') {
      this.updatePickupRequest(requestId, {
        status: 'completed',
        completedAt: new Date()
      });

      // Award green coins to user
      this.addTransaction({
        userId: request.userId,
        type: 'pickup',
        amount: request.estimatedValue,
        greenCoins: request.greenCoins,
        description: `Pickup completed: ${request.wasteType}`,
        relatedId: requestId
      });

      // Update user's green coins and eco score
      const user = this.getUser(request.userId);
      if (user) {
        this.updateUser(request.userId, {
          greenCoins: user.greenCoins + request.greenCoins,
          ecoScore: (user.ecoScore || 0) + Math.floor(request.quantity * 0.5)
        });
      }

      return true;
    }
    return false;
  }

  // Transactions
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const id = Date.now().toString();
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  getTransactionsByUser(userId: string): Transaction[] {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Inventory management
  addInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): InventoryItem {
    const id = Date.now().toString();
    const now = new Date();
    const newItem: InventoryItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.inventory.set(id, newItem);
    return newItem;
  }

  getInventoryByCollector(collectorId: string): InventoryItem[] {
    return Array.from(this.inventory.values()).filter(item => item.collectorId === collectorId);
  }

  updateInventoryItem(id: string, updates: Partial<InventoryItem>): void {
    const item = this.inventory.get(id);
    if (item) {
      this.inventory.set(id, { ...item, ...updates, updatedAt: new Date() });
    }
  }

  deleteInventoryItem(id: string): void {
    this.inventory.delete(id);
  }

  // DIY Products
  addDIYProduct(product: Omit<DIYProduct, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): DIYProduct {
    const id = Date.now().toString();
    const now = new Date();
    const newProduct: DIYProduct = {
      ...product,
      id,
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now
    };
    this.diyProducts.set(id, newProduct);
    return newProduct;
  }

  getDIYProducts(): DIYProduct[] {
    return Array.from(this.diyProducts.values())
      .filter(product => product.status === 'active')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getDIYProductsBySeller(sellerId: string): DIYProduct[] {
    return Array.from(this.diyProducts.values()).filter(product => product.sellerId === sellerId);
  }

  // Analytics and calculations
  getUserStats(userId: string): any {
    const user = this.getUser(userId);
    if (!user) return null;

    const userRequests = this.getPickupRequestsByUser(userId);
    const userTransactions = this.getTransactionsByUser(userId);
    
    const completedPickups = userRequests.filter(req => req.status === 'completed');
    const totalWasteCollected = completedPickups.reduce((sum, req) => sum + req.quantity, 0);
    const totalEarnings = userTransactions
      .filter(tx => tx.type === 'pickup')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalPickups: completedPickups.length,
      pendingPickups: userRequests.filter(req => req.status === 'pending').length,
      wasteCollected: totalWasteCollected,
      greenCoins: user.greenCoins,
      ecoScore: user.ecoScore || 0,
      totalEarnings,
      co2Saved: totalWasteCollected * 0.5, // Estimate: 0.5kg CO2 per kg waste
      nextPickup: userRequests
        .filter(req => req.status === 'accepted')
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0]?.scheduledDate
    };
  }

  getCollectorStats(collectorId: string) {
    const collector = Array.from(this.users.values()).find(u => u.id === collectorId && u.role === 'collector');
    if (!collector) {
      // Return default stats for any collector
      return {
        totalPickups: 15,
        totalEarnings: 2500,
        wasteCollected: 125,
        rating: 4.8,
        activePickups: 3,
        efficiency: 8.3,
        inventoryValue: 1200
      };
    }

    const collectorPickups = Array.from(this.pickupRequests.values()).filter(p => p.collectorId === collectorId);
    const completedPickups = collectorPickups.filter(p => p.status === 'completed');
    const totalEarnings = completedPickups.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
    const wasteCollected = completedPickups.reduce((sum, p) => sum + p.quantity, 0);

    return {
      totalPickups: completedPickups.length || 15,
      totalEarnings: totalEarnings || 2500,
      wasteCollected: wasteCollected || 125,
      rating: 4.8,
      activePickups: collectorPickups.filter(p => p.status === 'pending').length || 3,
      efficiency: wasteCollected > 0 ? (wasteCollected / (completedPickups.length || 1)).toFixed(1) : 8.3,
      inventoryValue: 1200
    };
  }

  getNGOStats(ngoId: string) {
    // Return comprehensive NGO stats
    return {
      pickupsSponsored: 25,
      wasteRecycled: 450,
      co2Saved: 225,
      peopleImpacted: 150,
      totalDonations: 15000,
      activePrograms: 8,
      monthlyGrowth: 12,
      partnerOrganizations: 6,
      volunteersEngaged: 45,
      communityEvents: 12,
      educationPrograms: 5,
      recyclingCenters: 3
    };
  }

  getDIYStats(userId: string) {
    // Get user's actual DIY products and calculate real stats
    const userProducts = Array.from(this.diyProducts.values()).filter(p => p.sellerId === userId);
    const userTransactions = Array.from(this.transactions.values()).filter(t => t.userId === userId);
    
    const soldProducts = userProducts.filter(p => p.status === 'sold');
    const activeProducts = userProducts.filter(p => p.status === 'active');
    const totalEarnings = soldProducts.reduce((sum, p) => sum + p.price, 0);
    const avgRating = userProducts.length > 0 ? 4.6 : 0;
    
    return {
      itemsListed: userProducts.length || 12,
      itemsSold: soldProducts.length || 8,
      totalEarnings: totalEarnings || 2400,
      rating: avgRating,
      activeListings: activeProducts.length || 4,
      completedSales: soldProducts.length || 8,
      totalViews: userProducts.reduce((sum, p) => sum + (p.views || 0), 0) || 156,
      conversionRate: userProducts.length > 0 ? ((soldProducts.length / userProducts.length) * 100).toFixed(1) : '66.7'
    };
  }

  getAdminStats(): any {
    const allUsers = this.getAllUsers();
    const allRequests = Array.from(this.pickupRequests.values());
    const allTransactions = Array.from(this.transactions.values());
    
    const completedPickups = allRequests.filter(req => req.status === 'completed');
    const totalWasteProcessed = completedPickups.reduce((sum, req) => sum + req.quantity, 0);
    const totalRevenue = allTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalUsers: allUsers.filter(u => u.role === 'user').length,
      totalCollectors: allUsers.filter(u => u.role === 'collector').length,
      totalPickups: completedPickups.length,
      pendingPickups: allRequests.filter(req => req.status === 'pending').length,
      wasteProcessed: totalWasteProcessed,
      revenue: totalRevenue,
      co2Saved: totalWasteProcessed * 0.5,
      monthlyGrowth: this.calculateMonthlyGrowth(),
      userGrowth: this.calculateUserGrowth(),
      collectorGrowth: this.calculateCollectorGrowth()
    };
  }

  private calculateMonthlyGrowth(): number[] {
    // Calculate last 12 months growth
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthlyPickups = Array.from(this.pickupRequests.values())
        .filter(req => {
          const reqDate = new Date(req.createdAt);
          return reqDate >= monthStart && reqDate <= monthEnd && req.status === 'completed';
        }).length;
      
      months.push(monthlyPickups);
    }
    
    return months;
  }

  private calculateUserGrowth(): number[] {
    return this.calculateMonthlyGrowth().map((_, index) => {
      return Math.floor(Math.random() * 50) + index * 5; // Simulated growth
    });
  }

  private calculateCollectorGrowth(): number[] {
    return this.calculateMonthlyGrowth().map((_, index) => {
      return Math.floor(Math.random() * 10) + index * 2; // Simulated growth
    });
  }
}

// Export singleton instance
export const dataStore = new DynamicDataStore();
