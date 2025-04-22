
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Platform settings have been updated successfully.",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage platform-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input id="platformName" defaultValue="Harmony" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" defaultValue="admin@harmony.example" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" defaultValue="support@harmony.example" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input id="contactPhone" defaultValue="(555) 123-4567" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platformDescription">Platform Description</Label>
                <Textarea 
                  id="platformDescription" 
                  rows={4}
                  defaultValue="Harmony is a platform that connects users with beauty and wellness services in their area."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the platform look and feel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode by default</p>
                  </div>
                  <Switch id="darkMode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowUserThemes">User Theme Selection</Label>
                    <p className="text-sm text-muted-foreground">Allow users to choose their preferred theme</p>
                  </div>
                  <Switch id="allowUserThemes" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                      <div 
                        key={color}
                        className="h-10 rounded-md cursor-pointer border-2 border-transparent hover:border-black"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure platform security options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch id="twoFactorAuth" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="captcha">CAPTCHA on Forms</Label>
                    <p className="text-sm text-muted-foreground">Require CAPTCHA on registration and contact forms</p>
                  </div>
                  <Switch id="captcha" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoLogout">Auto Logout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                  </div>
                  <Switch id="autoLogout" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inactivityTimeout">Inactivity Timeout (minutes)</Label>
                  <Input id="inactivityTimeout" type="number" defaultValue="30" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system-wide notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifs">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send system notifications via email</p>
                  </div>
                  <Switch id="emailNotifs" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifs">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send system notifications via SMS</p>
                  </div>
                  <Switch id="smsNotifs" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="adminAlerts">Admin Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send alerts for important system events</p>
                  </div>
                  <Switch id="adminAlerts" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Manage third-party service integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentGateway">Payment Gateway</Label>
                    <p className="text-sm text-muted-foreground">Enable payment processing</p>
                  </div>
                  <Switch id="paymentGateway" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="googleAnalytics">Google Analytics</Label>
                    <p className="text-sm text-muted-foreground">Track website traffic and user behavior</p>
                  </div>
                  <Switch id="googleAnalytics" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="socialLogin">Social Login</Label>
                    <p className="text-sm text-muted-foreground">Allow login with social media accounts</p>
                  </div>
                  <Switch id="socialLogin" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="apiKey" defaultValue="sk_test_51N9X8dSI•••••••••••••••••" type="password" />
                    <Button variant="outline">Reset</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
