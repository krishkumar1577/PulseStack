import { Dashboard } from "@/components/dashboard/dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}

// https://www.behance.net/gallery/217343975/Ai-Task-Management-Dashboard?tracking_source=search_projects|task+management+dashboard&l=10
// https://www.behance.net/gallery/219197249/Task-Management-Dashboard?tracking_source=search_projects|task+management+dashboard&l=0
// https://dribbble.com/shots/23764759-WorkWise-Productivity-Dashboard