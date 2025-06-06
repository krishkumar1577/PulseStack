"use client"

// TODO: Backend Implementation Requirements:
// 1. Event Persistence:
//    - Create events table in database
//    - API endpoints for CRUD operations
//    - Implement real-time updates using WebSocket
//
// 2. Google Calendar Integration:
//    - Set up OAuth 2.0 in backend
//    - Store API keys and secrets securely
//    - Implement token refresh mechanism
//    - Create webhook endpoint for calendar sync
//
// 3. Email Service Integration:
//    - Set up email service (SendGrid/AWS SES)
//    - Create email templates for reminders
//    - Implement scheduled email sending
//
// 4. User Settings:
//    - Store user preferences
//    - Calendar view preferences
//    - Default reminder settings
//    - Connected calendar settings

import { Fragment, useState, useEffect } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Users, Bell, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Add these type declarations at the top of the file after imports
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: any) => Promise<void>;
        load: (api: string, version: string) => Promise<void>;
        calendar: {
          events: {
            list: (params: any) => Promise<{
              result: {
                items: GoogleEvent[];
              };
            }>;
          };
        };
      };
      auth2: {
        init: (params?: any) => {
          signIn: () => Promise<void>;
        };
      };
    };
  }
}

// Types for Google Calendar Integration
interface GoogleEvent {
  summary: string
  start: {
    dateTime?: string
    date?: string
  }
  description?: string
}

