
import React from 'react';
import { QrCode, FileEdit, Receipt, PieChart, CreditCard, Smartphone, Users, Database, Bell, DollarSign } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-[#1A1F2C] rounded-xl p-6 border border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
      <div className="bg-[#2A2F3C] text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <QrCode size={24} />,
      title: "QR Code Ordering & Payment",
      description: "Boost table turnover and delight guests. Customers scan, browse your stunning visual menu, order, and pay securely via their phones."
    },
    {
      icon: <FileEdit size={24} />,
      title: "Dynamic Digital Menus",
      description: "Update items, prices, photos, and even 3D models instantly. Reflect specials and mark unavailable items with a single click."
    },
    {
      icon: <Receipt size={24} />,
      title: "Automated Billing",
      description: "Eliminate manual bill calculation. Invoices are generated automatically and presented digitally for faster checkout."
    },
    {
      icon: <PieChart size={24} />,
      title: "Real-time Insights",
      description: "Gain instant visibility into sales trends, menu performance, customer behavior, and operational efficiency metrics."
    },
    {
      icon: <CreditCard size={24} />,
      title: "Secure Payments",
      description: "Integrate your preferred payment gateway seamlessly. All transactions are handled securely via encrypted channels."
    },
    {
      icon: <Smartphone size={24} />,
      title: "Mobile-First Design",
      description: "Looks and works beautifully on any device – phones, tablets, desktops. Provide a modern experience for customers and staff."
    },
    {
      icon: <Users size={24} />,
      title: "Staff Management",
      description: "Assign roles, track performance, manage schedules, and enable role-specific access to waiters, chefs, and managers."
    },
    {
      icon: <Database size={24} />,
      title: "Integrated CRM",
      description: "Collect customer data effortlessly. Track order history, capture preferences, and enable personalized marketing."
    },
    {
      icon: <Bell size={24} />,
      title: "Real-time Notifications",
      description: "Instant alerts for new orders, table service requests, kitchen updates, and important business events."
    },
    {
      icon: <DollarSign size={24} />,
      title: "Loyalty Programs",
      description: "Built-in loyalty points system to reward repeat customers, drive retention, and increase average order value."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#12151E]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Unlock Efficiency & Elevate Your Guest Experience
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
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
