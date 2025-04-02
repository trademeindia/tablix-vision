
import { generateAIAnalyticsReport } from '@/services/analyticsService';

export function useAIReport() {
  const generateReport = async (restaurantId: string | undefined) => {
    return await generateAIAnalyticsReport(restaurantId || '');
  };

  return { generateReport };
}
