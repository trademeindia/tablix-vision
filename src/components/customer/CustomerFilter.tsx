
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, CalendarIcon, Filter, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CustomerFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  dateFilter: Date | null;
  setDateFilter: (date: Date | null) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
}

const CustomerFilter: React.FC<CustomerFilterProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  clearFilters,
  activeFiltersCount
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="pl-8 pr-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-slate-500 pt-2">
              Status
            </DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => setStatusFilter('active')}
              className="gap-2"
            >
              {statusFilter === 'active' && <Check className="h-4 w-4" />}
              <span className={statusFilter === 'active' ? "font-medium" : ""}>Active</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setStatusFilter('inactive')}
              className="gap-2"
            >
              {statusFilter === 'inactive' && <Check className="h-4 w-4" />}
              <span className={statusFilter === 'inactive' ? "font-medium" : ""}>Inactive</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setStatusFilter(null)}
              className="gap-2"
            >
              {statusFilter === null && <Check className="h-4 w-4" />}
              <span className={statusFilter === null ? "font-medium" : ""}>All</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-slate-500">
              Last Visit Date
            </DropdownMenuLabel>
            <div className="p-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFilter && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter || undefined}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <div className="p-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomerFilter;
