import { useState, useEffect } from 'react';

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const CONVERSATION_KEY = 'mathgpt-conversation';

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversation from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONVERSATION_KEY);
      if (saved) {
        const parsedMessages = JSON.parse(saved).map((msg: { id: string; content: string; sender: "user" | "ai"; timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Failed to load conversation from localStorage:', error);
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATION_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save conversation to localStorage:', error);
    }
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem(CONVERSATION_KEY);
  };

  const exportConversation = () => {
    const conversationText = messages.map(msg => {
      const timestamp = msg.timestamp.toLocaleString();
      const sender = msg.sender === 'user' ? 'You' : 'MathGPT';
      return `[${timestamp}] ${sender}: ${msg.content}`;
    }).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathgpt-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    messages,
    setMessages,
    addMessage,
    clearConversation,
    exportConversation,
    isLoading,
    setIsLoading
  };
}
