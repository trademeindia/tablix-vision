
import React from 'react';
import { QrCode, FileEdit, Receipt, PieChart, CreditCard, Smartphone } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <QrCode size={24} />,
      title: "Effortless QR Ordering & Payment",
      description: "Boost table turnover and delight guests. Customers scan, browse your stunning visual menu, order, and pay securely via their phone."
    },
    {
      icon: <FileEdit size={24} />,
      title: "Dynamic Digital Menus",
      description: "Update items, prices, photos, and even 3D models instantly. Reflect specials and mark unavailable items with a click."
    },
    {
      icon: <Receipt size={24} />,
      title: "Automated Invoicing & Billing",
      description: "Eliminate manual bill calculation. Invoices are generated automatically and presented digitally for faster checkout."
    },
    {
      icon: <PieChart size={24} />,
      title: "Centralized Control & Insights",
      description: "Manage staff, track orders in real-time, view table status, and understand sales trends – all from one intuitive dashboard."
    },
    {
      icon: <CreditCard size={24} />,
      title: "Flexible & Secure Payments",
      description: "Integrate your preferred payment gateway seamlessly. All transactions are handled securely via Supabase Edge Functions."
    },
    {
      icon: <Smartphone size={24} />,
      title: "Designed for Mobile",
      description: "Looks and works beautifully on any device – phones, tablets, desktops. Provide a modern experience wherever your customers or staff are."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Unlock Efficiency & Elevate Your Guest Experience
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From first impression to final payment, Menu 360 enhances every aspect of your restaurant operation.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
