
import React from 'react';
import { Customer } from '@/types/customer';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface PreferencesTabProps {
  customer: Customer;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({ customer }) => {
  return (
    <Card className="p-4 shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Dietary Preferences</h3>
          <div className="flex flex-wrap gap-1">
            {customer.preferences?.dietary?.length ? (
              customer.preferences.dietary.map((pref, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {pref}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">No dietary preferences specified</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Seating Preference</h3>
          <p>{customer.preferences?.seating || 'No preference specified'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Favorite Items</h3>
          <div className="flex flex-wrap gap-1">
            {customer.favorite_items?.length ? (
              customer.favorite_items.map((item, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                  <Heart className="h-3 w-3 mr-1" />
                  {item}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">No favorite items yet</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Communication Preference</h3>
          <p>{customer.preferences?.communication || 'Not specified'}</p>
        </div>
      </div>
    </Card>
  );
};

export default PreferencesTab;
