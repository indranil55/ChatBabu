
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string; // For user messages if an emotion was selected
  selectedEmotion?: string; // Emoji representing selected emotion
  language?: string; // Detected language of user message, or language of AI response
  feedbackGiven?: boolean; // To track if feedback was given for an AI message
  isLoading?: boolean; // For AI message placeholder while loading
}
