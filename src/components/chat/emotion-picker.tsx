
"use client"

import type * as React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Emotion {
  id: string;
  name: string;
  emoji: string;
}

export const emotions: Emotion[] = [
  { id: "happy", name: "Happy", emoji: "😊" },
  { id: "sad", name: "Sad", emoji: "😢" },
  { id: "angry", name: "Angry", emoji: "😠" },
  { id: "excited", name: "Excited", emoji: "🤩" },
  { id: "thoughtful", name: "Thoughtful", emoji: "🤔" },
];

interface EmotionPickerProps {
  selectedEmotion: string | null;
  onSelectEmotion: (emotionId: string) => void;
}

export function EmotionPicker({ selectedEmotion, onSelectEmotion }: EmotionPickerProps) {
  return (
    <div className="mb-2 flex flex-wrap justify-center gap-2 px-2 py-1 rounded-md bg-accent/50">
      {emotions.map((emotion) => (
        <Button
          key={emotion.id}
          variant="ghost"
          size="sm"
          onClick={() => onSelectEmotion(emotion.id)}
          className={cn(
            "p-2 rounded-full transition-all duration-150 ease-in-out transform hover:scale-110",
            selectedEmotion === emotion.id ? "bg-primary text-primary-foreground scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:bg-primary/10"
          )}
          aria-pressed={selectedEmotion === emotion.id}
          aria-label={`Select ${emotion.name} emotion`}
        >
          <span className="text-xl" role="img" aria-label={emotion.name}>{emotion.emoji}</span>
        </Button>
      ))}
    </div>
  );
}
