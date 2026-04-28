import { useTodos } from "@/context/TodoContext";
import { View } from "react-native";
import ChatBox from "../../src/components/ChatBox";

export default function ChatScreen() {

    const { activeTodos, finishedTodos, trashedTodos } = useTodos();
    return (
        <View style={{ flex: 1 }}>

            <ChatBox todoData={{ active: activeTodos, finished: finishedTodos, trashed: trashedTodos }} />
        </View>
    );
}