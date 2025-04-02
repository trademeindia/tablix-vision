
import { useRevenueData } from './use-revenue';
import { useOrderCounts } from './use-orders';
import { usePopularItems } from './use-popular-items';
import { useSalesData } from './use-sales-data';
import { useCustomerDemographics } from './use-demographics';
import { useAverageOrderValue } from './use-average-order';
import { usePeakHoursData } from './use-peak-hours';
import { useAIReport } from './use-ai-report';

export function useAnalytics(restaurantId: string | undefined) {
  const revenueData = useRevenueData(restaurantId);
  const orderCounts = useOrderCounts(restaurantId);
  const { popularItems, popularItemsLoading } = usePopularItems(restaurantId);
  const { salesData, salesDataLoading } = useSalesData(restaurantId);
  const { demographicsData, demographicsLoading } = useCustomerDemographics(restaurantId);
  const { avgOrderData, avgOrderLoading } = useAverageOrderValue(restaurantId);
  const { peakHoursData, peakHoursLoading } = usePeakHoursData(restaurantId);
  const { generateReport } = useAIReport();
  
  const generateReportHandler = async () => {
    return await generateReport(restaurantId);
  };
  
  return {
    revenueData,
    orderCounts,
    popularItems,
    popularItemsLoading,
    salesData,
    salesDataLoading,
    demographicsData,
    demographicsLoading,
    avgOrderData,
    avgOrderLoading,
    peakHoursData,
    peakHoursLoading,
    generateReport: generateReportHandler
  };
}

export * from './use-revenue';
export * from './use-orders';
export * from './use-popular-items';
export * from './use-sales-data';
export * from './use-demographics';
export * from './use-average-order';
export * from './use-peak-hours';
export * from './use-ai-report';
