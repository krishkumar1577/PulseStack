"use client"

/*
TODO: Future Chat Enhancements
1. Backend Integration:
   - Implement real-time messaging with WebSocket
   - Add message persistence with database
   - Add user authentication and authorization

2. Group Chat Features:
   - Add group chat notifications
   - Implement group settings/management
   - Add ability to leave/join groups
   - Add group avatars
   - Add group roles and permissions

3. Message Features:
   - Add message reactions with emojis
   - Implement message threading
   - Add message search functionality
   - Improve file attachments with preview
   - Add message editing and deletion

4. UI/UX Improvements:
   - Add typing indicators for multiple users
   - Implement message delivery status
   - Add sound notifications
   - Add chat themes and customization
*/

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Minimize2, Maximize2, User, Users, Smile, Paperclip, Image as ImageIcon, Check, UserPlus } from "lucide-react"
import dynamic from 'next/dynamic'
import data from '@emoji-mart/data'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Dynamic import of EmojiPicker with proper typing
const EmojiPicker = dynamic(
  () => import('@emoji-mart/react').then((mod) => mod.default),
  { ssr: false }
)

type PresenceStatus = 'online' | 'away' | 'offline'

interface User {
  id: number
  name: string
  avatar?: string
  status: PresenceStatus
  lastSeen?: string
  email?: string
  role?: string
  bio?: string
}

interface ChatMessage {
  id: number
  sender: string
  content: string
  time: string
  avatar?: string
  isUser?: boolean
  userId?: number
  readBy?: number[] // Array of user IDs who have read the message
  attachments?: Array<{
    type: 'image' | 'file'
    url: string
    name: string
  }>
}

interface Group {
  id: number
  name: string
  avatar?: string
  members: User[]
  createdBy: number
  createdAt: string
}

interface ChatWidgetProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

// Component for presence indicator
function PresenceIndicator({ status }: { status: PresenceStatus }) {
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400'
  }

  return (
    <span className={`h-2 w-2 rounded-full ${statusColors[status]} ring-2 ring-white`} />
  )
}

