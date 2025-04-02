
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme, ThemeColors } from '@/hooks/use-theme';
import { RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const ColorPreview = ({ color }: { color: string }) => (
  <div 
    className="w-6 h-6 rounded-full border border-gray-300 mr-2" 
    style={{ backgroundColor: color }}
  />
);

const ThemeSettings = () => {
  const { theme, setTheme, isLoading, resetToDefault } = useTheme();
  const [formTheme, setFormTheme] = useState<ThemeColors>(theme);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = (key: keyof ThemeColors, value: string) => {
    setFormTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setTheme(formTheme);
      toast({
        title: "Theme updated",
        description: "Your theme settings have been saved successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    await resetToDefault();
    setFormTheme(theme);
    toast({
      title: "Theme reset",
      description: "Theme has been reset to default settings",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Theme Settings</CardTitle>
        <CardDescription>
          Customize your restaurant's theme colors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-md mb-4">
          <p className="text-sm font-medium mb-2">Preview</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(formTheme).map(([key, value]) => (
              <div key={key} className="flex items-center mr-4">
                <ColorPreview color={value} />
                <span className="text-xs capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {Object.entries(formTheme).map(([key, value]) => (
          <div key={key} className="grid gap-2">
            <Label htmlFor={key} className="capitalize">{key}</Label>
            <div className="flex gap-2">
              <ColorPreview color={value} />
              <Input
                id={key}
                type="text"
                value={value}
                onChange={(e) => handleChange(key as keyof ThemeColors, e.target.value)}
                className="flex-1"
                placeholder={`Enter ${key} color (hex, rgb, etc.)`}
              />
              <Input
                type="color"
                value={value}
                onChange={(e) => handleChange(key as keyof ThemeColors, e.target.value)}
                className="w-12 p-1 h-10"
              />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isSaving || isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save Theme
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThemeSettings;
