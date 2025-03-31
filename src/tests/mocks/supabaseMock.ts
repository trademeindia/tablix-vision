
import { vi } from 'vitest';

// Create a mock of the Supabase client
export const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  rpc: vi.fn().mockResolvedValue({}),
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: { success: true } })
  },
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: { id: 'test-user-id' }
      },
      error: null
    }),
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: {
          access_token: 'mock-access-token'
        }
      }
    })
  }
};

// Mock the Supabase module
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient
}));
