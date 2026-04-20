import { useState } from 'react';
import { sendMessageToGemini } from '../services/gemini';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export const useChat = (tasks: Task[]) => {
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

    const reply = await sendMessageToGemini(text, tasks);

    const botMsg: Message = {
      id: Date.now().toString() + '_bot',
      text: reply,
      sender: 'bot',
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return {
    messages,
    sendMessage,
    loading,
  };
};