
import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  BarChart, 
  MessageCircle, 
  FileText, 
  Workflow, 
  Smartphone,
  Utensils
} from 'lucide-react';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'pos' | 'delivery' | 'analytics' | 'communication' | 'documents' | 'automation' | 'other';
  status: 'connected' | 'not_connected';
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  lastSynced?: string;
}

// This hook would fetch real integration data from the API in a production app
export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIntegrations = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // const { data } = await supabase.from('integrations').select('*');
        
        // Sample data for demonstration
        const sampleIntegrations: Integration[] = [
          {
            id: 'pos1',
            name: 'Square POS',
            description: 'Point of Sale system',
            category: 'pos',
            status: 'connected',
            icon: ShoppingBag,
            lastSynced: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
          },
          {
            id: 'delivery1',
            name: 'Zomato',
            description: 'Food delivery platform',
            category: 'delivery',
            status: 'connected',
            icon: Utensils,
            lastSynced: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
          },
          {
            id: 'delivery2',
            name: 'Swiggy',
            description: 'Food delivery platform',
            category: 'delivery',
            status: 'connected',
            icon: Truck,
            lastSynced: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
          },
          {
            id: 'automation1',
            name: 'n8n',
            description: 'Workflow automation',
            category: 'automation',
            status: 'connected',
            icon: Workflow,
            lastSynced: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
          },
          {
            id: 'comm1',
            name: 'WhatsApp Business',
            description: 'Customer messaging',
            category: 'communication',
            status: 'not_connected',
            icon: MessageCircle
          }
        ];
        
        // Add a slight delay to simulate network request
        setTimeout(() => {
          setIntegrations(sampleIntegrations);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching integrations:', error);
        setIsLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  return { integrations, isLoading };
}
