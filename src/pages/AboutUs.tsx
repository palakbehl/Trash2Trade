import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Leaf, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart,
  Recycle,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Environmental Impact',
      description: 'We are committed to reducing waste and promoting sustainable practices for a greener future.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building strong communities through collaborative waste management and recycling initiatives.'
    },
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'Maintaining the highest standards of trust and transparency in all our operations.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to make recycling more efficient and rewarding.'
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Tons Recycled', icon: Recycle },
    { value: '100,000+', label: 'Active Users', icon: Users },
    { value: '500+', label: 'Cities Covered', icon: Globe },
    { value: '₹10M+', label: 'Rewards Distributed', icon: Award }
  ];

  const team = [
    {
      name: 'Palak Behl',
      role: 'CEO & Founder',
      description: 'Environmental engineer with expertise in sustainable waste management solutions and circular economy.',
      avatar: 'PB'
    },
    {
      name: 'Priyanshi Baria',
      role: 'CTO',
      description: 'Tech innovator specializing in AI-driven recycling platforms and mobile applications.',
      avatar: 'PB'
    },
    {
      name: 'Teesha Gokulgandhi',
      role: 'Head of Operations',
      description: 'Operations expert focused on logistics optimization and collector network management.',
      avatar: 'TG'
    },
    {
      name: 'Meet Parmar',
      role: 'Head of Community',
      description: 'Community engagement specialist driving user adoption and environmental awareness.',
      avatar: 'MP'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-nature relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
          <div className="absolute top-32 right-20 w-16 h-16 bg-secondary/30 rounded-full animate-bounce" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-success/25 rounded-full animate-pulse" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-eco rounded-full animate-glow">
                <Leaf className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="bg-gradient-eco bg-clip-text text-transparent">Trash2Trade</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to revolutionize waste management through technology, 
              community engagement, and innovative reward systems that make recycling profitable and impactful.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="bg-gradient-eco text-white border-0 shadow-glow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-12 w-12 mr-4" />
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg leading-relaxed">
                  To create a sustainable ecosystem where waste becomes a valuable resource, 
                  empowering communities to participate in the circular economy while earning 
                  rewards for their environmental contributions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-forest text-white border-0 shadow-glow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Globe className="h-12 w-12 mr-4" />
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg leading-relaxed">
                  A world where zero waste is achievable through technology-driven solutions, 
                  community collaboration, and innovative business models that make 
                  sustainability profitable for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="bg-gradient-eco bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do at Trash2Trade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-glow hover:-translate-y-2 transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="bg-gradient-eco w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="bg-gradient-eco bg-clip-text text-transparent">Impact</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real numbers that showcase the positive change we're creating together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-eco">
                  <CardContent className="p-8">
                    <div className="bg-gradient-eco w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-sunshine">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our <span className="bg-gradient-forest bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              The passionate individuals driving change in waste management and sustainability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-glow hover:-translate-y-2 transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-glow">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-foreground mb-6">
                    Our <span className="bg-gradient-eco bg-clip-text text-transparent">Story</span>
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="mb-6">
                    Trash2Trade was born from a simple observation: while India generates over 62 million tons of waste annually, 
                    less than 60% is collected and even less is properly recycled. We saw an opportunity to bridge this gap 
                    through technology and community engagement.
                  </p>
                  <p className="mb-6">
                    Founded in 2023 by a team of environmental engineers and tech innovators, we started with a vision to make 
                    waste management profitable for everyone involved. From citizens who segregate waste to collectors who 
                    transport it, and businesses that process it - everyone should benefit from the circular economy.
                  </p>
                  <p className="mb-6">
                    Today, we're proud to have created a platform that not only makes recycling convenient but also rewarding. 
                    Our users have collectively diverted thousands of tons of waste from landfills, earned substantial rewards, 
                    and built stronger, more sustainable communities.
                  </p>
                  <p>
                    We're just getting started. Our goal is to expand across India and eventually globally, creating a world 
                    where waste is viewed as a resource and sustainability is profitable for all.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
