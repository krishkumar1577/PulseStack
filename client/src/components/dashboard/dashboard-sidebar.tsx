"use client"

import type React from "react"
import { Calendar, Folder, Home, Settings, Sun, Moon, BarChart2, Target, Brain } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  selectedView: string
  setSelectedView: (view: string) => void
}

export function DashboardSidebar({ selectedView, setSelectedView }: DashboardSidebarProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (view: string) => {
    setSelectedView(view)

    // Optional: Add route navigation if you want to use Next.js routing
    // switch(view) {
    //   case "overview": router.push("/dashboard"); break;
    //   case "activity": router.push("/dashboard/activity"); break;
    //   case "goals": router.push("/dashboard/goals"); break;
    //   case "ai-planner": router.push("/dashboard/ai-planner"); break;
    //   case "calendar": router.push("/dashboard/calendar"); break;
    //   case "files": router.push("/dashboard/files"); break;
    //   case "settings": router.push("/dashboard/settings"); break;
    // }
  }

  return (
    <div className="hidden md:flex flex-col w-16 bg-card border-r border-border">
      <div className="flex justify-center py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
          <span className="text-lg font-bold text-primary-foreground">PS</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 mt-8">
        <SidebarIcon icon={<Sun className="h-5 w-5" />} active={theme === "light"} onClick={() => setTheme("dark")} />
        <SidebarIcon icon={<Moon className="h-5 w-5" />} active={theme === "dark"} onClick={() => setTheme("light")} />
      </div>

      <div className="flex flex-col items-center gap-6 mt-8">
        <SidebarIcon
          icon={<Home className="h-5 w-5" />}
          active={selectedView === "overview"}
          onClick={() => handleNavigation("overview")}
          tooltip="Overview"
        />
        <SidebarIcon
          icon={<BarChart2 className="h-5 w-5" />}
          active={selectedView === "activity"}
          onClick={() => handleNavigation("activity")}
          tooltip="Activity"
        />
        <SidebarIcon
          icon={<Target className="h-5 w-5" />}
          active={selectedView === "goals"}
          onClick={() => handleNavigation("goals")}
          tooltip="Goals & Habits"
        />
        <SidebarIcon
          icon={<Brain className="h-5 w-5" />}
          active={selectedView === "ai-planner"}
          onClick={() => handleNavigation("ai-planner")}
          tooltip="AI Planner"
        />
        <SidebarIcon
          icon={<Calendar className="h-5 w-5" />}
          active={selectedView === "calendar"}
          onClick={() => handleNavigation("calendar")}
          tooltip="Calendar"
        />
        <SidebarIcon
          icon={<Folder className="h-5 w-5" />}
          active={selectedView === "files"}
          onClick={() => handleNavigation("files")}
          tooltip="Files"
        />
      </div>

      <div className="mt-auto flex flex-col items-center gap-6 mb-8">
        <SidebarIcon
          icon={<Settings className="h-5 w-5" />}
          active={selectedView === "settings"}
          onClick={() => handleNavigation("settings")}
          tooltip="Settings"
        />
      </div>
    </div>
  )
}

interface SidebarIconProps {
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
  tooltip?: string
}

function SidebarIcon({ icon, active = false, onClick, tooltip }: SidebarIconProps) {
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full",
          active ? "bg-secondary text-white" : "text-muted-foreground hover:bg-secondary hover:text-white",
        )}
        onClick={onClick}
      >
        {icon}
      </Button>

      {tooltip && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          {tooltip}
        </div>
      )}
    </div>
  )
}
