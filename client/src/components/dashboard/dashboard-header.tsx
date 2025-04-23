"use client"

import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardHeaderProps {
  selectedView: string
  setSelectedView: (view: string) => void
}

export function DashboardHeader({ selectedView, setSelectedView }: DashboardHeaderProps) {
  const userName = "Sajibur"
  const greeting = getGreeting()

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

  return (
    <div className="flex flex-col">
      <div className="flex items-center h-16 px-6 border-b border-border">
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
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback className="bg-secondary text-foreground">S</AvatarFallback>
          </Avatar>
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
          <Button variant="outline" className="text-foreground border-border hover:bg-secondary hover:text-foreground">
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
