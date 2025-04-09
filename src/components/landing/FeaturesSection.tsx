
import React from 'react';
import { QrCode, FileEdit, Receipt, PieChart, CreditCard, Smartphone, Users, Database, Bell, DollarSign } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:translate-y-[-5px] group">
      <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary-400 p-3 rounded-lg inline-block mb-4 group-hover:from-primary/30 group-hover:to-purple-500/30 transition-colors">
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
    <section id="features" className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.03]"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-4 text-slate-300">
            <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-primary-400"></span>
            <span>Core Functionality</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Elevate Your Operations with <span className="text-primary-400">Powerful Features</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            From first impression to final payment, Menu 360 enhances every aspect of your restaurant management.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
