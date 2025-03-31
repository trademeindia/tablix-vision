
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { transactionService } from '@/services/menu/transactionService';
import { supabase } from '@/integrations/supabase/client';

// Mock the fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the Supabase auth method
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'mock-access-token'
          }
        }
      })
    },
    functions: {
      url: 'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1'
    }
  }
}));

describe('transactionService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    vi.clearAllMocks();
  });

  describe('beginTransaction', () => {
    it('should successfully begin a transaction', async () => {
      // Setup the mock response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Transaction started' })
      });

      // Call the function
      const result = await transactionService.beginTransaction();

      // Verify the result
      expect(result).toEqual({ success: true, message: 'Transaction started' });
      
      // Verify fetch was called with the correct URL and headers
      expect(mockFetch).toHaveBeenCalledWith(
        'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1/database-transactions/begin_transaction',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-access-token'
          })
        })
      );
    });

    it('should throw error when fetch response is not ok', async () => {
      // Setup the mock response to return an error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      // Call the function and expect it to throw
      await expect(transactionService.beginTransaction()).rejects.toThrow('Failed to begin transaction');
    });
  });

  describe('commitTransaction', () => {
    it('should successfully commit a transaction', async () => {
      // Setup the mock response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Transaction committed' })
      });

      // Call the function
      const result = await transactionService.commitTransaction();

      // Verify the result
      expect(result).toEqual({ success: true, message: 'Transaction committed' });
      
      // Verify fetch was called with the correct URL
      expect(mockFetch).toHaveBeenCalledWith(
        'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1/database-transactions/commit_transaction',
        expect.anything()
      );
    });
  });

  describe('rollbackTransaction', () => {
    it('should successfully rollback a transaction', async () => {
      // Setup the mock response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Transaction rolled back' })
      });

      // Call the function
      const result = await transactionService.rollbackTransaction();

      // Verify the result
      expect(result).toEqual({ success: true, message: 'Transaction rolled back' });
      
      // Verify fetch was called with the correct URL
      expect(mockFetch).toHaveBeenCalledWith(
        'https://qofbpjdbmisyxysfcyeb.supabase.co/functions/v1/database-transactions/rollback_transaction',
        expect.anything()
      );
    });
  });
});
