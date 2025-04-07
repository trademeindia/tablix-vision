
import React from 'react';
import { Utensils } from 'lucide-react';

interface WelcomeSectionProps {
  title?: string;
  subtitle?: string;
}

const WelcomeSection = ({ 
  title = "Menu 360",
  subtitle = "The Complete Restaurant Management Platform"
}: WelcomeSectionProps) => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-5 shadow-md">
        <Utensils className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{title}</h1>
      <p className="text-slate-600 mt-3 text-lg max-w-md mx-auto">{subtitle}</p>
    </div>
  );
};

export default WelcomeSection;
