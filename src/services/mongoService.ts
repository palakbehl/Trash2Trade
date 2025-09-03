import { connectToDatabase } from '@/lib/mongodb';
import { User, WasteRequest, Transaction, DIYProduct, Collector, Order } from '@/models';
import type { IUser, IWasteRequest, ITransaction, IDIYProduct, ICollector, IOrder } from '@/models';

export class MongoService {
  private static instance: MongoService;

  private constructor() {}

  public static getInstance(): MongoService {
    if (!MongoService.instance) {
      MongoService.instance = new MongoService();
    }
    return MongoService.instance;
  }

  // Ensure database connection
  private async ensureConnection() {
    await connectToDatabase();
  }

  // User Management
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    await this.ensureConnection();
    const user = new User(userData);
    return await user.save();
  }

  async getUserById(id: string): Promise<IUser | null> {
    await this.ensureConnection();
    return await User.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    await this.ensureConnection();
    return await User.findOne({ email: email.toLowerCase() });
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    await this.ensureConnection();
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  async getAllUsers(): Promise<IUser[]> {
    await this.ensureConnection();
    return await User.find().sort({ createdAt: -1 });
  }

  // Waste Request Management
  async createWasteRequest(requestData: Partial<IWasteRequest>): Promise<IWasteRequest> {
    await this.ensureConnection();
    const request = new WasteRequest(requestData);
    return await request.save();
  }

  async getWasteRequestById(id: string): Promise<IWasteRequest | null> {
    await this.ensureConnection();
    return await WasteRequest.findById(id).populate('userId collectorId');
  }

  async getWasteRequestsByUser(userId: string): Promise<IWasteRequest[]> {
    await this.ensureConnection();
    return await WasteRequest.find({ userId }).sort({ createdAt: -1 }).populate('collectorId');
  }

  async getWasteRequestsByCollector(collectorId: string): Promise<IWasteRequest[]> {
    await this.ensureConnection();
    return await WasteRequest.find({ collectorId }).sort({ createdAt: -1 }).populate('userId');
  }

  async getPendingWasteRequests(): Promise<IWasteRequest[]> {
    await this.ensureConnection();
    return await WasteRequest.find({ status: 'pending' }).sort({ createdAt: -1 }).populate('userId');
  }

  async updateWasteRequest(id: string, updates: Partial<IWasteRequest>): Promise<IWasteRequest | null> {
    await this.ensureConnection();
    return await WasteRequest.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteWasteRequest(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await WasteRequest.findByIdAndDelete(id);
    return !!result;
  }

  // Transaction Management
  async createTransaction(transactionData: Partial<ITransaction>): Promise<ITransaction> {
    await this.ensureConnection();
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  async getTransactionsByUser(userId: string): Promise<ITransaction[]> {
    await this.ensureConnection();
    return await Transaction.find({ userId }).sort({ createdAt: -1 });
  }

  async getTransactionsByCollector(collectorId: string): Promise<ITransaction[]> {
    await this.ensureConnection();
    return await Transaction.find({ collectorId }).sort({ createdAt: -1 });
  }

  // DIY Product Management
  async createDIYProduct(productData: Partial<IDIYProduct>): Promise<IDIYProduct> {
    await this.ensureConnection();
    const product = new DIYProduct(productData);
    return await product.save();
  }

  async getDIYProducts(filter: any = { status: 'active' }): Promise<IDIYProduct[]> {
    await this.ensureConnection();
    return await DIYProduct.find(filter).sort({ createdAt: -1 }).populate('sellerId');
  }

  async getDIYProductsBySeller(sellerId: string): Promise<IDIYProduct[]> {
    await this.ensureConnection();
    return await DIYProduct.find({ sellerId }).sort({ createdAt: -1 });
  }

  async updateDIYProduct(id: string, updates: Partial<IDIYProduct>): Promise<IDIYProduct | null> {
    await this.ensureConnection();
    return await DIYProduct.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteDIYProduct(id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await DIYProduct.findByIdAndDelete(id);
    return !!result;
  }

  // Collector Management
  async createCollector(collectorData: Partial<ICollector>): Promise<ICollector> {
    await this.ensureConnection();
    const collector = new Collector(collectorData);
    return await collector.save();
  }

  async getCollectorByUserId(userId: string): Promise<ICollector | null> {
    await this.ensureConnection();
    return await Collector.findOne({ userId }).populate('userId');
  }

  async getAllCollectors(): Promise<ICollector[]> {
    await this.ensureConnection();
    return await Collector.find().populate('userId').sort({ createdAt: -1 });
  }

  async updateCollector(id: string, updates: Partial<ICollector>): Promise<ICollector | null> {
    await this.ensureConnection();
    return await Collector.findByIdAndUpdate(id, updates, { new: true });
  }

  // Order Management
  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    await this.ensureConnection();
    const order = new Order(orderData);
    return await order.save();
  }

  async getOrdersByBuyer(buyerId: string): Promise<IOrder[]> {
    await this.ensureConnection();
    return await Order.find({ buyerId }).sort({ createdAt: -1 }).populate('productId sellerId');
  }

  async getOrdersBySeller(sellerId: string): Promise<IOrder[]> {
    await this.ensureConnection();
    return await Order.find({ sellerId }).sort({ createdAt: -1 }).populate('productId buyerId');
  }

  async updateOrder(id: string, updates: Partial<IOrder>): Promise<IOrder | null> {
    await this.ensureConnection();
    return await Order.findByIdAndUpdate(id, updates, { new: true });
  }

  // Analytics and Statistics
  async getUserStats(userId: string): Promise<any> {
    await this.ensureConnection();
    
    const user = await User.findById(userId);
    if (!user) return null;

    const userRequests = await WasteRequest.find({ userId });
    const userTransactions = await Transaction.find({ userId });
    
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
      co2Saved: totalWasteCollected * 0.5,
      nextPickup: userRequests
        .filter(req => req.status === 'assigned')
        .sort((a, b) => new Date(a.scheduledDate || 0).getTime() - new Date(b.scheduledDate || 0).getTime())[0]?.scheduledDate
    };
  }

  async getCollectorStats(collectorId: string): Promise<any> {
    await this.ensureConnection();
    
    const collector = await Collector.findOne({ userId: collectorId });
    if (!collector) {
      return {
        totalPickups: 0,
        totalEarnings: 0,
        wasteCollected: 0,
        rating: 0,
        activePickups: 0,
        efficiency: 0,
        inventoryValue: 0
      };
    }

    const collectorRequests = await WasteRequest.find({ collectorId });
    const completedPickups = collectorRequests.filter(req => req.status === 'completed');
    const totalEarnings = completedPickups.reduce((sum, req) => sum + (req.estimatedValue || 0), 0);
    const wasteCollected = completedPickups.reduce((sum, req) => sum + req.quantity, 0);

    return {
      totalPickups: completedPickups.length,
      totalEarnings,
      wasteCollected,
      rating: collector.rating,
      activePickups: collectorRequests.filter(req => req.status === 'pending').length,
      efficiency: wasteCollected > 0 ? (wasteCollected / (completedPickups.length || 1)).toFixed(1) : 0,
      inventoryValue: totalEarnings * 0.6 // Estimate
    };
  }

  async getAdminStats(): Promise<any> {
    await this.ensureConnection();
    
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCollectors = await User.countDocuments({ role: 'collector' });
    const allRequests = await WasteRequest.find();
    const allTransactions = await Transaction.find();
    
    const completedPickups = allRequests.filter(req => req.status === 'completed');
    const totalWasteProcessed = completedPickups.reduce((sum, req) => sum + req.quantity, 0);
    const totalRevenue = allTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalUsers,
      totalCollectors,
      totalPickups: completedPickups.length,
      pendingPickups: allRequests.filter(req => req.status === 'pending').length,
      wasteProcessed: totalWasteProcessed,
      revenue: totalRevenue,
      co2Saved: totalWasteProcessed * 0.5,
      monthlyGrowth: await this.calculateMonthlyGrowth(),
      userGrowth: await this.calculateUserGrowth(),
      collectorGrowth: await this.calculateCollectorGrowth()
    };
  }

  private async calculateMonthlyGrowth(): Promise<number[]> {
    await this.ensureConnection();
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthlyPickups = await WasteRequest.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        status: 'completed'
      });
      
      months.push(monthlyPickups);
    }
    
    return months;
  }

  private async calculateUserGrowth(): Promise<number[]> {
    await this.ensureConnection();
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthlyUsers = await User.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        role: 'user'
      });
      
      months.push(monthlyUsers);
    }
    
    return months;
  }

  private async calculateCollectorGrowth(): Promise<number[]> {
    await this.ensureConnection();
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthlyCollectors = await User.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        role: 'collector'
      });
      
      months.push(monthlyCollectors);
    }
    
    return months;
  }

  // Search functionality
  async searchDIYProducts(query: string, category?: string): Promise<IDIYProduct[]> {
    await this.ensureConnection();
    const filter: any = { 
      status: 'active',
      $text: { $search: query }
    };
    
    if (category) {
      filter.category = category;
    }
    
    return await DIYProduct.find(filter).populate('sellerId').sort({ score: { $meta: 'textScore' } });
  }

  async getNearbyWasteRequests(lat: number, lng: number, maxDistance: number = 10000): Promise<IWasteRequest[]> {
    await this.ensureConnection();
    return await WasteRequest.find({
      status: 'pending',
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: maxDistance
        }
      }
    }).populate('userId');
  }
}

// Export singleton instance
export const mongoService = MongoService.getInstance();

