import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { dataStore } from '@/lib/dynamicDataStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Package,
  Plus,
  Minus,
  Edit,
  Trash2,
  Search,
  Filter,
  Warehouse,
  TrendingUp,
  DollarSign,
  Weight
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'plastic' | 'paper' | 'metal' | 'e-waste' | 'glass' | 'organic';
  quantity: number;
  unit: 'kg' | 'tons' | 'pieces';
  pricePerUnit: number;
  totalValue: number;
  location: string;
  lastUpdated: string;
  status: 'available' | 'reserved' | 'sold';
}

const CollectorInventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  useEffect(() => {
    if (user?.id) {
      // Load dynamic inventory data
      const collectorInventory = dataStore.getInventoryByCollector(user.id).map(item => ({
        id: item.id,
        name: `${item.wasteType.charAt(0).toUpperCase() + item.wasteType.slice(1)} Waste`,
        category: item.wasteType as 'plastic' | 'paper' | 'metal' | 'e-waste' | 'glass' | 'organic',
        quantity: item.quantity,
        unit: item.unit as 'kg' | 'tons' | 'pieces',
        pricePerUnit: item.pricePerUnit,
        totalValue: item.quantity * item.pricePerUnit,
        location: item.location,
        lastUpdated: item.updatedAt.toLocaleDateString(),
        status: item.status as 'available' | 'reserved' | 'sold'
      }));
      setInventory(collectorInventory);
    }
  }, [user?.id]);

  // Fallback mock data if no dynamic data exists
  const mockInventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Plastic Bottles (PET)',
      category: 'plastic',
      quantity: 150,
      unit: 'kg',
      pricePerUnit: 15,
      totalValue: 2250,
      location: 'Storage Unit A',
      lastUpdated: '2024-08-29',
      status: 'available'
    },
    {
      id: '2',
      name: 'Cardboard & Paper',
      category: 'paper',
      quantity: 200,
      unit: 'kg',
      pricePerUnit: 8,
      totalValue: 1600,
      location: 'Storage Unit B',
      lastUpdated: '2024-08-28',
      status: 'available'
    },
    {
      id: '3',
      name: 'Aluminum Cans',
      category: 'metal',
      quantity: 75,
      unit: 'kg',
      pricePerUnit: 45,
      totalValue: 3375,
      location: 'Storage Unit A',
      lastUpdated: '2024-08-27',
      status: 'reserved'
    },
    {
      id: '4',
      name: 'Electronic Components',
      category: 'e-waste',
      quantity: 25,
      unit: 'pieces',
      pricePerUnit: 50,
      totalValue: 1250,
      location: 'Secure Storage',
      lastUpdated: '2024-08-26',
      status: 'available'
    },
    {
      id: '5',
      name: 'Glass Bottles',
      category: 'glass',
      quantity: 100,
      unit: 'kg',
      pricePerUnit: 12,
      totalValue: 1200,
      location: 'Storage Unit C',
      lastUpdated: '2024-08-25',
      status: 'sold'
    }
  ];

  // Use dynamic inventory if available, otherwise use mock data
  const displayInventory = inventory.length > 0 ? inventory : mockInventory;

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'plastic' as const,
    quantity: 0,
    unit: 'kg' as const,
    pricePerUnit: 0,
    location: ''
  });

  const categories = [
    { value: 'plastic', label: 'Plastic', color: 'bg-blue-100 text-blue-800' },
    { value: 'paper', label: 'Paper', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'metal', label: 'Metal', color: 'bg-gray-100 text-gray-800' },
    { value: 'e-waste', label: 'E-Waste', color: 'bg-purple-100 text-purple-800' },
    { value: 'glass', label: 'Glass', color: 'bg-green-100 text-green-800' },
    { value: 'organic', label: 'Organic', color: 'bg-orange-100 text-orange-800' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.pricePerUnit <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please fill in all required fields with valid values.',
        variant: 'destructive',
      });
      return;
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      totalValue: newItem.quantity * newItem.pricePerUnit,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'available'
    };

    setInventory(prev => [...prev, item]);
    setNewItem({
      name: '',
      category: 'plastic',
      quantity: 0,
      unit: 'kg',
      pricePerUnit: 0,
      location: ''
    });
    setIsAddDialogOpen(false);

    toast({
      title: 'Item Added',
      description: 'New inventory item has been added successfully.',
    });
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          totalValue: newQuantity * item.pricePerUnit,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    toast({
      title: 'Quantity Updated',
      description: `Inventory quantity has been ${change > 0 ? 'increased' : 'decreased'}.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    toast({
      title: 'Item Deleted',
      description: 'Inventory item has been removed.',
    });
  };

  const handleStatusChange = (id: string, newStatus: 'available' | 'reserved' | 'sold') => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : item
    ));

    toast({
      title: 'Status Updated',
      description: `Item status changed to ${newStatus}.`,
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const totalItems = inventory.length;
  const availableItems = inventory.filter(item => item.status === 'available').length;
  const totalWeight = inventory.reduce((sum, item) => sum + (item.unit === 'kg' ? item.quantity : 0), 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/collector')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Inventory Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your collected waste inventory
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Item Name</label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Plastic Bottles (PET)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as any }))}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={newItem.unit}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value as any }))}
                    >
                      <option value="kg">Kilograms</option>
                      <option value="tons">Tons</option>
                      <option value="pieces">Pieces</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price per Unit (₹)</label>
                    <Input
                      type="number"
                      value={newItem.pricePerUnit}
                      onChange={(e) => setNewItem(prev => ({ ...prev, pricePerUnit: Number(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Storage Location</label>
                  <Input
                    value={newItem.location}
                    onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Storage Unit A"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddItem} className="flex-1">Add Item</Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-success">₹{totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-primary">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-blue-600">{availableItems}</p>
              </div>
              <Warehouse className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Weight</p>
                <p className="text-2xl font-bold text-purple-600">{totalWeight}kg</p>
              </div>
              <Weight className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select 
              className="p-2 border rounded w-full md:w-48"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-6">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Location: {item.location} • Updated: {item.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Quantity</p>
                      <p className="text-lg font-bold">{item.quantity} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Price/Unit</p>
                      <p className="text-lg font-bold">₹{item.pricePerUnit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Value</p>
                      <p className="text-lg font-bold text-success">₹{item.totalValue}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <select 
                        className="text-sm border rounded p-1"
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 lg:w-48">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      disabled={item.quantity <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No inventory items found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first inventory item'
              }
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CollectorInventory;
