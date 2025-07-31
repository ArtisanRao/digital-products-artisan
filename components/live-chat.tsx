"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm here to help you with any questions about our digital products. How can I assist you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        text: "Thanks for your message! I'll help you with that right away. Let me check our available resources for you.",
        sender: "support",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 shadow-lg z-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Live Support</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </>
  )
}
