import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const RateCard = () => {
  const wasteCategories = [
    {
      title: 'Paper Waste',
      items: [
        { name: 'Newspapers', price: '₹8/kg' },
        { name: 'Magazines', price: '₹6/kg' },
        { name: 'Office Paper', price: '₹10/kg' },
        { name: 'Cardboard', price: '₹5/kg' },
      ]
    },
    {
      title: 'Plastic Waste',
      items: [
        { name: 'PET Bottles', price: '₹12/kg' },
        { name: 'Plastic Bags', price: '₹8/kg' },
        { name: 'Hard Plastic', price: '₹15/kg' },
        { name: 'Containers', price: '₹10/kg' },
      ]
    },
    {
      title: 'Metal Waste',
      items: [
        { name: 'Aluminum Cans', price: '₹80/kg' },
        { name: 'Iron Scrap', price: '₹25/kg' },
        { name: 'Copper Wire', price: '₹400/kg' },
        { name: 'Steel Items', price: '₹30/kg' },
      ]
    },
    {
      title: 'E-Waste Collection',
      items: [
        { name: 'Mobile Phones', price: '₹50/piece' },
        { name: 'Laptops', price: '₹200/piece' },
        { name: 'Batteries', price: '₹20/kg' },
        { name: 'Cables', price: '₹15/kg' },
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            Rate Card
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            We Provide the best pricing solutions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {wasteCategories.map((category, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {item.price}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enquire Now Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => {
              // Scroll to contact section or open inquiry form
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                // Trigger inquiry button if contact section doesn't exist
                const inquiryButton = document.querySelector('[data-inquiry-button]');
                if (inquiryButton) {
                  (inquiryButton as HTMLElement).click();
                }
              }
            }}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default RateCard;