interface Event {
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

interface Reminder {
  id: number
  time: number // minutes before event
  type: "notification" | "email"
  sent: boolean
}

interface NewEvent {
  title: string;
  date: string;
  time: string;
  type: Event['type'];
  description?: string;
  participants?: string[];
}

// TODO: Define API interfaces for backend integration
interface CalendarAPIResponse {
  events: Event[];
  settings: UserCalendarSettings;
}

interface UserCalendarSettings {
  defaultView: "month" | "week" | "day";
  defaultReminders: {
    time: number;
    type: "notification" | "email";
  }[];
  connectedCalendars: {
    type: "google";
    isConnected: boolean;
    autoSync: boolean;
    showInCalendar: boolean;
  }[];
}

export function CalendarPage() {
  const [viewMode, setViewMode] = useState("month")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Team Meeting",
      date: new Date(currentYear, currentMonth, 10),
      time: "10:00 AM",
      type: "meeting",
      reminders: [
        { id: 1, time: 30, type: "notification", sent: false },
        { id: 2, time: 60, type: "email", sent: false }
      ]
    },
    { id: 2, title: "Project Deadline", date: new Date(currentYear, currentMonth, 15), time: "11:30 AM", type: "deadline" },
    { id: 3, title: "Client Call", date: new Date(currentYear, currentMonth, 5), time: "2:00 PM", type: "call" },
    { id: 4, title: "Design Review", date: new Date(currentYear, currentMonth, 18), time: "3:30 PM", type: "meeting" },
    { id: 5, title: "Team Lunch", date: new Date(currentYear, currentMonth, 22), time: "12:30 PM", type: "social" },
    { id: 6, title: "Weekly Report", date: new Date(currentYear, currentMonth, 10), time: "4:00 PM", type: "task" },
  ])
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false)
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'meeting',
    description: '',
    participants: []
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showEventDialog, setShowEventDialog] = useState(false)

  const confirmDelete = () => {
    if (eventToDelete) {
      setEvents(prev => prev.filter(e => e.id !== eventToDelete.id))
      setShowDeleteConfirm(false)
      setEventToDelete(null)
    }
  }

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

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter((event) => event.date.getDate() === day)
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    ).sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time.toLowerCase()}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.time.toLowerCase()}`).getTime();
      return timeA - timeB;
    });
  };

  // Get week dates
  const getWeekDates = () => {
    const currentDate = new Date(currentYear, currentMonth, new Date().getDate());
    const week = [];
    // Get Sunday of current week
    const first = currentDate.getDate() - currentDate.getDay();
    
    for(let i = 0; i < 7; i++) {
      const date = new Date(currentYear, currentMonth, first + i);
      week.push(date);
    }
    return week;
  };

  // Generate time slots for day view
  const getTimeSlots = () => {
    const slots = [];
    for(let i = 0; i < 24; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // Render week view
  const renderWeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <div className="flex flex-col h-[600px]">
        <div className="grid grid-cols-8 bg-card">
          <div className="h-12 border-b"></div> {/* Time column header */}
          {weekDates.map((date, index) => (
            <div 
              key={index} 
              className={`text-center p-2 border-b border-l ${
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() ? 
                "bg-primary/10" : ""
              }`}
            >
              <div className="font-medium">{dayNames[index]}</div>
              <div className="text-sm text-muted-foreground">
                {monthNames[date.getMonth()]} {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-8 overflow-y-auto flex-1">
          {getTimeSlots().map((time, i) => (
            <Fragment key={time}>
              <div className="text-xs text-muted-foreground p-2 sticky left-0 bg-card border-r">
                {time}
              </div>
              {weekDates.map((date, j) => {
                const dayEvents = getEventsForDate(date);
                const timeEvents = dayEvents.filter(event => {
                  const eventHour = parseInt(event.time.split(':')[0]);
                  const slotHour = parseInt(time.split(':')[0]);
                  return eventHour === slotHour;
                });

                return (
                  <div 
                    key={`${i}-${j}`} 
                    className="min-h-[60px] border-t border-l p-1 relative group"
                  >
                    {timeEvents.map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-2 rounded mb-1 cursor-pointer hover:opacity-80 ${
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
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-80">{event.time}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const today = new Date(currentYear, currentMonth, new Date().getDate());
    const dayEvents = getEventsForDate(today);

    return (
      <div className="flex flex-col">
        <div className="text-center p-4 bg-primary/5 rounded-lg mb-4">
          <div className="font-medium">
            {dayNames[today.getDay()]}, {monthNames[today.getMonth()]} {today.getDate()}
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4">
          {getTimeSlots().map((time) => {
            const timeEvents = dayEvents.filter(event => 
              event.time.startsWith(time.split(':')[0])
            );

            return (
              <Fragment key={time}>
                <div className="text-sm text-muted-foreground py-2">
                  {time}
                </div>
                <div className="border-l pl-4 py-2">
                  {timeEvents.map(event => (
                    <div
                      key={event.id}
                      className="mb-2 p-2 rounded-lg bg-card hover:bg-secondary/50 cursor-pointer group"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              event.type === "meeting"
                                ? "bg-purple-500"
                                : event.type === "deadline"
                                  ? "bg-red-500"
                                  : event.type === "call"
                                    ? "bg-blue-500"
                                    : "bg-primary"
                            }`}
                          />
                          <span className="font-medium">{event.title}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditEvent(event)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteEvent(event)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground ml-4 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Updated getUpcomingEvents function with proper date comparison
  const getUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for proper comparison
    
    return events
      .filter((event) => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
      })
      .sort((a, b) => {
        // First compare by date
        const dateCompare = a.date.getTime() - b.date.getTime()
        if (dateCompare !== 0) return dateCompare
        
        // If same date, compare by time
        const timeA = new Date(`1970/01/01 ${a.time}`).getTime()
        const timeB = new Date(`1970/01/01 ${b.time}`).getTime()
        return timeA - timeB
      })
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

  // TODO: Replace local state with API calls
  useEffect(() => {
    const checkReminders = () => {
      // TODO: This should be handled by backend scheduled jobs
      const now = new Date()
      events.forEach(event => {
        event.reminders?.forEach(reminder => {
          if (!reminder.sent) {
            const eventTime = new Date(event.date)
            const [hours, minutes] = event.time.split(':').map(n => parseInt(n))
            eventTime.setHours(hours, minutes)
            
            const reminderTime = new Date(eventTime.getTime() - reminder.time * 60000)
            
            if (now >= reminderTime) {
              // Send reminder notification
              if (reminder.type === "notification") {
                new Notification(`Reminder: ${event.title}`, {
                  body: `Event starting in ${reminder.time} minutes`,
                  icon: "/calendar-icon.png"
                })
              }
              // Mark reminder as sent
              reminder.sent = true
            }
          }
        })
      })
    }

    // TODO: Replace with backend push notifications
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }

    const interval = setInterval(checkReminders, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [events])

  // Google Calendar Integration
  const connectGoogleCalendar = async () => {
    try {
      // TODO: Replace with backend OAuth flow
      const handleGoogleSignIn = () => {
        // This will be handled by backend OAuth endpoint
        console.log('TODO: Implement backend OAuth flow')
      }

      handleGoogleSignIn()
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error)
    }
  }

  // TODO: Implement backend sync
  const fetchGoogleCalendarEvents = async () => {
    try {
      // TODO: Replace with backend API call
      console.log('TODO: Implement backend calendar sync')
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error)
    }
  }

  // TODO: Replace with backend API call
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Call backend API to create event
    const eventDate = new Date(newEvent.date)
    const newEventData: Event = {
      id: Date.now(),
      title: newEvent.title,
      date: eventDate,
      time: newEvent.time,
      type: newEvent.type,
      description: newEvent.description,
      participants: newEvent.participants?.filter(p => p.trim() !== ''),
      reminders: []
    }

    setEvents(prev => [...prev, newEventData])
    setShowEventDialog(false) // <-- Move dialog close here
    // Reset form
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'meeting',
      description: '',
      participants: []
    })
  }

  // TODO: Replace with backend API call
  const handleDeleteEvent = async (event: Event) => {
    // TODO: Call backend API to delete event
    setEventToDelete(event)
    setShowDeleteConfirm(true)
  }

  // TODO: Replace with backend API call
  const handleEditEvent = (event: Event) => {
    setNewEvent({
      title: event.title,
      date: event.date.toISOString().split('T')[0],
      time: event.time,
      type: event.type,
      description: event.description || '',
      participants: event.participants || []
    })
    setSelectedEvent(event)
    setIsEditMode(true)
  }

  // TODO: Replace with backend API call
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return

    // TODO: Call backend API to update event
    const updatedEvent: Event = {
      ...selectedEvent,
      title: newEvent.title,
      date: new Date(newEvent.date),
      time: newEvent.time,
      type: newEvent.type,
      description: newEvent.description,
      participants: newEvent.participants?.filter(p => p.trim() !== '')
    }

    setEvents(prev => prev.map(e => 
      e.id === selectedEvent.id ? updatedEvent : e
    ))

    setIsEditMode(false)
    setSelectedEvent(null)
    setShowEventDialog(false) // <-- Move dialog close here
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'meeting',
      description: '',
      participants: []
    })
  }

  // TODO: Implement backend reminder system
  const ReminderSettings = ({ event }: { event: Event }) => {
    // TODO: Replace with backend API calls for reminder management
    const [reminders, setReminders] = useState(event.reminders || [])

    const addReminder = async (time: number, type: "notification" | "email") => {
      // TODO: Call backend API to add reminder
      const newReminder = {
        id: Date.now(),
        time,
        type,
        sent: false
      }
      setReminders(prev => [...prev, newReminder])
      
      // Update event reminders
      setEvents(prev => prev.map(e => 
        e.id === event.id ? { ...e, reminders: [...reminders, newReminder] } : e
      ))
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Reminder Settings</h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
          {reminders.map(reminder => (
            <div key={reminder.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="text-sm">{reminder.time} minutes before - {reminder.type}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setReminders(prev => prev.filter(r => r.id !== reminder.id))
                  // Also update the event's reminders
                  setEvents(prev => prev.map(e => 
                    e.id === event.id 
                      ? { ...e, reminders: e.reminders?.filter(r => r.id !== reminder.id) } 
                      : e
                  ))
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Select onValueChange={(value) => addReminder(parseInt(value), "notification")}>
            <SelectTrigger>
              <SelectValue placeholder="Add notification reminder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes before</SelectItem>
              <SelectItem value="10">10 minutes before</SelectItem>
              <SelectItem value="15">15 minutes before</SelectItem>
              <SelectItem value="30">30 minutes before</SelectItem>
              <SelectItem value="60">1 hour before</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => addReminder(parseInt(value), "email")}>
            <SelectTrigger>
              <SelectValue placeholder="Add email reminder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">1 hour before</SelectItem>
              <SelectItem value="120">2 hours before</SelectItem>
              <SelectItem value="1440">1 day before</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto px-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center gap-2">
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white" onClick={() => setShowEventDialog(true)}>
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
              {/* Calendar views */}
              {viewMode === "month" && (
                <>
                  <div className="calendar-grid mb-1">
                    {dayNames.map((day) => (
                      <div key={day} className="text-center py-2 text-sm font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="calendar-grid">{renderCalendarGrid()}</div>
                </>
              )}
              {viewMode === "week" && renderWeekView()}
              {viewMode === "day" && renderDayView()}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Calendar Integration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calendar Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Google Calendar</span>
                </div>
                <Button
                  variant={isGoogleCalendarConnected ? "outline" : "default"}
                  onClick={connectGoogleCalendar}
                >
                  {isGoogleCalendarConnected ? "Connected" : "Connect"}
                </Button>
              </div>
              {isGoogleCalendarConnected && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-sync</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show in calendar</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getUpcomingEvents().map((event) => (
                <div 
                  key={event.id} 
                  className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer group"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center justify-between">
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
                    <div className="opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEvent(event)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>
                        {event.date.toLocaleDateString(undefined, { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: event.date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
              {getUpcomingEvents().length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No upcoming events</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvent ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-medium">{selectedEvent.title}</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditEvent(selectedEvent)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => {
                          setEventToDelete(selectedEvent)
                          setShowDeleteConfirm(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {selectedEvent.date.toLocaleDateString(undefined, { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: selectedEvent.date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{selectedEvent.time}</span>
                    </div>
                  </div>
                  {selectedEvent.description && (
                    <div className="mb-4">
                      <span className="text-sm font-medium">Description:</span>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}
                  {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Participants:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedEvent.participants.map(participant => (
                          <span key={participant} className="text-sm bg-secondary/30 rounded-full px-3 py-1">
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  Select an event to see details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event creation form dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Event' : 'Create Event'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={isEditMode ? handleUpdateEvent : handleCreateEvent}>
            {/* Event Title */}
            <div>
              <label className="text-sm font-medium mb-1 block">Event Title</label>
              <input
                type="text"
                placeholder="Enter event title"
                className="w-full px-3 py-2 rounded-md borderborder"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 rounded-md borderborder"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Time</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 rounded-md borderborder"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
            </div>
            {/* Event Type */}
            <div>
              <label className="text-sm font-medium mb-1 block">Event Type</label>
              <Select value={newEvent.type} onValueChange={(value: Event['type']) => setNewEvent(prev => ({ ...prev, type: value }))}>
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
            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                placeholder="Enter event description"
                className="w-full px-3 py-2 rounded-md borderborder h-20 resize-none"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            {/* Participants */}
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants
              </label>
              <input
                type="text"
                placeholder="Add participants (comma-separated)"
                className="w-full px-3 py-2 rounded-md borderborder"
                value={newEvent.participants?.join(', ')}
                onChange={(e) => setNewEvent(prev => ({ 
                  ...prev, 
                  participants: e.target.value.split(',').map(p => p.trim())
                }))}
              />
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              {isEditMode && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsEditMode(false)
                    setSelectedEvent(null)
                    setNewEvent({
                      title: '',
                      date: new Date().toISOString().split('T')[0],
                      time: '09:00',
                      type: 'meeting',
                      description: '',
                      participants: []
                    })
                    setShowEventDialog(false)
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
                // Removed onClick that closes dialog here
              >
                {isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && eventToDelete && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Event</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete "{eventToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setEventToDelete(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
