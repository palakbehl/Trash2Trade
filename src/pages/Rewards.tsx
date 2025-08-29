import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  ShoppingCart, 
  Star, 
  ArrowLeft,
  Coins,
  Trophy,
  Zap,
  Coffee,
  Smartphone,
  Shirt,
  Book,
  Headphones,
  CheckCircle
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'vouchers' | 'products' | 'experiences';
  icon: any;
  image?: string;
  availability: number;
  popular?: boolean;
}

const Rewards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [redeemedItems, setRedeemedItems] = useState<string[]>([]);

  if (!user || user.role !== 'citizen') {
    return <div>Access denied</div>;
  }

  const userGreenCoins = user.greenCoins || 0;

  const rewards: Reward[] = [
    // Vouchers
    {
      id: '1',
      name: 'Coffee Shop Voucher',
      description: '$5 off at EcoCafe - Supporting sustainable coffee',
      cost: 50,
      category: 'vouchers',
      icon: Coffee,
      availability: 25,
      popular: true,
    },
    {
      id: '2',
      name: 'Grocery Store Credit',
      description: '$10 credit at GreenMart for organic products',
      cost: 100,
      category: 'vouchers',
      icon: ShoppingCart,
      availability: 15,
    },
    {
      id: '3',
      name: 'Public Transport Pass',
      description: '1-day metro pass for eco-friendly travel',
      cost: 75,
      category: 'vouchers',
      icon: Zap,
      availability: 30,
    },
    
    // Products
    {
      id: '4',
      name: 'Eco-Friendly Water Bottle',
      description: 'Reusable stainless steel bottle made from recycled materials',
      cost: 150,
      category: 'products',
      icon: Trophy,
      availability: 10,
      popular: true,
    },
    {
      id: '5',
      name: 'Recycled Phone Case',
      description: 'Protective case made from ocean plastic waste',
      cost: 120,
      category: 'products',
      icon: Smartphone,
      availability: 8,
    },
    {
      id: '6',
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable tee made from 100% organic cotton',
      cost: 200,
      category: 'products',
      icon: Shirt,
      availability: 12,
    },
    
    // Experiences
    {
      id: '7',
      name: 'Eco Workshop Ticket',
      description: 'Learn DIY recycling techniques and upcycling',
      cost: 180,
      category: 'experiences',
      icon: Book,
      availability: 20,
    },
    {
      id: '8',
      name: 'Nature Walk Experience',
      description: 'Guided tour of local recycling facilities',
      cost: 130,
      category: 'experiences',
      icon: Star,
      availability: 15,
      popular: true,
    },
    {
      id: '9',
      name: 'Green Tech Webinar',
      description: 'Online session about sustainable technology',
      cost: 80,
      category: 'experiences',
      icon: Headphones,
      availability: 50,
    },
  ];

  const handleRedeem = (reward: Reward) => {
    if (userGreenCoins >= reward.cost && !redeemedItems.includes(reward.id)) {
      setRedeemedItems([...redeemedItems, reward.id]);
      // In a real app, this would update the user's GreenCoins in the backend
    }
  };

  const canRedeem = (reward: Reward) => {
    return userGreenCoins >= reward.cost && !redeemedItems.includes(reward.id);
  };

  const isRedeemed = (reward: Reward) => {
    return redeemedItems.includes(reward.id);
  };

  const filterRewardsByCategory = (category: string) => {
    return rewards.filter(reward => reward.category === category);
  };

  const RewardCard = ({ reward }: { reward: Reward }) => {
    const Icon = reward.icon;
    
    return (
      <Card className={`relative ${reward.popular ? 'ring-2 ring-primary' : ''}`}>
        {reward.popular && (
          <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
            Popular
          </Badge>
        )}
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">{reward.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">{reward.cost} GC</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {reward.availability} available
                </span>
              </div>
              
              {isRedeemed(reward) ? (
                <Button disabled className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Redeemed
                </Button>
              ) : (
                <Button 
                  onClick={() => handleRedeem(reward)}
                  disabled={!canRedeem(reward)}
                  className="w-full"
                  variant={canRedeem(reward) ? "default" : "secondary"}
                >
                  {canRedeem(reward) ? 'Redeem Now' : 'Insufficient GreenCoins'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/citizen')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Rewards Store 🎁
            </h1>
            <p className="text-muted-foreground">
              Redeem your GreenCoins for amazing eco-friendly rewards
            </p>
          </div>
          
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Coins className="h-6 w-6 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <p className="text-2xl font-bold text-success">{userGreenCoins} GC</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rewards Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vouchers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterRewardsByCategory('vouchers').map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterRewardsByCategory('products').map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experiences" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterRewardsByCategory('experiences').map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Redemption History */}
      {redeemedItems.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Recently Redeemed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redeemedItems.map((itemId) => {
                const reward = rewards.find(r => r.id === itemId);
                if (!reward) return null;
                
                return (
                  <div key={itemId} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">{reward.name}</span>
                    </div>
                    <Badge variant="outline" className="text-success border-success">
                      -{reward.cost} GC
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* How to Earn More */}
      <Card className="mt-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center">
            <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Need More GreenCoins?</h3>
            <p className="text-muted-foreground mb-4">
              Keep recycling to earn more GreenCoins and unlock amazing rewards!
            </p>
            <Button asChild>
              <a href="/citizen/book-pickup">Book Another Pickup</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;
