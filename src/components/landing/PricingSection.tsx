
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaLink: string;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  description,
  features,
  isPopular,
  ctaText,
  ctaLink
}) => {
  return (
    <div className={`
      bg-white rounded-xl border shadow-sm p-6
      ${isPopular ? 'border-primary shadow-md ring-1 ring-primary' : 'border-slate-200'}
    `}>
      {isPopular && (
        <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="mt-4 mb-2">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-sm text-slate-500 ml-1">/ month</span>
      </div>
      <p className="text-slate-600 mb-6">{description}</p>
      
      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <span className="text-slate-700">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button 
        asChild 
        variant={isPopular ? "default" : "outline"} 
        className="w-full"
      >
        <Link to={ctaLink}>{ctaText}</Link>
      </Button>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const pricingTiers = [
    {
      name: "Starter",
      price: "₹1,999",
      description: "Perfect for small cafes and food trucks.",
      features: [
        "Up to 3 tables with QR codes",
        "Basic menu management",
        "Digital ordering & payments",
        "Email support",
        "1 staff account"
      ],
      ctaText: "Start Free Trial",
      ctaLink: "/request-demo",
    },
    {
      name: "Pro",
      price: "₹3,499",
      description: "Ideal for growing restaurants.",
      features: [
        "Up to 20 tables with QR codes",
        "Advanced menu with 3D models",
        "Real-time analytics dashboard",
        "Priority support",
        "5 staff accounts",
        "Customer loyalty tracking"
      ],
      isPopular: true,
      ctaText: "Start Free Trial",
      ctaLink: "/request-demo",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For restaurant chains and large venues.",
      features: [
        "Unlimited tables with QR codes",
        "Premium 3D menu capabilities",
        "Advanced analytics & integrations",
        "Dedicated account manager",
        "Unlimited staff accounts",
        "Custom branding options",
        "API access"
      ],
      ctaText: "Contact Sales",
      ctaLink: "/contact-sales",
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Simple, Transparent Pricing That Grows With You
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose a plan that suits your business needs with no hidden fees
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            All plans come with a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
