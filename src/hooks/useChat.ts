import { useState } from 'react';
import { sendMessageToGemini } from '../services/gemini';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export const useChat = (todoData: { active: any[]; finished: any[]; trashed: any[] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Pass the full todoData object
    const reply = await sendMessageToGemini(text, todoData);

    const botMsg: Message = {
      id: (Date.now() + 1).toString() + '_bot',
      text: reply,
      sender: 'bot',
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return { messages, sendMessage, loading };
};