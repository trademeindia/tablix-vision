
import React from 'react';
import { Upload, Utensils, QrCode, Rocket } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, icon, title, description }) => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
            {number}
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Upload className="h-6 w-6 text-primary" />,
      title: "Setup & Connect",
      description: "Sign up, configure your restaurant basics, and securely connect your payment gateway in minutes."
    },
    {
      icon: <Utensils className="h-6 w-6 text-primary" />,
      title: "Build Your Digital Menu",
      description: "Easily add categories, items, descriptions, prices, and upload stunning visuals including 3D models."
    },
    {
      icon: <QrCode className="h-6 w-6 text-primary" />,
      title: "Generate QR Codes",
      description: "Create unique QR codes for each table and download them for printing."
    },
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Go Live & Thrive",
      description: "Place QR codes on tables and start accepting seamless digital orders and payments!"
    }
  ];

  return (
    <section id="how-it-works" className="bg-slate-50 py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Simple Setup, Powerful Results
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Get started with Menu 360 in just four easy steps
          </p>
        </div>
        
        <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Step 
              key={index}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        <div className="mt-16 mx-auto max-w-4xl overflow-hidden rounded-xl shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
            alt="Restaurant management interface" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
