import React from 'react'
import { Dashboard } from '@/components/dashboard/dashboard'
import { ProtectedRoute } from '@/components/auth/protected-route'

function page() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}

export default page
