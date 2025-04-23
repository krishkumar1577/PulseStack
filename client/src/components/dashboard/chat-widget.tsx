"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Minimize2, Maximize2, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChatWidgetProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function ChatWidget({ isOpen, setIsOpen }: ChatWidgetProps) {
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState("")
  const [activeChat, setActiveChat] = useState("team")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alex",
      content: "Hey team, how's the progress on the dashboard?",
      time: "10:30 AM",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      sender: "Sarah",
      content: "I've completed the UI components. Working on the calendar now.",
      time: "10:32 AM",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      sender: "You",
      content: "Great! I'm finishing up the activity page. Should be done by EOD.",
      time: "10:35 AM",
      isUser: true,
    },
    {
      id: 4,
      sender: "Alex",
      content: "Perfect! Let's sync up tomorrow morning to review everything.",
      time: "10:38 AM",
      avatar: "/placeholder.svg",
    },
  ])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, expanded])

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "You",
          content: message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isUser: true,
        },
      ])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 shadow-lg"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div
      className={`chat-widget ${expanded ? "w-80 md:w-96" : "w-72"} bg-card border rounded-lg shadow-lg flex flex-col`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-bborder">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm">PulseStack Chat</h3>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-muted-foreground">3 online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Tabs */}
      <Tabs defaultValue="team" value={activeChat} onValueChange={setActiveChat} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="team" className="flex-1">
            <Users className="h-4 w-4 mr-1" /> Team
          </TabsTrigger>
          <TabsTrigger value="direct" className="flex-1">
            <User className="h-4 w-4 mr-1" /> Direct
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Chat Messages */}
      <div className="chat-messages p-3 overflow-y-auto flex-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} mb-3`}>
            {!msg.isUser && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                <AvatarFallback>{msg.sender[0]}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-2 ${msg.isUser ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            >
              {!msg.isUser && <div className="text-xs font-medium mb-1">{msg.sender}</div>}
              <p className="text-sm">{msg.content}</p>
              <div className="text-xs opacity-70 text-right mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 border-tborder">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
