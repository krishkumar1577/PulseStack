"use client"

import { Search, Bell, LogOut, Settings, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface DashboardHeaderProps {
  selectedView: string
  setSelectedView: (view: string) => void
}

export function DashboardHeader({ selectedView, setSelectedView }: DashboardHeaderProps) {
  const userName = "krish"
  const greeting = getGreeting()
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Task Assigned",
      description: "You have been assigned a new task in the PulseStack project",
      time: "2 min ago",
      unread: true,
      type: "task"
    },
    {
      id: 2,
      title: "Goal Achieved",
      description: "Congratulations! You've completed your weekly goal",
      time: "1 hour ago",
      unread: true,
      type: "achievement"
    },
    {
      id: 3,
      title: "Meeting Reminder",
      description: "Team meeting starting in 15 minutes",
      time: "10 min ago",
      unread: false,
      type: "reminder"
    }
  ])

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getPageTitle = () => {
    switch (selectedView) {
      case "overview":
        return "Overview"
      case "activity":
        return "Activity"
      case "goals":
        return "Goals & Habits"
      case "ai-planner":
        return "AI Planner"
      case "calendar":
        return "Calendar"
      case "files":
        return "Files"
      case "settings":
        return "Settings"
      default:
        return "Overview"
    }
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })))
  }

  const handleNotificationClick = (id: number) => {
    // Mark the clicked notification as read
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ))
    
    // Handle navigation based on notification type
    const notification = notifications.find(n => n.id === id)
    if (notification) {
      switch (notification.type) {
        case 'task':
          setSelectedView('activity')
          break
        case 'achievement':
          setSelectedView('goals')
          break
        case 'reminder':
          setSelectedView('calendar')
          break
      }
    }
  }

  const handleProfileClick = () => {
    setSelectedView('settings')
  }

  const handleSettingsClick = () => {
    setSelectedView('settings')
  }

  // Function to get unread count
  const getUnreadCount = () => notifications.filter(n => n.unread).length

  return (
    <div className="flex flex-col">
      <div className="flex items-center h-16 px-6 border-bborder">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
              <span className="text-sm font-bold text-primary-foreground">PS</span>
            </div>
            <span className="text-foreground font-semibold">PulseStack</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <NavItem
              label="Overview"
              active={selectedView === "overview"}
              onClick={() => setSelectedView("overview")}
            />
            <NavItem
              label="Activity"
              active={selectedView === "activity"}
              onClick={() => setSelectedView("activity")}
            />
            <NavItem label="Goals" active={selectedView === "goals"} onClick={() => setSelectedView("goals")} />
            <NavItem
              label="AI Planner"
              active={selectedView === "ai-planner"}
              onClick={() => setSelectedView("ai-planner")}
            />
            <NavItem
              label="Calendar"
              active={selectedView === "calendar"}
              onClick={() => setSelectedView("calendar")}
            />
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={handleMarkAllAsRead}>
                  Mark all as read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4" onClick={() => handleNotificationClick(notification.id)}>
                  <div className="flex w-full items-start gap-2">
                    <div className={`mt-1 h-2 w-2 rounded-full ${notification.unread ? 'bg-orange-500' : 'bg-transparent'}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="w-full text-center text-sm">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                  <AvatarFallback className="bg-secondary text-foreground">{userName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-6 py-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {userName}
          </h1>
        </div>
        <p className="text-muted-foreground">Stay on top of your tasks, monitor progress, and track status.</p>
      </div>

      <div className="px-6 py-4 bg-card rounded-lg mx-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <div className="flex-1">
            <p className="text-foreground">
              PulseStack AI is now available. Access your activity and timeline instantly with our brand-new dashboard.
            </p>
          </div>
          <Button variant="outline" className="text-foregroundborder hover:bg-secondary hover:text-foreground">
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  label: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ label, active = false, onClick }: NavItemProps) {
  return (
    <button
      className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
