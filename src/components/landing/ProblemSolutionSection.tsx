
import React from 'react';
import { AlertTriangle, Clock, FileEdit, TrendingDown, CheckCircle, ArrowRightLeft } from 'lucide-react';

interface PainPointProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const PainPoint: React.FC<PainPointProps> = ({ icon, title, text }) => (
  <div className="flex items-start space-x-4 p-5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all hover:translate-y-[-2px]">
    <div className="mt-1 text-red-400 bg-red-500/10 p-2 rounded-lg">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-medium mb-1">{title}</h4>
      <p className="text-slate-300 text-sm">{text}</p>
    </div>
  </div>
);

const SolutionPoint: React.FC<PainPointProps> = ({ icon, title, text }) => (
  <div className="flex items-start space-x-4 p-5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all hover:translate-y-[-2px]">
    <div className="mt-1 text-green-400 bg-green-500/10 p-2 rounded-lg">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-medium mb-1">{title}</h4>
      <p className="text-slate-300 text-sm">{text}</p>
    </div>
  </div>
);

const ProblemSolutionSection: React.FC = () => {
  return (
    <section id="problem-solution" className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.03]"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-4 text-slate-300">
            <ArrowRightLeft className="h-4 w-4 mr-2 text-primary-400" />
            <span>Problem → Solution</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Modern Restaurant Challenges, <span className="text-primary-400">Solved</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Traditional restaurant systems are holding you back. Menu 360 transforms your operational pain points into smooth, efficient processes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Pain Points Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-red-400 flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              Common Challenges
            </h3>
            <div className="space-y-4">
              <PainPoint
                icon={<AlertTriangle size={20} />}
                title="Order Errors"
                text="Manual order errors costing you money and frustrating customers"
              />
              <PainPoint 
                icon={<Clock size={20} />}
                title="Slow Service"
                text="Customers waiting for physical menus and printed bills"
              />
              <PainPoint 
                icon={<FileEdit size={20} />}
                title="Menu Updates"
                text="Menu updates slow, costly and wasteful with printed menus"
              />
              <PainPoint 
                icon={<TrendingDown size={20} />}
                title="Missing Insights"
                text="Lack of data to make informed business decisions"
              />
            </div>
          </div>

          {/* Solution Column */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-green-400 flex items-center">
              <CheckCircle size={20} className="mr-2" /> 
              Menu 360 Solutions
            </h3>
            <div className="space-y-4">
              <SolutionPoint
                icon={<CheckCircle size={20} />}
                title="Error-Free Digital Orders"
                text="Digital ordering with instant kitchen notifications eliminates errors"
              />
              <SolutionPoint 
                icon={<CheckCircle size={20} />}
                title="Accelerated Service"
                text="QR code menus and mobile payments speed up service by 32%"
              />
              <SolutionPoint 
                icon={<CheckCircle size={20} />}
                title="Instant Menu Updates"
                text="Update your menu instantly on all devices with a single click"
              />
              <SolutionPoint 
                icon={<CheckCircle size={20} />}
                title="Data-Driven Decisions"
                text="Real-time analytics dashboard for data-driven decisions"
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg font-medium text-primary-400">
            Menu 360 is designed specifically for restaurants like yours, replacing chaos with control.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
