
import { saveAs } from 'file-saver';

interface HeaderConfig {
  key: string;
  label: string;
}

/**
 * Export data to CSV file
 * @param data Array of objects to export
 * @param headers Configuration for CSV headers
 * @param fileName Name of the file to download
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  headers: HeaderConfig[] = [],
  fileName: string = 'export.csv'
): void {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }

  try {
    // If no headers are provided, use object keys
    if (!headers.length) {
      const sampleKeys = Object.keys(data[0]);
      headers = sampleKeys.map(key => ({ key, label: key }));
    }

    // Create CSV header row
    const headerRow = headers.map(h => `"${h.label}"`).join(',');
    
    // Create data rows
    const dataRows = data.map(item => {
      return headers
        .map(header => {
          let cellValue = item[header.key];
          
          // Handle complex objects or null/undefined
          if (cellValue === null || cellValue === undefined) {
            return '""';
          } else if (typeof cellValue === 'object') {
            cellValue = JSON.stringify(cellValue);
          }
          
          // Escape quotes and wrap in quotes
          return `"${String(cellValue).replace(/"/g, '""')}"`;
        })
        .join(',');
    });
    
    // Combine header and data rows
    const csvContent = [headerRow, ...dataRows].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
    
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
}
