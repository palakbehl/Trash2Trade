# EcoConnect Trade - Setup Guide

## MongoDB Database Integration

This project has been configured to use MongoDB with dynamic data management. Follow these steps to set up the database connection:

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://mapiitasrm2020_db_use:<password>@cluster0.jAVemNCjPuF8VjgWhyjmop9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_PASSWORD=your_actual_mongodb_password

# Database Name
DATABASE_NAME=ecoconnect_trade

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Backend Port
PORT=3001

# Environment
NODE_ENV=development

# Frontend Environment Variables (Vite)
VITE_API_BASE_URL=http://localhost:3001/api
```

**Important:** Replace `<password>` in the MONGODB_URI with your actual MongoDB password.

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed the Database (Optional)

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- Sample users (user, collector, admin, NGO, DIY marketplace)
- Sample waste pickup requests
- Sample DIY products
- Sample transactions
- Test login credentials

### 4. Start the Application

#### Development Mode (Frontend + Backend)
```bash
npm start
```

#### Individual Services
```bash
# Frontend only
npm run dev

# Backend only
npm run backend

# Old server (for comparison)
npm run server
```

### 5. Test Login Credentials

After seeding, you can use these test accounts:

- **User:** user@trash2trade.com / password123
- **NGO:** ngo@trash2trade.com / password123
- **DIY Seller:** diy@trash2trade.com / password123
- **Collector:** collector@test.com / password123
- **Admin:** admin@test.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Waste Management
- `GET /api/waste/requests` - Get all waste requests
- `GET /api/waste/requests/pending` - Get pending requests (for collectors)
- `GET /api/waste/requests/my` - Get user's requests
- `POST /api/waste/requests` - Create new waste request
- `POST /api/waste/requests/:id/accept` - Accept request (collectors)
- `POST /api/waste/requests/:id/complete` - Complete request (collectors)

### DIY Marketplace
- `GET /api/products` - Get all DIY products
- `GET /api/products/:id` - Get specific product
- `GET /api/products/seller/my` - Get seller's products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `POST /api/products/:id/like` - Like product
- `POST /api/products/:id/order` - Create order

### Users & Collectors
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/collectors` - Get all collectors
- `GET /api/collectors/profile` - Get collector profile
- `GET /api/collectors/stats` - Get collector statistics
- `POST /api/collectors/profile` - Create collector profile

### Analytics
- `GET /api/analytics` - Get platform analytics (admin)
- `GET /api/analytics/user/:id` - Get user analytics
- `GET /api/analytics/collector/:id` - Get collector analytics

## Database Models

### User
- Basic user information
- Role-based access (user, collector, admin)
- Subtypes (trash-generator, ngo-business, diy-marketplace)
- Green coins and eco score tracking

### WasteRequest
- Waste pickup requests
- Status tracking (pending, assigned, completed)
- Location-based matching
- Price estimation and green coins calculation

### DIYProduct
- Marketplace products made from recycled materials
- Category-based organization
- Search functionality
- Order management

### Collector
- Collector profile and verification
- Service areas and vehicle information
- Performance tracking and ratings

### Transaction
- Financial transaction history
- Green coins transactions
- Earning and spending records

## Features Implemented

✅ **MongoDB Integration**
- Full database schema with indexes
- Mongoose ODM for data modeling
- Connection management and error handling

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- Secure password hashing

✅ **Waste Management System**
- Dynamic pickup request creation
- Collector assignment and tracking
- Real-time status updates
- Location-based matching

✅ **DIY Marketplace**
- Product listing and management
- Search and filtering
- Order processing
- Image support

✅ **Analytics Dashboard**
- User statistics and trends
- Collector performance metrics
- Platform-wide analytics
- Environmental impact tracking

✅ **API Documentation**
- RESTful API design
- Comprehensive error handling
- Request/response validation

## Next Steps

1. **Replace MongoDB password** in the environment variables
2. **Test the connection** by running `npm run seed`
3. **Start the application** with `npm start`
4. **Test the features** using the provided login credentials
5. **Customize the data** as needed for your use case

## Troubleshooting

### Connection Issues
- Verify MongoDB password is correct
- Check network connectivity
- Ensure MongoDB cluster is accessible
- Verify environment variables are loaded

### API Issues
- Check if backend is running on port 3001
- Verify frontend is configured to use correct API URL
- Check browser console for detailed error messages

### Data Issues
- Run the seed script to populate test data
- Check MongoDB logs for any database errors
- Verify user roles and permissions

For additional support, check the console logs for detailed error messages.
