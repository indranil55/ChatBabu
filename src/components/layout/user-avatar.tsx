
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogIn } from "lucide-react"

export function UserAvatar() {
  // In a real app, this would handle user authentication state
  // and display user info or a login prompt.

  return (
    <Avatar>
      <AvatarFallback>
        <LogIn className="h-6 w-6 text-primary" />
      </AvatarFallback>
    </Avatar>
  )
}
