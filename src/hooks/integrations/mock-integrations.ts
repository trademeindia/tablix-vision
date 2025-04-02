
import { Integration } from '@/types/integration';
import { 
  ShoppingBag, 
  Truck, 
  BarChart, 
  MessageCircle, 
  FileText, 
  Workflow, 
  Smartphone,
  Utensils,
  CreditCard
} from 'lucide-react';

// Mock integrations for demo purposes
export function getMockIntegrations(): Integration[] {
  console.log('Creating mock integrations');
  const mockIntegrations: Integration[] = [
    {
      id: 'pos1',
      name: 'Square POS',
      description: 'Point of Sale system',
      category: 'pos',
      status: 'connected',
      icon: ShoppingBag,
      lastSynced: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      syncFrequency: 'realtime'
    },
    {
      id: 'delivery1',
      name: 'Zomato',
      description: 'Food delivery platform',
      category: 'delivery',
      status: 'connected',
      icon: Utensils,
      lastSynced: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      syncFrequency: 'hourly'
    },
    {
      id: 'delivery2',
      name: 'Swiggy',
      description: 'Food delivery platform',
      category: 'delivery',
      status: 'connected',
      icon: Truck,
      lastSynced: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      syncFrequency: 'hourly'
    },
    {
      id: 'automation1',
      name: 'n8n',
      description: 'Workflow automation',
      category: 'automation',
      status: 'connected',
      icon: Workflow,
      lastSynced: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      syncFrequency: 'daily'
    },
    {
      id: 'payment1',
      name: 'PayU Money',
      description: 'Payment gateway',
      category: 'payment',
      status: 'connected',
      icon: CreditCard,
      lastSynced: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
      syncFrequency: 'hourly'
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
  
  console.log(`Generated ${mockIntegrations.length} mock integrations`);
  return mockIntegrations;
}
