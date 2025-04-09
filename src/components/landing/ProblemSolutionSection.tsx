
import React from 'react';
import { AlertTriangle, Clock, Printer, TrendingDown, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PainPointProps {
  icon: React.ReactNode;
  text: string;
}

const PainPoint: React.FC<PainPointProps> = ({ icon, text }) => (
  <div className="flex items-start space-x-3">
    <div className="mt-0.5 text-red-500">
      {icon}
    </div>
    <p className="text-slate-700">{text}</p>
  </div>
);

const SolutionPoint: React.FC<PainPointProps> = ({ icon, text }) => (
  <div className="flex items-start space-x-3">
    <div className="mt-0.5 text-green-600">
      {icon}
    </div>
    <p className="text-slate-700">{text}</p>
  </div>
);

const ProblemSolutionSection: React.FC = () => {
  return (
    <section id="problem-solution" className="bg-slate-50 py-16 md:py-24 relative">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Restaurant staff working" 
          className="object-cover h-full w-full"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Overwhelmed by Operations? Losing Orders? Falling Behind?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Modern restaurants face modern challenges. See how Menu 360 solves them all in one platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
          {/* Pain Points Column */}
          <div className="bg-white rounded-xl p-6 border border-red-100 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-red-600">Common Restaurant Challenges</h3>
            <div className="space-y-5">
              <PainPoint
                icon={<AlertTriangle size={20} />}
                text="Manual order errors costing you money and frustrating customers"
              />
              <PainPoint 
                icon={<Clock size={20} />}
                text="Customers waiting for physical menus and printed bills"
              />
              <PainPoint 
                icon={<Printer size={20} />}
                text="Menu updates slow, costly and wasteful with printed menus"
              />
              <PainPoint 
                icon={<TrendingDown size={20} />}
                text="Lack of data to make informed business decisions"
              />
            </div>
          </div>

          {/* Solution Column */}
          <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-green-700">The Menu 360 Solution</h3>
            <div className="space-y-5">
              <SolutionPoint
                icon={<Check size={20} />}
                text="Digital ordering with instant kitchen notifications eliminates errors"
              />
              <SolutionPoint 
                icon={<Check size={20} />}
                text="QR code menus and mobile payments speed up service by 32%"
              />
              <SolutionPoint 
                icon={<Check size={20} />}
                text="Update your menu instantly on all devices with a single click"
              />
              <SolutionPoint 
                icon={<Check size={20} />}
                text="Real-time analytics dashboard for data-driven decisions"
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg font-medium text-primary">
            Menu 360 is designed specifically for restaurants like yours, replacing chaos with control.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
