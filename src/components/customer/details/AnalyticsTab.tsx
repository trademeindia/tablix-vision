
import React from 'react';
import { Customer } from '@/types/customer';
import { Card } from '@/components/ui/card';
import { DollarSign, BarChart2, Clock, Activity, PieChart, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface AnalyticsTabProps {
  customer: Customer;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ customer }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 shadow-sm">
        <h3 className="text-sm font-medium text-slate-500 mb-3">Purchase Metrics</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-blue-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Order Value</span>
                <span className="font-semibold">₹{(customer.avgOrderValue || 450).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-emerald-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Lifetime Value</span>
                <span className="font-semibold">₹{(customer.lifetime_value || 6800).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-amber-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Recent Orders (Last 30 Days)</span>
                <span className="font-semibold">{customer.recent_orders || 5}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 shadow-sm">
        <h3 className="text-sm font-medium text-slate-500 mb-3">Engagement Metrics</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-purple-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Retention Score</span>
                <div className="flex items-center">
                  <span className="font-semibold">{customer.retention_score || 78}</span>
                  <span className="text-xs text-slate-500 ml-1">/100</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1">
                <div 
                  className={`h-1.5 rounded-full ${
                    (customer.retention_score || 78) > 80 ? 'bg-green-500' : 
                    (customer.retention_score || 78) > 50 ? 'bg-amber-500' : 
                    'bg-red-500'
                  }`} 
                  style={{ width: `${customer.retention_score || 78}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <PieChart className="h-5 w-5 text-indigo-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Segment</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.segment === 'vip' 
                    ? 'bg-purple-100 text-purple-800' 
                    : customer.segment === 'frequent' 
                      ? 'bg-amber-100 text-amber-800' 
                      : customer.segment === 'regular' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {customer.segment === 'vip' 
                    ? 'VIP' 
                    : customer.segment?.charAt(0).toUpperCase() + (customer.segment?.slice(1) || 'Regular')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-rose-500 mr-3" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Visit</span>
                <span className="font-semibold">{formatDate(customer.lastVisit || '2023-05-15')}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
