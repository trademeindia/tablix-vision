
import { supabase } from '@/integrations/supabase/client';
import { Integration, IntegrationCredential, IntegrationConfig, SyncConfig } from '@/types/integration';
import { 
  CreateIntegrationRequest, 
  UpdateIntegrationRequest,
  SaveCredentialRequest,
  SaveConfigRequest,
  SaveSyncConfigRequest,
  SyncRequest
} from './types';

// Note: Since 'integrations' table doesn't exist in schema yet, these are mock implementations
export const getIntegrations = async (restaurantId: string): Promise<Integration[]> => {
  try {
    console.log('Mocked getIntegrations for restaurant:', restaurantId);
    // In a real implementation, this would query the database
    // For now, return an empty array since we'll use mock data from the hook
    return [];
  } catch (error) {
    console.error('Error fetching integrations:', error);
    throw error;
  }
};

export const getIntegrationById = async (id: string): Promise<Integration> => {
  try {
    console.log('Mocked getIntegrationById with id:', id);
    // In a real implementation, this would query the database
    throw new Error('Integration not found');
  } catch (error) {
    console.error(`Error fetching integration with id ${id}:`, error);
    throw error;
  }
};

export const createIntegration = async (
  restaurantId: string, 
  integration: CreateIntegrationRequest
): Promise<Integration> => {
  try {
    console.log('Mocked createIntegration for restaurant:', restaurantId, integration);
    
    // Return a mock integration
    return {
      id: Math.random().toString(36).substring(2, 15),
      name: integration.name,
      description: integration.description,
      category: integration.category,
      status: 'not_connected',
      apiEndpoint: integration.apiEndpoint,
      webhookUrl: integration.webhookUrl
    };
  } catch (error) {
    console.error('Error creating integration:', error);
    throw error;
  }
};

export const updateIntegration = async (
  integration: UpdateIntegrationRequest
): Promise<Integration> => {
  try {
    console.log('Mocked updateIntegration:', integration);
    
    // Return a mock updated integration
    return {
      id: integration.id,
      name: integration.name || 'Unknown',
      description: integration.description || 'No description',
      category: integration.category || 'other',
      status: integration.status || 'not_connected',
      apiEndpoint: integration.apiEndpoint,
      webhookUrl: integration.webhookUrl,
      syncFrequency: integration.syncFrequency
    };
  } catch (error) {
    console.error(`Error updating integration with id ${integration.id}:`, error);
    throw error;
  }
};

export const deleteIntegration = async (id: string): Promise<void> => {
  try {
    console.log('Mocked deleteIntegration for id:', id);
    // In a real implementation, this would delete from the database
  } catch (error) {
    console.error(`Error deleting integration with id ${id}:`, error);
    throw error;
  }
};

export const saveIntegrationCredential = async (
  credential: SaveCredentialRequest
): Promise<IntegrationCredential> => {
  try {
    console.log('Mocked saveIntegrationCredential:', credential);
    
    // Return a mock credential
    return {
      id: Math.random().toString(36).substring(2, 15),
      integration_id: credential.integration_id,
      key: credential.key,
      value: credential.value,
      is_encrypted: credential.is_encrypted,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving integration credential:', error);
    throw error;
  }
};

export const saveIntegrationConfig = async (
  config: SaveConfigRequest
): Promise<IntegrationConfig> => {
  try {
    console.log('Mocked saveIntegrationConfig:', config);
    
    // Return a mock config
    return {
      id: Math.random().toString(36).substring(2, 15),
      integration_id: config.integration_id,
      key: config.key,
      value: config.value,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving integration config:', error);
    throw error;
  }
};

export const saveSyncConfig = async (
  request: SaveSyncConfigRequest
): Promise<SyncConfig> => {
  try {
    console.log('Mocked saveSyncConfig:', request);
    
    // Return the provided sync config 
    return request.syncConfig;
  } catch (error) {
    console.error('Error saving sync config:', error);
    throw error;
  }
};

export const triggerSync = async (syncRequest: SyncRequest): Promise<void> => {
  try {
    console.log('Mocked triggerSync for integration:', syncRequest);
    // In a real implementation, this would call an Edge Function
    await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
  } catch (error) {
    console.error('Error triggering sync:', error);
    throw error;
  }
};
