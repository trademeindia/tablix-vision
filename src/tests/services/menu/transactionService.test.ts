
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { transactionService } from '@/services/menu/transactionService';
import { supabase } from '@/integrations/supabase/client';

// Mock the fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock setTimeout
vi.mock('timers', () => ({
  setTimeout: vi.fn((callback, ms) => {
    callback();
    return 123; // Mock timer id
  })
}));

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
    
    // Reset console mocks after each test
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console mocks
    vi.restoreAllMocks();
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
      
      // Verify that retry logic was not invoked
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should retry when fetch response is not ok', async () => {
      // Setup the mock responses for retries
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: () => Promise.resolve('Database error')
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: () => Promise.resolve('Database error')
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Transaction started' })
        });

      // Call the function
      const result = await transactionService.beginTransaction();

      // Verify the result
      expect(result).toEqual({ success: true, message: 'Transaction started' });
      
      // Verify fetch was called multiple times
      expect(mockFetch).toHaveBeenCalledTimes(3);
      
      // Verify that warnings were logged
      expect(console.warn).toHaveBeenCalledTimes(2);
    });

    it('should fail after maximum retries', async () => {
      // Setup all mock responses to fail
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        text: () => Promise.resolve('Service temporarily unavailable')
      });

      // Call the function and expect it to throw
      await expect(transactionService.beginTransaction()).rejects.toThrow();
      
      // Verify fetch was called the maximum number of times (initial + retries)
      expect(mockFetch).toHaveBeenCalledTimes(4);
      
      // Verify that warnings and error were logged
      expect(console.warn).toHaveBeenCalledTimes(3);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
    
    it('should throw error when auth session is missing', async () => {
      // Mock auth session to return null
      vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
        data: { session: null },
        error: null
      });
      
      // Call the function and expect it to throw
      await expect(transactionService.beginTransaction()).rejects.toThrow('Authentication required');
      
      // Verify fetch was not called
      expect(mockFetch).not.toHaveBeenCalled();
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
      
      // Verify it was only called once (no retries)
      expect(mockFetch).toHaveBeenCalledTimes(1);
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
      
      // Verify it was only called once (no retries)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
