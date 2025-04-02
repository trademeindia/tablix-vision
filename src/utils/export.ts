
/**
 * Utility functions for exporting data
 */

/**
 * Convert array of objects to CSV string
 */
export const convertToCSV = <T extends Record<string, any>>(
  data: T[],
  headers: { key: string; label: string }[]
): string => {
  if (!data.length) return '';
  
  // Create header row
  const headerRow = headers.map(header => `"${header.label}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => 
    headers
      .map(header => {
        const value = item[header.key];
        // Handle different data types and escape quotes
        if (value === null || value === undefined) return '""';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        if (typeof value === 'number' || typeof value === 'boolean') return `"${value}"`;
        return `"${String(value).replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  
  // Combine header and data rows
  return [headerRow, ...rows].join('\n');
};

/**
 * Download data as a CSV file
 */
export const downloadCSV = (csvContent: string, fileName: string): void => {
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  // Add to document, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to CSV and trigger download
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  headers: { key: string; label: string }[],
  fileName: string
): void => {
  const csvContent = convertToCSV(data, headers);
  downloadCSV(csvContent, fileName);
};
