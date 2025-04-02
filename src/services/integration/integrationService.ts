
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

export const getIntegrations = async (restaurantId: string): Promise<Integration[]> => {
  try {
    // In a real app, this would fetch from Supabase
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) throw error;
    return data as Integration[];
  } catch (error) {
    console.error('Error fetching integrations:', error);
    throw error;
  }
};

export const getIntegrationById = async (id: string): Promise<Integration> => {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Integration;
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
    const { data, error } = await supabase
      .from('integrations')
      .insert([
        { 
          restaurant_id: restaurantId,
          name: integration.name,
          description: integration.description,
          category: integration.category,
          status: 'not_connected',
          api_endpoint: integration.apiEndpoint,
          webhook_url: integration.webhookUrl
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    return data as Integration;
  } catch (error) {
    console.error('Error creating integration:', error);
    throw error;
  }
};

export const updateIntegration = async (
  integration: UpdateIntegrationRequest
): Promise<Integration> => {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .update({ 
        name: integration.name,
        description: integration.description,
        category: integration.category,
        status: integration.status,
        api_endpoint: integration.apiEndpoint,
        webhook_url: integration.webhookUrl,
        sync_frequency: integration.syncFrequency
      })
      .eq('id', integration.id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Integration;
  } catch (error) {
    console.error(`Error updating integration with id ${integration.id}:`, error);
    throw error;
  }
};

export const deleteIntegration = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting integration with id ${id}:`, error);
    throw error;
  }
};

export const saveIntegrationCredential = async (
  credential: SaveCredentialRequest
): Promise<IntegrationCredential> => {
  try {
    const { data, error } = await supabase
      .from('integration_credentials')
      .insert([credential])
      .select()
      .single();
      
    if (error) throw error;
    return data as IntegrationCredential;
  } catch (error) {
    console.error('Error saving integration credential:', error);
    throw error;
  }
};

export const saveIntegrationConfig = async (
  config: SaveConfigRequest
): Promise<IntegrationConfig> => {
  try {
    const { data, error } = await supabase
      .from('integration_configs')
      .insert([config])
      .select()
      .single();
      
    if (error) throw error;
    return data as IntegrationConfig;
  } catch (error) {
    console.error('Error saving integration config:', error);
    throw error;
  }
};

export const saveSyncConfig = async (
  request: SaveSyncConfigRequest
): Promise<SyncConfig> => {
  try {
    const { data, error } = await supabase
      .from('integration_sync_configs')
      .insert([{
        integration_id: request.integration_id,
        config: request.syncConfig
      }])
      .select()
      .single();
      
    if (error) throw error;
    return data.config as SyncConfig;
  } catch (error) {
    console.error('Error saving sync config:', error);
    throw error;
  }
};

export const triggerSync = async (syncRequest: SyncRequest): Promise<void> => {
  try {
    // In a real app, this would call an Edge Function to handle the sync
    await supabase.functions.invoke('trigger-integration-sync', {
      body: syncRequest,
    });
  } catch (error) {
    console.error('Error triggering sync:', error);
    throw error;
  }
};
