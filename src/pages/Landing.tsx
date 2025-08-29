import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Recycle, 
  Coins, 
  MapPin, 
  Users, 
  Leaf, 
  TrendingUp,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-section">
      {/* Contact Info Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Open Hours: Mon-Sun 8:00 am-9:00 pm
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email: info.trash2trade@gmail.com
            </span>
          </div>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address: Tech Park, Innovation Drive, Mumbai, 560091
          </span>
        </div>
      </div>

      {/* Hero Carousel Section */}
      <section className="relative bg-gradient-hero min-h-[500px] flex items-center">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8 text-white">
            <div className="space-y-2">
              <p className="text-accent font-medium tracking-wide uppercase text-sm">
                Waste Pickup
              </p>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Reviving waste, sustaining our planet.
              </h1>
              <p className="text-xl max-w-2xl mx-auto opacity-90">
                Earn cash from your trash, and turn discarded materials into valuable resources.
              </p>
            </div>
            
            <div className="pt-4">
              <Link to="/signup">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {/* Service 1 */}
            <div className="text-center space-y-4">
              <p className="text-primary font-medium tracking-wide uppercase text-sm">
                Waste Pickup
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                From landfill to life-cycle brilliance.
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Unlock the potential in waste by converting it into cash. Embrace recycling, earn rewards, It's a win-win for you and the planet!
              </p>
              <div className="pt-4">
                <Button variant="eco-outline" size="lg">
                  Read More
                </Button>
              </div>
            </div>

            {/* Service 2 */}
            <div className="text-center space-y-4">
              <p className="text-primary font-medium tracking-wide uppercase text-sm">
                Waste Pickup
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Recycle today for a cleaner tomorrow.
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Contribute to a cleaner environment while turning trash into valuable resources for a sustainable future.
              </p>
              <div className="pt-4">
                <Button variant="eco-outline" size="lg">
                  Read More
                </Button>
              </div>
            </div>

            {/* Service 3 */}
            <div className="text-center space-y-4">
              <p className="text-primary font-medium tracking-wide uppercase text-sm">
                Waste Pickup
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Transforming waste into a resource treasure.
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transforming waste into cash is a sustainable choice for both the environment and your wallet.
              </p>
              <div className="pt-4">
                <Button variant="eco-outline" size="lg">
                  Read More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Your Service Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Book Your Service Now</h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "E-Waste Collection",
                description: "From landfill to life-cycle brilliance. Unlock the potential in waste by converting it into cash.",
                icon: <Recycle className="h-12 w-12 text-primary mb-4" />
              },
              {
                title: "Residential Waste",
                description: "Recycle today for a cleaner tomorrow. Contribute to a cleaner environment while turning trash into valuable resources.",
                icon: <Leaf className="h-12 w-12 text-primary mb-4" />
              },
              {
                title: "Corporate Solutions",
                description: "Transforming waste into a resource treasure. A sustainable choice for both the environment and your wallet.",
                icon: <TrendingUp className="h-12 w-12 text-primary mb-4" />
              }
            ].map((service, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-card transition-shadow bg-background">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center">
                    {service.icon}
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Impact</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of eco-warriors making a difference in their communities.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '10,000+', label: 'Active Users', icon: Users },
              { value: '50,000kg', label: 'Waste Recycled', icon: Recycle },
              { value: '25+', label: 'Cities Covered', icon: MapPin },
              { value: '₹2L+', label: 'Earned by Users', icon: Coins }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of eco-warriors who are already making a difference. 
              Start your recycling journey today.
            </p>
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-3"
              >
                Request A Pickup
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;