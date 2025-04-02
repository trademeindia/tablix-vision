
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const NotificationsPage = () => {
  const [settings, setSettings] = useState({
    orderNotifications: true,
    reservationAlerts: true,
    staffMessages: true,
    marketingUpdates: false,
    systemAlerts: true,
    lowInventoryAlerts: true,
    customerFeedback: true,
    financialAlerts: false,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notification Settings</h1>
        <p className="text-slate-500">Configure your notification preferences</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose which notifications you receive via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="orderNotifications">New Order Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when new orders are placed
              </p>
            </div>
            <Switch
              id="orderNotifications"
              checked={settings.orderNotifications}
              onCheckedChange={() => handleToggle('orderNotifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reservationAlerts">Reservation Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new and changed reservations
              </p>
            </div>
            <Switch
              id="reservationAlerts"
              checked={settings.reservationAlerts}
              onCheckedChange={() => handleToggle('reservationAlerts')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="staffMessages">Staff Messages</Label>
              <p className="text-sm text-muted-foreground">
                Receive staff communication and updates
              </p>
            </div>
            <Switch
              id="staffMessages"
              checked={settings.staffMessages}
              onCheckedChange={() => handleToggle('staffMessages')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingUpdates">Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get insights on marketing campaign performance
              </p>
            </div>
            <Switch
              id="marketingUpdates"
              checked={settings.marketingUpdates}
              onCheckedChange={() => handleToggle('marketingUpdates')}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
          <CardDescription>
            Configure operational alerts and system notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="systemAlerts">System Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Critical system alerts and maintenance notifications
              </p>
            </div>
            <Switch
              id="systemAlerts"
              checked={settings.systemAlerts}
              onCheckedChange={() => handleToggle('systemAlerts')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="lowInventoryAlerts">Low Inventory Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when inventory items are running low
              </p>
            </div>
            <Switch
              id="lowInventoryAlerts"
              checked={settings.lowInventoryAlerts}
              onCheckedChange={() => handleToggle('lowInventoryAlerts')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="customerFeedback">Customer Feedback</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about customer reviews and feedback
              </p>
            </div>
            <Switch
              id="customerFeedback"
              checked={settings.customerFeedback}
              onCheckedChange={() => handleToggle('customerFeedback')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="financialAlerts">Financial Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get important financial notifications and reports
              </p>
            </div>
            <Switch
              id="financialAlerts"
              checked={settings.financialAlerts}
              onCheckedChange={() => handleToggle('financialAlerts')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings}>Save Changes</Button>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
