
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
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
        <Utensils className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-primary tracking-tight">{title}</h1>
      <p className="text-slate-600 mt-2 text-lg">{subtitle}</p>
    </div>
  );
};

export default WelcomeSection;
