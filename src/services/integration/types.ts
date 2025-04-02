
import { Integration, IntegrationCredential, IntegrationConfig, SyncConfig } from '@/types/integration';

export interface CreateIntegrationRequest {
  name: string;
  description: string;
  category: Integration['category'];
  apiEndpoint?: string;
  webhookUrl?: string;
}

export interface UpdateIntegrationRequest {
  id: string;
  name?: string;
  description?: string;
  category?: Integration['category'];
  status?: Integration['status'];
  apiEndpoint?: string;
  webhookUrl?: string;
  syncFrequency?: Integration['syncFrequency'];
}

export interface SaveCredentialRequest {
  integration_id: string;
  key: string;
  value: string;
  is_encrypted: boolean;
}

export interface SaveConfigRequest {
  integration_id: string;
  key: string;
  value: string;
}

export interface SaveSyncConfigRequest {
  integration_id: string;
  syncConfig: SyncConfig;
}

export interface SyncRequest {
  integration_id: string;
  entity?: string;
  direction?: 'import' | 'export';
}
