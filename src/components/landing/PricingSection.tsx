
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, IndianRupee, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  specialFeatures?: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaLink: string;
  gradientClass?: string;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  description,
  features,
  specialFeatures = [],
  isPopular,
  ctaText,
  ctaLink,
  gradientClass = "from-slate-50 to-white"
}) => {
  return (
    <Card className={`
      rounded-xl border shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
      ${isPopular ? 'border-primary shadow-primary/10' : 'border-slate-200'} 
      bg-gradient-to-b ${gradientClass}
    `}>
      {isPopular && (
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-t-xl text-center">
          Most Popular in India
        </div>
      )}
      <div className="p-6 pt-5">
        <h3 className="text-xl font-bold text-slate-800">{name}</h3>
        <div className="mt-4 mb-2 flex items-baseline">
          <IndianRupee className="h-5 w-5 text-primary inline-block" />
          <span className="text-3xl md:text-4xl font-bold text-slate-800">{price}</span>
          <span className="text-sm text-slate-500 ml-1">/ month</span>
        </div>
        <p className="text-slate-600 mb-6">{description}</p>
        
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-slate-700 ml-3 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {specialFeatures.length > 0 && (
          <div className="space-y-3 mb-6 pt-4 border-t border-slate-200">
            <p className="font-semibold text-slate-800 text-sm">Special Features:</p>
            {specialFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Star className="h-3 w-3 text-primary" />
                </div>
                <span className="text-slate-700 ml-3 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          asChild 
          variant={isPopular ? "default" : "outline"} 
          className={`w-full ${isPopular ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white border-none' : 'border-primary text-primary hover:bg-primary/10'}`}
        >
          <Link to={ctaLink}>{ctaText}</Link>
        </Button>
      </div>
    </Card>
  );
};

const PricingSection: React.FC = () => {
  const pricingTiers = [
    {
      name: "Starter",
      price: "1,999",
      description: "Perfect for small cafes and food trucks.",
      features: [
        "Up to 3 tables with QR codes",
        "Basic menu management",
        "Digital ordering & payments",
        "Email support",
        "1 staff account",
        "Basic analytics"
      ],
      ctaText: "Start Free Trial",
      ctaLink: "/request-demo",
      gradientClass: "from-slate-50 to-white"
    },
    {
      name: "Pro",
      price: "3,499",
      description: "Ideal for growing restaurants in India.",
      features: [
        "Up to 20 tables with QR codes",
        "Advanced menu with images",
        "Real-time analytics dashboard",
        "Priority support in Hindi & English",
        "5 staff accounts",
        "Customer loyalty tracking"
      ],
      specialFeatures: [
        "UPI & PayTM integration",
        "Mobile-optimized experience",
        "Social media marketing tools"
      ],
      isPopular: true,
      ctaText: "Start Free Trial",
      ctaLink: "/request-demo",
      gradientClass: "from-blue-50 to-white"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For restaurant chains across India.",
      features: [
        "Unlimited tables with QR codes",
        "Premium 3D menu capabilities",
        "Advanced analytics & integrations",
        "Dedicated account manager in India",
        "Unlimited staff accounts",
        "Custom branding options",
        "API access"
      ],
      specialFeatures: [
        "Multi-location management",
        "Custom payment gateway options",
        "White-label solution"
      ],
      ctaText: "Contact Sales",
      ctaLink: "/contact-sales",
      gradientClass: "from-slate-50 to-white"
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Pricing Plans</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-2">
            Affordable Pricing for Every Restaurant
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose a plan that suits your business needs with no hidden fees
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
        
        <div className="mt-12 text-center bg-slate-50 p-6 rounded-xl max-w-3xl mx-auto border border-slate-100">
          <p className="text-slate-700">
            All plans come with a <span className="font-semibold">14-day free trial</span>. No credit card required.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Prices shown are exclusive of GST. For custom requirements, please contact our sales team.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
