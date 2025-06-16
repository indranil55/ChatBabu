
"use client";

import type * as React from 'react';
import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/types';
import { ChatMessage } from './chat-message';
import { EmotionPicker, emotions as emotionOptions } from './emotion-picker';
import { detectLanguageAction, getEmotionalResponseAction } from '@/lib/actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(emotionOptions[0].id);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDetectLanguage = async (text: string) => {
    if (!text.trim()) return;
    startTransition(async () => {
      try {
        const result = await detectLanguageAction(text);
        setDetectedLanguage(result.language);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Language Detection Failed",
          description: (error as Error).message,
        });
        setDetectedLanguage(null);
      }
    });
  };


  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!inputText.trim() || isPending) return;

    const userMessageId = Date.now().toString();
    const currentEmotionEmoji = emotionOptions.find(em => em.id === selectedEmotion)?.emoji;

    const newUserMessage: Message = {
      id: userMessageId,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      selectedEmotion: currentEmotionEmoji,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');

    const aiPlaceholderMessageId = (Date.now() + 1).toString();
    const aiPlaceholderMessage: Message = {
      id: aiPlaceholderMessageId,
      text: "AIChatBabu is thinking...",
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    startTransition(async () => {
      try {
        let langToUse = detectedLanguage;
        if (!langToUse && newUserMessage.text) {
            const langResult = await detectLanguageAction(newUserMessage.text);
            langToUse = langResult.language;
            setDetectedLanguage(langResult.language);
        }

        const emotionForApi = selectedEmotion || emotionOptions[0].id;
        const response = await getEmotionalResponseAction(newUserMessage.text, emotionForApi, langToUse || undefined);

        const aiResponseMessage: Message = {
          id: aiPlaceholderMessageId,
          text: response.response,
          sender: 'ai',
          timestamp: new Date(),
          language: langToUse || undefined,
          isLoading: false,
        };

        setMessages(prev => prev.map(msg => msg.id === aiPlaceholderMessageId ? aiResponseMessage : msg));

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error).message,
        });
        setMessages(prev => prev.filter(msg => msg.id !== aiPlaceholderMessageId));
      } finally {
        setDetectedLanguage(null);
      }
    });
  };

  const handleFeedback = (messageId: string) => {
    console.log(`Feedback submitted for message ID: ${messageId}`);
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, feedbackGiven: true } : msg
      )
    );
    toast({
      title: "Feedback Received",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <div className="flex flex-col h-full p-2 sm:p-4 bg-transparent">
      <ScrollArea className="flex-1 mb-4 pr-4 -mr-4" ref={scrollAreaRef} id="chat-scroll-area">
        <div className="space-y-4 pr-1">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} />
          ))}
        </div>
      </ScrollArea>
      <Card className="shadow-xl rounded-xl">
        <CardContent className="p-1 sm:p-2">
          <div className="mb-1 sm:mb-2">
            <EmotionPicker selectedEmotion={selectedEmotion} onSelectEmotion={setSelectedEmotion} />
          </div>
          <form onSubmit={handleSubmit} className="flex items-end gap-1 sm:gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 resize-none border-input focus:ring-1 focus:ring-primary min-h-[48px] sm:min-h-[52px] max-h-[120px] sm:max-h-[150px] text-xs sm:text-sm min-w-0"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              aria-label="Chat message input"
            />
             <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleDetectLanguage(inputText)}
              disabled={isPending || !inputText.trim()}
              aria-label="Detect language"
              className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={isPending || !inputText.trim()}
              aria-label="Send message"
              className="h-9 w-9 sm:h-10 sm:w-10 bg-primary hover:bg-primary/90 flex-shrink-0"
            >
              {isPending ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </form>
        </CardContent>
        {detectedLanguage && (
          <CardFooter className="p-2 text-xs text-muted-foreground border-t">
            Detected Language: {detectedLanguage.toUpperCase()}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
