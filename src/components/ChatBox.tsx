import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useChat } from '../hooks/useChat';

interface ChatBoxProps {
  todoData: {
    active: any[];
    finished: any[];
    trashed: any[];
  };
}

export default function ChatBox({ todoData }: ChatBoxProps) {
  const { messages, sendMessage, loading } = useChat(todoData);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    sendMessage(input);
    setInput('');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, padding: 10 }}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: item.sender === 'user' ? '#4CAF50' : '#e0e0e0',
              padding: 12,
              marginVertical: 5,
              borderRadius: 15,
              maxWidth: '85%',
            }}
          >
            <Text style={{ color: item.sender === 'user' ? '#fff' : '#000' }}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={{ marginBottom: 20 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your tasks..."
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 12,
            borderRadius: 25,
            backgroundColor: '#fff',
          }}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#aaa' : '#4CAF50',
            padding: 12,
            marginTop: 8,
            borderRadius: 25,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {loading ? 'Thinking...' : 'Send Message'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}