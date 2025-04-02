
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Image, Send } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  campaignName: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  campaignText: z.string().min(10, {
    message: "Campaign text must be at least 10 characters.",
  }),
  scheduledDate: z.date({
    required_error: "A scheduled date is required.",
  }),
  scheduledTime: z.string().refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  campaignImage: z.string().optional(),
  platforms: z.object({
    facebook: z.boolean().default(false),
    instagram: z.boolean().default(false),
    twitter: z.boolean().default(false),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CampaignFormProps {
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<FormValues>;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ 
  onSubmit, 
  isSubmitting = false, 
  defaultValues = {}
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignName: '',
      campaignText: '',
      scheduledDate: new Date(),
      scheduledTime: '12:00',
      campaignImage: '',
      platforms: {
        facebook: false,
        instagram: false,
        twitter: false,
      },
      ...defaultValues,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="campaignName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Summer Special Offer" {...field} />
              </FormControl>
              <FormDescription>
                A unique name to identify your campaign
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="campaignText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Text</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enjoy 20% off on all main courses this weekend!" 
                  className="resize-none h-24"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                The main content of your campaign post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Scheduled Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="campaignImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <div className="flex">
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => {}}
                    title="Upload Image"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Add an image to your campaign post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardContent className="pt-6">
            <FormLabel className="mb-3 block">Social Media Platforms</FormLabel>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="platforms.facebook"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Facebook</FormLabel>
                      <FormDescription>
                        Post this campaign to your Facebook page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="platforms.instagram"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Instagram</FormLabel>
                      <FormDescription>
                        Post this campaign to your Instagram account
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="platforms.twitter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Twitter</FormLabel>
                      <FormDescription>
                        Post this campaign to your Twitter account
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Create Campaign
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CampaignForm;
