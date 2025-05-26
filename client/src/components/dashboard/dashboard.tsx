"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { ActivityPage } from "@/components/pages/activity-page"
import { GoalsPage } from "@/components/pages/goals-page"
import { AIPlannerPage } from "@/components/pages/ai-planner-page"
import { CalendarPage } from "@/components/pages/calendar-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { ChatWidget } from "@/components/dashboard/chat-widget"

export function Dashboard() {
  const [selectedView, setSelectedView] = useState<string>("overview")
  const [chatOpen, setChatOpen] = useState<boolean>(false)

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar selectedView={selectedView} setSelectedView={setSelectedView} />
      <div className="flex flex-col flex-1 ml-16">
        <DashboardHeader selectedView={selectedView} setSelectedView={setSelectedView} />

        {selectedView === "overview" && <DashboardContent />}
        {selectedView === "activity" && <ActivityPage />}
        {selectedView === "goals" && <GoalsPage />}
        {selectedView === "ai-planner" && <AIPlannerPage />}
        {selectedView === "calendar" && <CalendarPage />}
        {selectedView === "settings" && <SettingsPage />}
      </div>

      <ChatWidget isOpen={chatOpen} setIsOpen={setChatOpen} />
    </div>
  )
}