// User Profile Modal Component
function UserProfileModal({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-96 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <PresenceIndicator status={user.status} />
            <span className="text-sm text-muted-foreground">
              {user.status === 'online' ? 'Active now' : 
               user.status === 'away' ? 'Away' : 
               user.lastSeen ? `Last seen ${user.lastSeen}` : 'Offline'}
            </span>
          </div>
          
          {user.email && (
            <p className="text-sm text-muted-foreground mt-2">{user.email}</p>
          )}
          {user.role && (
            <Badge variant="outline" className="mt-2">{user.role}</Badge>
          )}
          {user.bio && (
            <p className="text-sm mt-4 text-center">{user.bio}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Create Group Modal Component
function CreateGroupModal({ users, onClose, onCreateGroup }: { 
  users: User[]
  onClose: () => void
  onCreateGroup: (group: Omit<Group, 'id'>) => void 
}) {
  const [groupName, setGroupName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-96 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Group Name</label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Add Members</label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-secondary/50 rounded-md cursor-pointer"
                  onClick={() => {
                    if (selectedMembers.find(m => m.id === user.id)) {
                      setSelectedMembers(prev => prev.filter(m => m.id !== user.id))
                    } else {
                      setSelectedMembers(prev => [...prev, user])
                    }
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedMembers.find(m => m.id === user.id) && (
                      <div className="absolute -right-1 -bottom-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
            onClick={() => {
              if (groupName && selectedMembers.length > 0) {
                onCreateGroup({
                  name: groupName,
                  members: selectedMembers,
                  createdBy: 1, // Current user ID
                  createdAt: new Date().toISOString(),
                })
                onClose()
              }
            }}
          >
            Create Group
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ChatWidget({ isOpen, setIsOpen }: ChatWidgetProps) {
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState("")
  const [activeChat, setActiveChat] = useState("team")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Project Team",
      members: [
        { id: 1, name: "Alex", status: "online", avatar: "/placeholder.svg" },
        { id: 2, name: "Sarah", status: "online", avatar: "/placeholder.svg" },
      ],
      createdBy: 1,
      createdAt: "2025-05-03T10:00:00.000Z"
    }
  ])

  // Sample users with presence status
  const [users] = useState<User[]>([
    { id: 1, name: "Alex", status: "online", avatar: "/placeholder.svg" },
    { id: 2, name: "Sarah", status: "online", avatar: "/placeholder.svg" },
    { id: 3, name: "Mike", status: "away", lastSeen: "5m ago", avatar: "/placeholder.svg" },
    { id: 4, name: "Emily", status: "offline", lastSeen: "1h ago", avatar: "/placeholder.svg" }
  ])

  // Get online users count
  const onlineUsers = users.filter(user => user.status === "online").length

  // Sample messages - In a real app, this would come from an API
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "Alex",
      userId: 1,
      content: "Hey team, how's the progress on the dashboard?",
      time: "10:30 AM",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      sender: "Sarah",
      userId: 2,
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
      userId: 1,
      content: "Perfect! Let's sync up tomorrow morning to review everything.",
      time: "10:38 AM",
      avatar: "/placeholder.svg",
    },
  ])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, expanded])

  // Mark messages as read
  useEffect(() => {
    const unreadMessages = messages.filter(msg => !msg.readBy?.includes(1)) // 1 is current user ID
    if (unreadMessages.length > 0) {
      setMessages(prev => prev.map(msg => 
        msg.readBy?.includes(1) ? msg : {
          ...msg,
          readBy: [...(msg.readBy || []), 1]
        }
      ))
    }
  }, [messages])

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    // In a real app, you would upload these files to a server
    // For now, we'll just create object URLs
    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/')
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: "You",
        content: `Sent ${isImage ? 'an image' : 'a file'}: ${file.name}`,
        time: new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit",
          hour12: true 
        }),
        isUser: true,
        attachments: [{
          type: isImage ? 'image' : 'file',
          url: URL.createObjectURL(file),
          name: file.name
        }]
      }
      setMessages(prev => [...prev, newMessage])
    })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const simulateTyping = () => {
    setIsTyping(true)
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    const timeout = setTimeout(() => {
      setIsTyping(false)
    }, 2000)
    setTypingTimeout(timeout)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: "You",
        content: message.trim(),
        time: new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit",
          hour12: true 
        }),
        isUser: true,
      }
      
      setMessages(prev => [...prev, newMessage])
      setMessage("")

      // Simulate AI typing and response
      simulateTyping()
      setTimeout(() => {
        const response: ChatMessage = {
          id: Date.now() + 1,
          sender: "PulseStack AI",
          content: "I'll help you with that! What specific information do you need?",
          time: new Date().toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: true 
          }),
          avatar: "/placeholder.svg",
        }
        setMessages(prev => [...prev, response])
      }, 2000)
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
    <div className="fixed bottom-6 right-6 flex flex-col bg-card border rounded-lg shadow-lg"
         style={{ 
           width: expanded ? '480px' : '320px',
           height: expanded ? '600px' : '480px',
           transition: 'all 0.3s ease-in-out'
         }}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm">PulseStack Chat</h3>
            <div className="flex items-center gap-1">
              <PresenceIndicator status="online" />
              <span className="text-xs text-muted-foreground">{onlineUsers} online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {activeChat === "team" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowCreateGroup(true)}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Tabs */}
      <div className="border-b">
        <Tabs defaultValue="team" value={activeChat} onValueChange={setActiveChat}>
          <TabsList className="w-full">
            <TabsTrigger value="team" className="flex-1 gap-1">
              <Users className="h-4 w-4" /> Team
            </TabsTrigger>
            <TabsTrigger value="direct" className="flex-1 gap-1">
              <User className="h-4 w-4" /> Direct
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* User List Panel - Shows when in direct message tab */}
      {activeChat === "direct" && (
        <div className="border-b">
          <div className="p-2">
            <Input
              placeholder="Search users..."
              className="h-8"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 hover:bg-secondary/50 cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                    <PresenceIndicator status={user.status} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.status === 'online' ? 'Active now' : 
                     user.status === 'away' ? 'Away' : 
                     user.lastSeen ? `Last seen ${user.lastSeen}` : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} mb-3`}>
            {!msg.isUser && (
              <div className="relative">
                <Avatar
                  className="h-8 w-8 mr-2 cursor-pointer"
                  onClick={() => {
                    const user = users.find(u => u.id === msg.userId)
                    if (user) setSelectedUser(user)
                  }}
                >
                  <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
                {msg.userId && (
                  <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                    <PresenceIndicator 
                      status={users.find(u => u.id === msg.userId)?.status || 'offline'} 
                    />
                  </div>
                )}
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-2 ${
                msg.isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {!msg.isUser && <div className="text-xs font-medium mb-1">{msg.sender}</div>}
              <p className="text-sm">{msg.content}</p>
              {msg.attachments?.map((attachment, index) => (
                <div key={index} className="mt-2">
                  {attachment.type === 'image' ? (
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="max-w-full rounded-md"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-xs truncate">{attachment.name}</span>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">{msg.time}</span>
                {msg.readBy && msg.readBy.length > 0 && (
                  <div className="flex -space-x-1">
                    {msg.readBy.map(userId => {
                      const user = users.find(u => u.id === userId)
                      return user ? (
                        <Avatar key={userId} className="h-3 w-3 border border-card">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-[8px]">{user.name[0]}</AvatarFallback>
                        </Avatar>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
            <span className="text-xs">PulseStack AI is typing</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      
      {showCreateGroup && (
        <CreateGroupModal
          users={users}
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={(group) => {
            setGroups(prev => [...prev, { ...group, id: prev.length + 1 }])
          }}
        />
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-0 z-50">
          <EmojiPicker 
            data={data} 
            onEmojiSelect={handleEmojiSelect}
            theme={expanded ? 'light' : 'dark'}
          />
        </div>
      )}

      {/* Chat Input */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>
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
