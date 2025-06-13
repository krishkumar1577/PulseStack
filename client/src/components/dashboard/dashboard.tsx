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
import { ActivityProvider } from "@/contexts/activity-context"
import { EventProvider } from "@/contexts/event-context"
import { FolderProvider } from "@/contexts/folder-context"
import { FileProvider } from "@/contexts/file-context"
import FilesPage from "@/components/pages/files-page"

export function Dashboard() {
  const [selectedView, setSelectedView] = useState<string>("overview")
  const [chatOpen, setChatOpen] = useState<boolean>(false)

  return (
    <FolderProvider>
      <FileProvider>
        <ActivityProvider>
          <EventProvider>
            <div className="flex min-h-screen">
              <DashboardSidebar selectedView={selectedView} setSelectedView={setSelectedView} />
              <div className="flex flex-col flex-1 ml-16">
                <DashboardHeader selectedView={selectedView} setSelectedView={setSelectedView} />

                {selectedView === "overview" && <DashboardContent setSelectedView={setSelectedView} />}
                {selectedView === "activity" && <ActivityPage />}
                {selectedView === "goals" && <GoalsPage />}
                {selectedView === "ai-planner" && <AIPlannerPage />}
                {selectedView === "calendar" && <CalendarPage />}
                {selectedView === "settings" && <SettingsPage />}
                {selectedView === "files" && <FilesPage />}
              </div>

              <ChatWidget isOpen={chatOpen} setIsOpen={setChatOpen} />
            </div>
          </EventProvider>
        </ActivityProvider>
      </FileProvider>
    </FolderProvider>
  )
}
