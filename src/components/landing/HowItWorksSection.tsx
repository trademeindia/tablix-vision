
import React from 'react';
import { Upload, Utensils, QrCode, Rocket } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, icon, iconBg, title, description }) => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left group">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className={`w-16 h-16 rounded-xl ${iconBg} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg">
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
      icon: <Upload className="h-8 w-8 text-white" />,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      title: "Quick Setup",
      description: "Sign up, enter your restaurant details, and connect your payment gateway in under 15 minutes."
    },
    {
      icon: <Utensils className="h-8 w-8 text-white" />,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      title: "Create Your Digital Menu",
      description: "Add categories, menu items, descriptions, prices, and upload images or 3D models."
    },
    {
      icon: <QrCode className="h-8 w-8 text-white" />,
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
      title: "Generate QR Codes",
      description: "Create unique QR codes for each table and easily print them for your restaurant."
    },
    {
      icon: <Rocket className="h-8 w-8 text-white" />,
      iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
      title: "Launch & Grow",
      description: "Place QR codes on tables, start accepting digital orders, and watch your business transform!"
    }
  ];

  return (
    <section id="how-it-works" className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full -ml-48 -mb-48"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Getting Started</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-2">
            Four Simple Steps to Transform Your Restaurant
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Menu 360 is designed for busy restaurant owners - setup is quick and intuitive
          </p>
        </div>
        
        {/* Steps display */}
        <div className="relative">
          {/* Connection line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-gradient-to-r from-blue-500 via-green-500 to-violet-500"></div>
          
          <div className="grid gap-16 lg:gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <Step 
                key={index}
                number={index + 1}
                icon={step.icon}
                iconBg={step.iconBg}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
        
        {/* Demo Request CTA */}
        <div className="mt-16 text-center">
          <a 
            href="/request-demo" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-medium transition-colors group"
          >
            Schedule a personalized demo with our experts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
