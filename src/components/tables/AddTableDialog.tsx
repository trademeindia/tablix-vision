
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface AddTableDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTable: (table: {
    number: number;
    seats: number;
    section?: string;
  }) => void;
  sections: string[];
}

const AddTableDialog: React.FC<AddTableDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddTable,
  sections
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      number: '',
      seats: '4',
      section: sections.length > 0 ? sections[0] : '',
    }
  });

  const selectedSection = watch('section');

  React.useEffect(() => {
    if (isOpen) {
      reset({
        number: '',
        seats: '4',
        section: sections.length > 0 ? sections[0] : '',
      });
    }
  }, [isOpen, reset, sections]);

  const onSubmit = (data: any) => {
    try {
      const tableData = {
        number: parseInt(data.number),
        seats: parseInt(data.seats),
        section: data.section || undefined
      };
      
      onAddTable(tableData);
      onOpenChange(false);
      toast({
        title: "Table added successfully",
        description: `Table ${tableData.number} has been added.`,
      });
    } catch (error) {
      console.error('Error adding table:', error);
      toast({
        title: "Failed to add table",
        description: "An error occurred while adding the table.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
          <DialogDescription>
            Enter the details for the new table.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="number">Table Number *</Label>
              <Input 
                id="number"
                type="number"
                placeholder="Enter table number"
                min="1"
                required
                {...register('number', { required: true })}
              />
              {errors.number && (
                <p className="text-red-500 text-sm">Table number is required</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="seats">Seats *</Label>
              <Input 
                id="seats" 
                type="number"
                placeholder="Number of seats"
                min="1" 
                max="20"
                required
                {...register('seats', { required: true, min: 1, max: 20 })}
              />
            </div>
            
            {sections.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={selectedSection}
                  onValueChange={(value) => setValue('section', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Table
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTableDialog;
