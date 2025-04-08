
import React from 'react';
import { AlertTriangle, Clock, Printer, TrendingDown, Check, Shield, DownloadCloud, IndianRupee, Zap, PieChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';

interface PainPointProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const PainPoint: React.FC<PainPointProps> = ({ icon, title, text }) => (
  <Card className="p-4 border-red-200 bg-gradient-to-br from-white to-red-50 hover:shadow-md transition-all">
    <div className="flex items-start space-x-3">
      <div className="mt-0.5 text-red-500 bg-red-100 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-slate-700 text-sm">{text}</p>
      </div>
    </div>
  </Card>
);

const SolutionPoint: React.FC<PainPointProps> = ({ icon, title, text }) => (
  <Card className="p-4 border-green-200 bg-gradient-to-br from-white to-green-50 hover:shadow-md transition-all">
    <div className="flex items-start space-x-3">
      <div className="mt-0.5 text-green-600 bg-green-100 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-slate-700 text-sm">{text}</p>
      </div>
    </div>
  </Card>
);

const ProblemSolutionSection: React.FC = () => {
  return (
    <section id="problem-solution" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Challenges & Solutions</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-2">
            Common Restaurant Challenges in India & How Menu 360 Solves Them
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Modern restaurants in Delhi, Mumbai, Bangalore and beyond face unique challenges in today's competitive market
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
          {/* Pain Points Column */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold mb-6 text-red-600 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> 
              <span>Common Industry Challenges</span>
            </h3>
            <PainPoint
              icon={<AlertTriangle size={20} />}
              title="Human Error in Order Taking"
              text="Manual order errors create 12% revenue loss and frustrate valuable customers"
            />
            <PainPoint 
              icon={<Clock size={20} />}
              title="Slow Table Turnover"
              text="Customers waiting 8-15 minutes for menus and bills, reducing revenue potential"
            />
            <PainPoint 
              icon={<Printer size={20} />}
              title="Costly Menu Updates"
              text="Menu updates cost ₹5,000-15,000 per print cycle with seasonal changes"
            />
            <PainPoint 
              icon={<TrendingDown size={20} />}
              title="Limited Business Insights"
              text="No data analytics to track popular items, peak hours, and customer preferences"
            />
          </div>

          {/* Solution Column */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold mb-6 text-green-700 flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              <span>The Menu 360 Advantage</span>
            </h3>
            <SolutionPoint
              icon={<Shield size={20} />}
              title="Error-Free Digital Ordering"
              text="100% accurate orders with instant kitchen notifications, eliminating mistakes"
            />
            <SolutionPoint 
              icon={<IndianRupee size={20} />}
              title="Increased Revenue & Faster Service"
              text="QR menus and mobile payments speed up service by 32%, boosting daily revenue"
            />
            <SolutionPoint 
              icon={<DownloadCloud size={20} />}
              title="Instant Menu Updates"
              text="Update prices, images, and offerings across all devices with a single click"
            />
            <SolutionPoint 
              icon={<PieChart size={20} />}
              title="Data-Driven Decisions"
              text="Comprehensive analytics dashboard for smarter inventory and marketing choices"
            />
          </div>
        </div>
        
        <div className="text-center mt-12 p-6 rounded-lg bg-gradient-to-r from-primary/10 to-blue-500/10 max-w-3xl mx-auto">
          <p className="text-lg font-medium text-slate-800">
            Menu 360 is designed specifically for <span className="text-primary">Indian restaurants</span>, replacing chaos with control and boosting profitability.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
