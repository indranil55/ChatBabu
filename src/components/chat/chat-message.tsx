
"use client"

import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsDown, User, Bot } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ChatMessageProps {
  message: Message;
  onFeedback: (messageId: string) => void;
}

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const selectedEmotionEmoji = message.selectedEmotion;

  return (
    <div className={cn("flex items-end gap-2 my-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
        </Avatar>
      )}
      <Card className={cn(
        "max-w-[75%] rounded-2xl shadow-md",
        isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none border"
      )}>
        <CardContent className="p-3">
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-150"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-300"></div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
          )}
        </CardContent>
        {!isUser && !message.isLoading && (
          <CardFooter className="px-3 py-1 border-t border-border/50">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-muted-foreground">
                {message.language ? `Lang: ${message.language.toUpperCase()}` : ''}
              </span>
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground hover:text-destructive h-auto p-1"
                onClick={() => onFeedback(message.id)}
                aria-label="Report this message"
                disabled={message.feedbackGiven}
              >
                <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                {message.feedbackGiven ? "Reported" : "Report"}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      {isUser && (
        <Avatar className="h-8 w-8 self-start">
           {selectedEmotionEmoji ? (
            <AvatarFallback className="bg-transparent text-xl">{selectedEmotionEmoji}</AvatarFallback>
          ) : (
            <AvatarFallback><User className="h-5 w-5 text-primary" /></AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  );
}
