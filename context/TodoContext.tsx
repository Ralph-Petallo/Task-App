import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useState } from "react";

// Todo object
export type Todo = {
  id: string;
  text: string;
  finished: boolean;
  category: string;
};

type TodoContextType = {
  activeTodos: Todo[];
  finishedTodos: Todo[];
  trashedTodos: Todo[];
  allTodos: Todo[];

  restoreAllFinished: () => void
  restoreTrashedTodo: (id: string) => void
  addTodo: (text: string, category: string) => void;
  removeTodo: (id: string) => void; // move active → trash
  finishTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;

  deleteFinishedTodo: (id: string) => void; // move finished → trash
  restoreTodo: (id: string) => void; // restore from trash
  deleteForever: (id: string) => void; // permanent delete

  loading: boolean;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [finishedTodos, setFinishedTodos] = useState<Todo[]>([]);
  const [trashedTodos, setTrashedTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  // Save Active Todos to localStorage
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem("activeTodos", JSON.stringify(activeTodos)
      ).catch((err) =>
        console.log("Error saving activeTodos:", err)
      );
    }
  }, [activeTodos, loading]);

  // Save Finished Todos to localStorage
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem("finishedTodos", JSON.stringify(finishedTodos)
      ).catch((err) =>
        console.log("Error saving finishedTodos:", err)
      );
    }
  }, [finishedTodos, loading]);

  // Save Trashed Todos to localStorage
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem("trashedTodos", JSON.stringify(trashedTodos)
      ).catch((err) =>
        console.log("Error saving trashedTodos:", err)
      );
    }
  }, [trashedTodos, loading]);

  // Load Todos from Storage
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const [active, finished, trash] = await Promise.all([
          AsyncStorage.getItem("activeTodos"),
          AsyncStorage.getItem("finishedTodos"),
          AsyncStorage.getItem("trashedTodos"),
        ]);

        setActiveTodos(active ? JSON.parse(active) : []);
        setFinishedTodos(finished ? JSON.parse(finished) : []);
        setTrashedTodos(trash ? JSON.parse(trash) : []);
        setAllTodos([...(active ? JSON.parse(active) : []), ...(finished ? JSON.parse(finished) : []), ...(trash ? JSON.parse(trash) : [])]);

      } catch (err) {
        console.log("Error loading todos:", err);
        setActiveTodos([]);
        setFinishedTodos([]);
        setTrashedTodos([]);
        setAllTodos([]);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);
  // Todo Functions

  console.log("Active: ", activeTodos)
  console.log("Finished: ", finishedTodos)
  console.log("Trashed: ", trashedTodos)

  const addTodo = (text: string, category: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(), // set time as an ID
      text,
      finished: false,
      category,
    };
    setActiveTodos((previous) => [...previous, newTodo]);
  };

  const removeTodo = (id: string) => {
    const task = activeTodos.find((todo) => todo.id === id);
    if (!task) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    setActiveTodos((prev) => prev.filter((todo) => todo.id !== id));
    setTrashedTodos((prev) => [{ ...task }, ...prev]);
  };

  const finishTodo = (id: string) => {
    const task = activeTodos.find((todo) => todo.id === id);
    if (!task) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveTodos((previous) => previous.filter((todo) => todo.id !== id));
    setFinishedTodos((previous) => [{ ...task, finished: true }, ...previous]);
  };

  const deleteForever = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    setTrashedTodos((previous) => previous.filter((todo) => todo.id !== id));
    setAllTodos((previous) => previous.filter((todo) => todo.id !== id));
  };

  const restoreTodo = (id: string) => {
    const task = finishedTodos.find(todo => todo.id === id)
    if (!task) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFinishedTodos((previous) => previous.filter((todo) => todo.id !== id));
    setActiveTodos(previous => [{ ...task, finished: false }, ...previous])
  };

  const restoreAllFinished = () => {
    setActiveTodos(previous => [...finishedTodos, ...previous])
    setFinishedTodos([])
  }

  const restoreTrashedTodo = (id: string) => {
    const task = trashedTodos.find(todo => todo.id === id)
    if (!task) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTrashedTodos((prev) => prev.filter((todo) => todo.id !== id));

    if (task.finished) {
      setFinishedTodos(previous => [{ ...task }, ...previous])
    } else {
      setActiveTodos(previous => [{ ...task, finished: false }, ...previous])
    }
  }

  const editTodo = (id: string, newText: string) => {
    
    setActiveTodos((previous) =>
      previous.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: newText }
        } else {
          return todo
        }
      }
    ));

  };

  const deleteFinishedTodo = (id: string) => {
    const task = finishedTodos.find((todo) => todo.id === id);
    if (!task) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    setFinishedTodos((prev) => prev.filter((todo) => todo.id !== id));
    setTrashedTodos((prev) => [...prev, { ...task }]);
  };

  // Provide Context
  return (
    <TodoContext.Provider
      value={{
        activeTodos,
        finishedTodos,
        trashedTodos,
        allTodos,
        addTodo,
        restoreTrashedTodo,
        removeTodo,
        finishTodo,
        editTodo,
        restoreAllFinished,
        deleteFinishedTodo,
        restoreTodo,
        deleteForever,
        loading,
      }}
    >

      {children}
    </TodoContext.Provider>
  );
};

// Custom Hook
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodos must be inside TodoProvider");
  return context;
};
