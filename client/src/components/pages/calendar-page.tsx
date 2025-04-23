"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CalendarPage() {
  const [viewMode, setViewMode] = useState("month")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Sample events data
  const events = [
    { id: 1, title: "Team Meeting", date: new Date(currentYear, currentMonth, 10), time: "10:00 AM", type: "meeting" },
    {
      id: 2,
      title: "Project Deadline",
      date: new Date(currentYear, currentMonth, 15),
      time: "11:30 AM",
      type: "deadline",
    },
    { id: 3, title: "Client Call", date: new Date(currentYear, currentMonth, 5), time: "2:00 PM", type: "call" },
    { id: 4, title: "Design Review", date: new Date(currentYear, currentMonth, 18), time: "3:30 PM", type: "meeting" },
    { id: 5, title: "Team Lunch", date: new Date(currentYear, currentMonth, 22), time: "12:30 PM", type: "social" },
    { id: 6, title: "Weekly Report", date: new Date(currentYear, currentMonth, 10), time: "4:00 PM", type: "task" },
  ]

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter((event) => event.date.getDate() === day)
  }

  // Get upcoming events (next 5 events)
  const getUpcomingEvents = () => {
    const today = new Date()
    return events
      .filter((event) => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }

  // Generate calendar grid
  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day bg-secondary/30"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day)
      const isToday =
        day === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()

      days.push(
        <div key={day} className={`calendar-day ${isToday ? "bg-primary/10 border border-primary/30" : "bg-card"}`}>
          <div className={`calendar-day-header ${isToday ? "text-primary font-medium" : ""}`}>{day}</div>
          <div className="overflow-hidden">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`calendar-event ${
                  event.type === "meeting"
                    ? "bg-purple-500/20 text-purple-500"
                    : event.type === "deadline"
                      ? "bg-red-500/20 text-red-500"
                      : event.type === "call"
                        ? "bg-blue-500/20 text-blue-500"
                        : event.type === "social"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-primary/20 text-primary"
                }`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center gap-2">
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-36 text-center font-medium">
                      {monthNames[currentMonth]} {currentYear}
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMonth(new Date().getMonth())
                      setCurrentYear(new Date().getFullYear())
                    }}
                  >
                    Today
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Tabs defaultValue="month" value={viewMode} onValueChange={setViewMode}>
                    <TabsList>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="day">Day</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar day names */}
              <div className="calendar-grid mb-1">
                {dayNames.map((day) => (
                  <div key={day} className="text-center py-2 text-sm font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="calendar-grid">{renderCalendarGrid()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getUpcomingEvents().map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        event.type === "meeting"
                          ? "bg-purple-500"
                          : event.type === "deadline"
                            ? "bg-red-500"
                            : event.type === "call"
                              ? "bg-blue-500"
                              : event.type === "social"
                                ? "bg-green-500"
                                : "bg-primary"
                      }
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                    <span className="text-sm font-medium">{event.title}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{event.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {getUpcomingEvents().length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No upcoming events</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Event Title</label>
                  <input
                    type="text"
                    placeholder="Enter event title"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date</label>
                    <input type="date" className="w-full px-3 py-2 rounded-md border border-border bg-background" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Time</label>
                    <input type="time" className="w-full px-3 py-2 rounded-md border border-border bg-background" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Event Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea
                    placeholder="Enter event description"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background h-20 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Participants
                  </label>
                  <input
                    type="text"
                    placeholder="Add participants"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90">
                  Create Event
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
