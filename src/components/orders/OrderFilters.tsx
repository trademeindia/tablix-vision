
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, SortAsc, SortDesc } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface OrderFiltersProps {
  filters: {
    status: string;
    startDate: string;
    endDate: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  };
  onFilterChange: (filters: Partial<OrderFiltersProps['filters']>) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'served', label: 'Served' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Order Date' },
    { value: 'total_amount', label: 'Order Amount' },
    { value: 'customer_name', label: 'Customer Name' },
  ];

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      onFilterChange({ startDate: date.toISOString() });
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      onFilterChange({ endDate: date.toISOString() });
    }
  };

  const toggleSortDirection = () => {
    onFilterChange({ sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      startDate: '',
      endDate: '',
      sortBy: 'created_at',
      sortDirection: 'desc'
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => onFilterChange({ status: value })}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(new Date(filters.startDate), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate ? new Date(filters.startDate) : undefined}
                  onSelect={handleStartDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(new Date(filters.endDate), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate ? new Date(filters.endDate) : undefined}
                  onSelect={handleEndDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="sort-by">Sort By</Label>
            <div className="flex gap-2">
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => onFilterChange({ sortBy: value })}
              >
                <SelectTrigger id="sort-by" className="flex-1">
                  <SelectValue placeholder="Order Date" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleSortDirection}
                title={filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              >
                {filters.sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderFilters;
