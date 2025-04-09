
import React from 'react';
import { Upload, Utensils, QrCode, Rocket, ArrowRight } from 'lucide-react';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ number, icon, title, description, isLast = false }) => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left relative">
      <div className="flex items-center justify-center mb-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
          <div className="text-primary">{icon}</div>
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
          {number}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-slate-300">{description}</p>
      
      {!isLast && (
        <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-primary/40 to-transparent">
          <ArrowRight className="absolute right-0 top-[-8px] text-primary/40" size={16} />
        </div>
      )}
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Setup & Connect",
      description: "Sign up, configure your restaurant basics, and securely connect your payment gateway in minutes."
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Build Your Digital Menu",
      description: "Easily add categories, items, descriptions, pricing, and upload stunning visuals including 3D models."
    },
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "Generate QR Codes",
      description: "Create unique QR codes for each table and download them for printing. Place them on tables for customers to scan."
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Go Live & Thrive",
      description: "Start accepting seamless digital orders and payments! Monitor performance and grow your business with data insights."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.03]"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-4 text-slate-300">
            <Rocket className="h-4 w-4 mr-2 text-primary-400" />
            <span>Implementation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Simple Setup, <span className="text-primary-400">Powerful Results</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Get started with Menu 360 in just four easy steps and transform your restaurant operations
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid gap-8 md:gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Step 
              key={index}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
        
        {/* Mobile-only progress indicator */}
        <div className="md:hidden flex justify-center mt-8">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div key={index} className={`h-2 w-8 rounded-full ${index === steps.length - 1 ? 'bg-primary' : 'bg-primary/40'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
