import { toast as showToast, ToastOptions } from './use-toast';

interface ToastRecord {
  id: string;
  timestamp: number;
  expirySeconds: number;
}

// Key for localStorage
const TOAST_HISTORY_KEY = 'menu360_toast_history';

// How long to keep toast records in history (default: 1 hour)
const DEFAULT_EXPIRY_SECONDS = 60 * 60;

// Load toast history from localStorage
const loadToastHistory = (): ToastRecord[] => {
  try {
    const rawHistory = localStorage.getItem(TOAST_HISTORY_KEY);
    if (!rawHistory) return [];
    
    const history = JSON.parse(rawHistory) as ToastRecord[];
    
    // Clean up expired records
    const now = Date.now();
    const validHistory = history.filter(record => {
      const expiryMs = record.timestamp + (record.expirySeconds * 1000);
      return expiryMs > now;
    });
    
    // If we removed expired records, update localStorage
    if (validHistory.length !== history.length) {
      localStorage.setItem(TOAST_HISTORY_KEY, JSON.stringify(validHistory));
    }
    
    return validHistory;
  } catch (error) {
    console.error('Error loading toast history:', error);
    return [];
  }
};

// Save a toast record to history
const saveToastToHistory = (id: string, expirySeconds: number = DEFAULT_EXPIRY_SECONDS) => {
  try {
    const history = loadToastHistory();
    
    // Add new record
    const newRecord: ToastRecord = {
      id,
      timestamp: Date.now(),
      expirySeconds
    };
    
    // Add to history and save
    const updatedHistory = [...history, newRecord];
    localStorage.setItem(TOAST_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving toast to history:', error);
  }
};

// Check if a toast has been shown recently
const hasToastBeenShown = (id: string): boolean => {
  try {
    const history = loadToastHistory();
    return history.some(record => record.id === id);
  } catch (error) {
    console.error('Error checking toast history:', error);
    return false;
  }
};

/**
 * Show a toast only if it hasn't been shown recently
 */
export const showToastOnce = (
  id: string, 
  options: ToastOptions,
  expirySeconds: number = DEFAULT_EXPIRY_SECONDS
): void => {
  // Skip if already shown
  if (hasToastBeenShown(id)) {
    return;
  }
  
  // Show toast and save to history
  showToast(options);
  saveToastToHistory(id, expirySeconds);
};

/**
 * Clear all toast history
 */
export const clearToastHistory = (): void => {
  localStorage.removeItem(TOAST_HISTORY_KEY);
};

export const toast = {
  showOnce: showToastOnce,
  clearHistory: clearToastHistory,
  standard: showToast
};

export default toast;
