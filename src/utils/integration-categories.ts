
// Helper function to get a human-readable category name
export function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'pos': 'POS Systems',
    'delivery': 'Food Delivery',
    'payment': 'Payment',
    'analytics': 'Analytics',
    'communication': 'Communication',
    'documents': 'Documents',
    'automation': 'Automation',
    'other': 'Other'
  };
  
  return categoryMap[category] || category;
}
