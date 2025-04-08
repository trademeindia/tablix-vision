
import React from 'react';
import { QrCode, FileEdit, Receipt, PieChart, CreditCard, Smartphone, Medal, Users, Globe } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientStart: string;
  gradientEnd: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradientStart, gradientEnd }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${gradientStart} to-${gradientEnd} group-hover:h-2 transition-all duration-300`}></div>
      <div className={`bg-gradient-to-br from-${gradientStart}/10 to-${gradientEnd}/10 text-${gradientStart} p-3 rounded-lg inline-block mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <QrCode size={24} />,
      title: "Effortless QR Ordering & Payment",
      description: "Boost table turnover and delight guests. Customers scan, browse your stunning visual menu, order, and pay securely via their phone.",
      gradientStart: "primary",
      gradientEnd: "blue-600"
    },
    {
      icon: <FileEdit size={24} />,
      title: "Dynamic Digital Menus",
      description: "Update items, prices, photos, and even 3D models instantly. Reflect specials and mark unavailable items with a click.",
      gradientStart: "violet-500",
      gradientEnd: "purple-600"
    },
    {
      icon: <Receipt size={24} />,
      title: "Automated Invoicing & Billing",
      description: "Eliminate manual bill calculation. Invoices are generated automatically and presented digitally for faster checkout.",
      gradientStart: "emerald-500",
      gradientEnd: "green-600"
    },
    {
      icon: <PieChart size={24} />,
      title: "Centralized Control & Insights",
      description: "Manage staff, track orders in real-time, view table status, and understand sales trends – all from one intuitive dashboard.",
      gradientStart: "amber-500",
      gradientEnd: "orange-600"
    },
    {
      icon: <CreditCard size={24} />,
      title: "Flexible & Secure Payments",
      description: "Integrate with UPI, PayTM, and other popular Indian payment methods. All transactions are handled securely.",
      gradientStart: "cyan-500",
      gradientEnd: "blue-600"
    },
    {
      icon: <Smartphone size={24} />,
      title: "Perfect Mobile Experience",
      description: "Looks and works beautifully on any device – perfectly optimized for the smartphone-first Indian customer base.",
      gradientStart: "rose-500",
      gradientEnd: "pink-600"
    },
    {
      icon: <Medal size={24} />,
      title: "Built for India",
      description: "Localized for Indian cuisine types, language support for regional languages, and optimized for local internet connectivity.",
      gradientStart: "amber-500",
      gradientEnd: "yellow-600"
    },
    {
      icon: <Users size={24} />,
      title: "Superior Customer Support",
      description: "24/7 dedicated support team based in India, ensuring you get immediate help whenever you need it.",
      gradientStart: "teal-500",
      gradientEnd: "green-600"
    },
    {
      icon: <Globe size={24} />,
      title: "Auto-SEO & Social Integration",
      description: "Automatic SEO for your digital menu and seamless social media marketing tools built specifically for restaurant promotion.",
      gradientStart: "blue-500",
      gradientEnd: "indigo-600"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Powerful Features</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-2">
            Transform Your Restaurant Experience
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
              gradientStart={feature.gradientStart}
              gradientEnd={feature.gradientEnd}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
