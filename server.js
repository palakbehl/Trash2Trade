import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const users = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user', subType: 'trash-generator', location: 'Mumbai, Maharashtra', status: 'active', joinDate: '2024-01-15', totalRequests: 23 },
  { id: '2', name: 'Priya Patel', email: 'priya@example.com', role: 'user', subType: 'ngo-business', location: 'Ahmedabad, Gujarat', status: 'active', joinDate: '2024-02-20', totalRequests: 45 },
  { id: '3', name: 'Amit Kumar', email: 'amit@example.com', role: 'collector', location: 'Delhi, NCR', status: 'active', joinDate: '2024-01-10', totalRequests: 156, wasteCollected: 2340, earnings: 45600 }
];

const products = [
  {
    id: '1',
    name: 'Recycled Plastic Chair',
    description: 'Comfortable chair made from 100% recycled plastic bottles. Durable, weather-resistant, and eco-friendly.',
    price: 2499,
    originalPrice: 3999,
    category: 'furniture',
    seller: 'EcoFurniture Co.',
    sellerRating: 4.8,
    image: '🪑',
    tags: ['recycled', 'outdoor', 'durable'],
    wasteReduced: '50 plastic bottles',
    location: 'Mumbai, Maharashtra',
    inStock: true,
    sustainabilityScore: 95,
    reviews: 124,
    rating: 4.6
  },
  {
    id: '2',
    name: 'Upcycled Wooden Bookshelf',
    description: 'Beautiful bookshelf crafted from reclaimed wood. Each piece is unique with natural wood grain patterns.',
    price: 4999,
    originalPrice: 7500,
    category: 'furniture',
    seller: 'GreenCraft Studio',
    sellerRating: 4.9,
    image: '📚',
    tags: ['reclaimed wood', 'handmade', 'unique'],
    wasteReduced: '2kg wood waste',
    location: 'Bangalore, Karnataka',
    inStock: true,
    sustainabilityScore: 88,
    reviews: 89,
    rating: 4.7
  }
];

const analytics = {
  totalUsers: 1247,
  totalCollectors: 89,
  wasteCollected: 15600,
  revenue: 234500,
  activeRequests: 45,
  completedRequests: 2156,
  sustainabilityScore: 87,
  monthlyGrowth: 23.5
};

// API Routes
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filteredProducts = products;
  
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json(filteredProducts);
});

app.get('/api/analytics', (req, res) => {
  res.json(analytics);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user) {
    res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        subType: user.subType 
      } 
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role, subType } = req.body;
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    role,
    subType,
    location: 'India',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    totalRequests: 0
  };
  
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

app.post('/api/waste-pickup', (req, res) => {
  const pickupRequest = {
    id: String(Date.now()),
    ...req.body,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };
  
  res.json({ success: true, request: pickupRequest });
});

app.post('/api/ngo-partnership', (req, res) => {
  const partnership = {
    id: String(Date.now()),
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  res.json({ success: true, partnership });
});

app.post('/api/collector-verification', (req, res) => {
  const verification = {
    id: String(Date.now()),
    ...req.body,
    status: 'under-review',
    createdAt: new Date().toISOString()
  };
  
  res.json({ success: true, verification });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available:`);
  console.log(`   GET  /api/users`);
  console.log(`   GET  /api/products`);
  console.log(`   GET  /api/analytics`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/signup`);
  console.log(`   POST /api/waste-pickup`);
  console.log(`   POST /api/ngo-partnership`);
  console.log(`   POST /api/collector-verification`);
});
