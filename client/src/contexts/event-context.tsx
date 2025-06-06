import React, { createContext, useContext, useState } from "react"

export interface Event {
  id: number
  title: string
  date: Date
  time: string
  type: "meeting" | "deadline" | "call" | "social" | "task"
  description?: string
  participants?: string[]
  reminders?: Reminder[]
  source?: "local" | "google"
}

export interface Reminder {
  id: number
  time: number // minutes before event
  type: "notification" | "email"
  sent: boolean
}

interface EventContextType {
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
  addEvent: (event: Omit<Event, "id">) => void
  updateEvent: (event: Event) => void
  deleteEvent: (id: number) => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])

  const addEvent = (event: Omit<Event, "id">) => {
    setEvents(prev => [
      { ...event, id: Date.now() },
      ...prev,
    ])
  }

  const updateEvent = (event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e))
  }

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <EventContext.Provider value={{ events, setEvents, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext() {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error("useEventContext must be used within EventProvider")
  return ctx
}
