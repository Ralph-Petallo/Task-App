import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Todo, useTodos } from "../../context/TodoContext";

const PRIMARY = "#d32f2f"; // Crimson Red
const ACCENT = "#fbc02d";  // Kunai Gold
const BG = "#000"; //Absolute Black2  
const CARD_BG = "#1e1e1e";  // Smoke Gray


export default function TrashTodo() {
  const { trashedTodos, restoreTrashedTodo, deleteForever, loading } = useTodos();

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [restoreModal, setRestoreModal] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const confirmDelete = (todo: Todo) => {
    setSelectedTodo(todo);
    setDeleteModal(true);
  };

  const confirmRestore = (todo: Todo) => {
    setSelectedTodo(todo);
    setRestoreModal(true);
  };

  const handleDelete = () => {
    if (selectedTodo) {
      deleteForever(selectedTodo.id);
      console.log(selectedTodo)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setDeleteModal(false);
    setSelectedTodo(null);
  };

  const handleRestore = () => {
    if (selectedTodo) {
      restoreTrashedTodo(selectedTodo.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setRestoreModal(false);
    setSelectedTodo(null);
  };

  const renderTrash = ({ item }: { item: Todo }) => (
    <View style={styles.todoCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.todoText} numberOfLines={1}>
          {item.text}
        </Text>
        <Text style={styles.categoryTag}>
          Sector: {item.category}
        </Text>
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
          <Ionicons name="skull-outline" size={18} color={PRIMARY} />
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.body}>
        <Text style={styles.emptyText}>Searching the shadows...</Text>
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <Text style={styles.title}>Exiled Scrolls ☠️</Text>

      <FlatList
        data={trashedTodos}
        keyExtractor={(item) => item.id}
        renderItem={renderTrash}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No fallen scrolls found. 🌑</Text>
        }
      />

      {/* DELETE MODAL */}
      <Modal transparent visible={deleteModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { borderTopColor: PRIMARY }]}>
            <Text style={styles.modalTitle}>
              Erase this scroll from existence?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable onPress={() => setDeleteModal(false)}>
                <Text style={styles.modalCancel}>RETREAT</Text>
              </Pressable>
              <Pressable onPress={handleDelete}>
                <Text style={styles.modalConfirmDelete}>OBLITERATE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* RESTORE MODAL */}
      <Modal transparent visible={restoreModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { borderTopColor: "#2ecc71" }]}>
            <Text style={styles.modalTitle}>
              Return this scroll to duty?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable onPress={() => setRestoreModal(false)}>
                <Text style={styles.modalCancel}>STAY</Text>
              </Pressable>
              <Pressable onPress={handleRestore}>
                <Text style={styles.modalConfirmRestore}>RESTORE</Text>
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

  todoCard: {
    padding: 12,
    backgroundColor: CARD_BG,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 2,
    borderLeftColor: PRIMARY,
  },

  todoText: {
    fontSize: 14,
    color: "#aaa",
  },

  categoryTag: {
    fontSize: 10,
    color: ACCENT,
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

  emptyText: {
    textAlign: "center",
    color: "#444",
    marginTop: 40,
    fontStyle: "italic",
  },

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

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalCancel: { color: "#888", fontWeight: "700" },

  modalConfirmDelete: { color: PRIMARY, fontWeight: "900" },

  modalConfirmRestore: { color: "#2ecc71", fontWeight: "900" },
});
