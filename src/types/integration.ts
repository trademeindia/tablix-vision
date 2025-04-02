
export interface IntegrationCredential {
  id: string;
  integration_id: string;
  key: string;
  value: string;
  is_encrypted: boolean;
  created_at: string;
}

export interface IntegrationConfig {
  id: string;
  integration_id: string;
  key: string;
  value: string;
  created_at: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'pos' | 'delivery' | 'analytics' | 'communication' | 'documents' | 'automation' | 'payment' | 'other';
  status: 'connected' | 'not_connected' | 'error' | 'pending';
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  lastSynced?: string;
  syncFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  webhookUrl?: string;
  apiEndpoint?: string;
}

export interface IntegrationData {
  id: string;
  integration_id: string;
  data_type: string;
  data: Record<string, any>;
  external_id?: string;
  created_at: string;
  updated_at: string;
}

export type SyncDirection = 'import' | 'export' | 'bidirectional';

export interface SyncConfig {
  entity: string;
  direction: SyncDirection;
  mappings: Record<string, string>;
  filters?: Record<string, any>;
  enabled: boolean;
}
