import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from 'expo-haptics';
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Todo, useTodos } from "../../context/TodoContext";

const PRIMARY = "#d32f2f"; // Crimson Red
const ACCENT = "#fbc02d";  // Kunai Gold
const BG = "#000";      // Absolute Black
const CARD_BG = "#1e1e1e"; // Smoke Gray

export default function FinishTodo() {
  const { finishedTodos, restoreTodo, restoreAllFinished, deleteFinishedTodo, loading } = useTodos();

  const [search, setSearch] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState<boolean>(false);
  const [restoreAllModal, setRestoreAllModal] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // --- FILTER LOGIC ---
  const filteredTodos = finishedTodos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase()); // filters the search for the category 

    const matchesCategory = (filterCategory === "All") || todo.category === filterCategory; // ternary operator

    return matchesSearch && matchesCategory; // returns true if both conditions are true
  });

  // --- ACTION HANDLERS ---
  const confirmDelete = (todo: Todo) => {
    setSelectedTodo(todo);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedTodo) {
      deleteFinishedTodo(selectedTodo.id);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setDeleteModalVisible(false);
    setSelectedTodo(null);
  };

  const confirmRestore = (todo: Todo) => {
    setSelectedTodo(todo);
    setRestoreModalVisible(true);
  };

  const handleRestore = () => {
    if (selectedTodo) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      restoreTodo(selectedTodo.id)
    }
    setRestoreModalVisible(false);
    setSelectedTodo(null);
  };

  const handleRestoreAll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    restoreAllFinished()
    setRestoreAllModal(false);
  };

  // --- RENDER ITEM ---
  const renderFinished = ({ item }: { item: Todo }) => (
    <View style={styles.todoCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.todoText} numberOfLines={1}>
          {item.text}
        </Text>
        <Text style={styles.categoryTag}>Sector: {item.category}</Text>
      </View>
      <View style={styles.actionRow}>
        <Pressable
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={styles.miniBtn}
          onPress={() => confirmRestore(item)}
        >
          <Ionicons name="arrow-undo-outline" size={18} color="#2ecc71" />
        </Pressable>
        <Pressable
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={[styles.miniBtn, { marginLeft: 10 }]}
          onPress={() => confirmDelete(item)}
        >
          <Ionicons name="trash-outline" size={18} color={PRIMARY} />
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.body}>
        <Text style={styles.emptyText}>Summoning scrolls...</Text>
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <Text style={styles.title}>Completed ⚔️</Text>

      {/* FILTER SECTION (Optimized for Visibility) */}
      <View style={styles.filterContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Locate mission..."
          placeholderTextColor="#555"
          style={styles.searchInput}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={filterCategory}
            onValueChange={(itemValue) => setFilterCategory(itemValue)}
            style={styles.picker}
            dropdownIconColor={ACCENT}
            mode="dropdown"
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="💼 Work" value="Work" />
            <Picker.Item label="📚 School" value="School" />
            <Picker.Item label="🏠 Personal" value="Personal" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={renderFinished}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No scroll found. 🍃</Text>
        }
      />

      {finishedTodos.length > 0 && (
        <Pressable
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          style={styles.restoreAllBtn}
          onPress={() => setRestoreAllModal(true)}
        >
          <Text style={styles.restoreAllText}>RE-AWAKEN ALL</Text>
        </Pressable>
      )}

      {/* DELETE MODAL */}
      <Modal transparent visible={deleteModalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { borderTopColor: PRIMARY }]}>
            <Text style={styles.modalTitle}>Exile this scroll forever?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.modalCancel}>RETREAT</Text>
              </Pressable>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={handleDelete}>
                <Text style={styles.modalConfirmDelete}>EXILE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* RESTORE MODAL */}
      <Modal transparent visible={restoreModalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { borderTopColor: "#2ecc71" }]}>
            <Text style={styles.modalTitle}>Restore to active duty?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={() => setRestoreModalVisible(false)}>
                <Text style={styles.modalCancel}>STAY</Text>
              </Pressable>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={handleRestore}>
                <Text style={styles.modalConfirmRestore}>RESTORE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* RESTORE ALL MODAL */}
      <Modal transparent visible={restoreAllModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { borderTopColor: "#2ecc71" }]}>
            <Text style={styles.modalTitle}>Restore all scrolls?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={() => setRestoreAllModal(false)}>
                <Text style={styles.modalCancel}>CANCEL</Text>
              </Pressable>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={handleRestoreAll}>
                <Text style={styles.modalConfirmRestore}>RESTORE ALL</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 15, backgroundColor: BG },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginVertical: 15,
    letterSpacing: 2,
  },

  // --- SORTER BOXES ---
  filterContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 8,
    alignItems: "center",
  },
  searchInput: {
    flex: 1.4,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
    fontSize: 13,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    height: 42,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    color: ACCENT,
    width: "120%", // Pushes icon further right to leave room for text
    marginLeft: -10, // Adjusts text alignment after width expansion
    transform: [{ scale: 0.85 }], // Shrinks text to prevent cut-off
  },

  // --- CARDS ---
  todoCard: {
    padding: 12,
    backgroundColor: CARD_BG,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 2,
    borderLeftColor: "#333",
  },
  todoText: {
    fontSize: 14,
    color: "#555",
    textDecorationLine: "line-through",
  },
  categoryTag: {
    fontSize: 10,
    color: "#444",
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },
  actionRow: { flexDirection: "row" },
  miniBtn: {
    padding: 8,
    backgroundColor: "#121212",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
  },

  // --- BUTTONS ---
  restoreAllBtn: {
    backgroundColor: "#2ecc71",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  restoreAllText: { color: "#fff", fontWeight: "900", letterSpacing: 1 },
  emptyText: { textAlign: "center", color: "#444", marginTop: 40, fontStyle: "italic" },

  // --- MODALS ---
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 25,
    borderTopWidth: 5,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 30,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalCancel: { color: "#888", fontWeight: "700" },
  modalConfirmDelete: { color: PRIMARY, fontWeight: "900" },
  modalConfirmRestore: { color: "#2ecc71", fontWeight: "900" },
}); 