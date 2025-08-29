import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Star,
  Leaf,
  Recycle,
  Users,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockEcoScoreData, badges } from '@/data/mockData';

const EcoScore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'citizen') {
    return <div>Access denied</div>;
  }

  const currentScore = user.ecoScore || 0;
  const nextLevelScore = Math.ceil(currentScore / 20) * 20 + 20;
  const progressToNext = ((currentScore % 20) / 20) * 100;

  const achievements = [
    {
      title: 'First Pickup',
      description: 'Completed your first waste pickup',
      points: 10,
      earned: true,
      icon: Recycle,
    },
    {
      title: 'Eco Warrior',
      description: 'Reached 50 eco score points',
      points: 15,
      earned: currentScore >= 50,
      icon: Trophy,
    },
    {
      title: 'Community Helper',
      description: 'Helped 10 neighbors with pickups',
      points: 20,
      earned: false,
      icon: Users,
    },
    {
      title: 'Monthly Champion',
      description: 'Top performer this month',
      points: 25,
      earned: false,
      icon: Star,
    },
  ];

  const impactStats = [
    {
      label: 'Waste Recycled',
      value: '45.2 kg',
      icon: Recycle,
      color: 'text-success',
    },
    {
      label: 'CO₂ Saved',
      value: '12.8 kg',
      icon: Leaf,
      color: 'text-green-600',
    },
    {
      label: 'Pickups Completed',
      value: '8',
      icon: Calendar,
      color: 'text-primary',
    },
    {
      label: 'Community Rank',
      value: '#23',
      icon: Trophy,
      color: 'text-warning',
    },
  ];

  const levelBenefits = [
    { level: 'Eco Newbie', range: '0-19', benefits: ['Basic rewards', 'Community access'] },
    { level: 'Green Citizen', range: '20-39', benefits: ['Priority pickup slots', '5% bonus GreenCoins'] },
    { level: 'Eco Warrior', range: '40-59', benefits: ['Exclusive rewards', '10% bonus GreenCoins'] },
    { level: 'Green Champion', range: '60-79', benefits: ['Premium rewards', '15% bonus GreenCoins', 'Beta features'] },
    { level: 'Planet Protector', range: '80-99', benefits: ['VIP support', '20% bonus GreenCoins', 'Special recognition'] },
    { level: 'Eco Legend', range: '100+', benefits: ['All benefits', 'Leadership opportunities', 'Custom rewards'] },
  ];

  const getCurrentLevel = (score: number) => {
    if (score >= 100) return levelBenefits[5];
    if (score >= 80) return levelBenefits[4];
    if (score >= 60) return levelBenefits[3];
    if (score >= 40) return levelBenefits[2];
    if (score >= 20) return levelBenefits[1];
    return levelBenefits[0];
  };

  const currentLevel = getCurrentLevel(currentScore);
  const nextLevel = getCurrentLevel(nextLevelScore);

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
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Eco Score 🌱
        </h1>
        <p className="text-muted-foreground">
          Track your environmental impact and unlock new achievements
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Score */}
          <Card className="bg-gradient-to-br from-primary/10 to-success/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-full mb-4">
                  <Trophy className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-primary mb-2">{currentScore}</h2>
                <p className="text-lg font-medium text-foreground mb-1">{currentLevel.level}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  {nextLevelScore - currentScore} points to {nextLevel.level}
                </p>
                
                <div className="max-w-sm mx-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to next level</span>
                    <span>{Math.round(progressToNext)}%</span>
                  </div>
                  <Progress value={progressToNext} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score History Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Score Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockEcoScoreData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="month" 
                      className="text-muted-foreground"
                    />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Impact Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Your Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {impactStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-3">
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-2 ${
                        achievement.earned 
                          ? 'border-success bg-success/5' 
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          achievement.earned ? 'bg-success/20' : 'bg-muted'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            achievement.earned ? 'text-success' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{achievement.title}</h3>
                            {achievement.earned && (
                              <Badge variant="outline" className="text-success border-success">
                                +{achievement.points}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Level Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Level Benefits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="font-medium text-primary mb-1">Current Level</p>
                  <p className="text-sm font-medium">{currentLevel.level}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Score: {currentLevel.range}
                  </p>
                  <ul className="text-xs space-y-1">
                    {currentLevel.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <p className="font-medium mb-1">Next Level</p>
                  <p className="text-sm font-medium">{nextLevel.level}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Score: {nextLevel.range}
                  </p>
                  <ul className="text-xs space-y-1">
                    {nextLevel.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earned Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={`p-3 text-center rounded-lg border ${
                      badge.earned 
                        ? 'border-success bg-success/5' 
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-medium">{badge.name}</p>
                    {!badge.earned && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {badge.requirement} points needed
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips to Improve */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Tips to Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Book regular pickups to maintain consistency</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Sort waste properly for bonus points</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Refer friends to earn community points</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Participate in community challenges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EcoScore;
