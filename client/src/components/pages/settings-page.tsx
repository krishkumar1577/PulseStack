"use client"

import { useState } from "react"
import { Bell, User, Lock, Globe, LayoutPanelLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState({
    name: "krish",
    email: "user@example.com",
    bio: "",
    avatar: "/placeholder-user.jpg",
    notifications: {
      email: true,
      push: true,
      inApp: true
    },
    preferences: {
      language: "en",
      theme: theme as string,
      defaultView: "overview"
    }
  })

  const handleNotificationToggle = (type: "email" | "push" | "inApp") => {
    setUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: newTheme
      }
    }))
  }

  const handleDefaultViewChange = (view: string) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        defaultView: view
      }
    }))
  }

  const handleLanguageChange = (language: string) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        language
      }
    }))
  }

  const handleSaveProfile = () => {
    // TODO: Implement API call to save profile changes
    // POST /api/users/profile
  }

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={user.name}
                      onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={user.bio}
                      onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Control how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive activity updates via email
                    </p>
                  </div>
                  <Switch
                    checked={user.notifications.email}
                    onCheckedChange={() => handleNotificationToggle("email")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified in your browser
                    </p>
                  </div>
                  <Switch
                    checked={user.notifications.push}
                    onCheckedChange={() => handleNotificationToggle("push")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">In-App Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Show notifications in the app
                    </p>
                  </div>
                  <Switch
                    checked={user.notifications.inApp}
                    onCheckedChange={() => handleNotificationToggle("inApp")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how PulseStack looks and works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Select value={user.preferences.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <LayoutPanelLeft className="h-4 w-4" />
                          <span>System</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={user.preferences.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Default View</label>
                  <Select value={user.preferences.defaultView} onValueChange={handleDefaultViewChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="goals">Goals</SelectItem>
                      <SelectItem value="calendar">Calendar</SelectItem>
                      <SelectItem value="ai-planner">AI Planner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Change Password</label>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button variant="outline" className="mt-4">Update Password</Button>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-base font-medium mb-4">Two-Factor Authentication</h3>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
