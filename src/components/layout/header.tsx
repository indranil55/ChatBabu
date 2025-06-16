
"use client"

import Link from "next/link"
import { BrainCircuit } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { UserAvatar } from "./user-avatar"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="AIChatBabu Home">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">AIChatBabu</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}
