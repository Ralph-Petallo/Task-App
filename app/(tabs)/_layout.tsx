import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TodoProvider } from "../../context/TodoContext";

export default function RootLayout() {
  return (
    <TodoProvider>
      <Tabs
        screenOptions={{
          tabBarActiveBackgroundColor: "white",
          tabBarInactiveBackgroundColor: "black",
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "white",
          headerShown: true,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size ?? 28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="finish"
          options={{
            title: "Finished Tasks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="checkbox-outline" size={size ?? 28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="trash"
          options={{
            title: "Trash",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trash-outline" size={size ?? 28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: "AI Buddy",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-ellipses-outline" size={size ?? 28} color={color} />
            ),
          }}
        />

      </Tabs>
    </TodoProvider>
  );
}