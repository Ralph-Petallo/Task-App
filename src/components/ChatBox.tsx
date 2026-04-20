import React, { useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useChat } from '../hooks/useChat';

export default function ChatBox({ tasks }: any) {
    const { messages, sendMessage, loading } = useChat(tasks);
    const [input, setInput] = useState('');

    const handleSend = () => {
        sendMessage(input);
        setInput('');
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            alignSelf:
                                item.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor:
                                item.sender === 'user' ? '#4CAF50' : '#eee',
                            padding: 10,
                            marginVertical: 5,
                            borderRadius: 10,
                            maxWidth: '80%',
                        }}
                    >
                        <Text>{item.text}</Text>
                    </View>
                )}
            />

            <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask your AI buddy..."
                style={{
                    borderWidth: 1,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 8,
                }}
            />

            <TouchableOpacity
                onPress={handleSend}
                style={{
                    backgroundColor: '#4CAF50',
                    padding: 12,
                    marginTop: 8,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#fff' }}>
                    {loading ? 'Thinking...' : 'Send'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}