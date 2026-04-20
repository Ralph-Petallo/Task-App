import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Todo } from "../../context/TodoContext";
import { useTodos } from "../../context/TodoContext";

const PRIMARY = "#d32f2f"; // Crimson Red
const ACCENT = "#fbc02d";  // Kunai Gold
const BG = "#000";      // Absolute Black
const CARD_BG = "#1e1e1e"; // Smoke Gray

export default function HomeTodo() {
  const { activeTodos, addTodo, finishTodo, editTodo, removeTodo } = useTodos(); // destructing one array, and functions from TodoContext

  const [textInput, setText] = useState<string>("");
  const [categoryInput, setCategory] = useState<string>("General");
  const [search, setSearch] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editItem, setEditItem] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const addItem = () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addTodo(trimmed, categoryInput);
    setText("");
    setCategory("General");
  };

  const openEditModal = (item: Todo) => {
    setEditItem(item.text);
    setEditId(item.id);
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (!editId) return;
    editTodo(editId, editItem.trim());
    setModalVisible(false);
  };

  const confirmDelete = (item: Todo) => {
    setSelectedTodo(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedTodo) removeTodo(selectedTodo.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setDeleteModalVisible(false);
    setSelectedTodo(null);
  };

  const filteredTodos = activeTodos.filter(
    (todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory === "All" || todo.category === filterCategory)
  );

  const renderTodo = ({ item }: { item: Todo }) => (
    <View style={styles.todoCard}>
      <View style={styles.todoContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.categoryTag}>• {item.category}</Text>
          <Text style={styles.todoText}>{item.text}</Text>
        </View>

        <View style={styles.actionBtns}>
          <Pressable
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={[styles.miniBtn, styles.editBtn]}
            onPress={() => openEditModal(item)}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </Pressable>
          <Pressable
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={[styles.miniBtn, styles.doneBtn]}
            onPress={() => finishTodo(item.id)}>
            <Ionicons name="checkmark-sharp" size={18} color="#2ecc71" />
          </Pressable>
          <Pressable
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={[styles.miniBtn, styles.deleteBtn]}
            onPress={() => confirmDelete(item)}>
            <Ionicons name="trash-bin-outline" size={16} color={PRIMARY} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={renderTodo}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={styles.headerPadding}>
            <Text style={styles.title}>Ninja Task 🥷</Text>

            <View style={styles.card}>
              <TextInput
                value={textInput}
                style={styles.input}
                placeholder="New Mission..."
                placeholderTextColor="#555"
                onChangeText={setText}
              />
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={categoryInput}
                  onValueChange={setCategory}
                  style={styles.picker}
                  dropdownIconColor={PRIMARY}
                >
                  <Picker.Item label="All" value="All" />
                  <Picker.Item label="💼 Work" value="Work" />
                  <Picker.Item label="📚 School" value="School" />
                  <Picker.Item label="🏠 Personal" value="Personal" />
                </Picker>
              </View>
              <Pressable onPress={addItem} style={styles.addBtn}>
                <Text style={styles.addText}>DEPLOY</Text>
              </Pressable>
            </View>

            <View style={styles.filterRow}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search Scrolls..."
                placeholderTextColor="#555"
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
              <View style={[styles.pickerWrapper, { flex: 0.8, marginBottom: 0, marginLeft: 8 }]}>
                <Picker
                  selectedValue={filterCategory}
                  onValueChange={setFilterCategory}
                  style={styles.picker}
                  dropdownIconColor={ACCENT}
                >
                  <Picker.Item label="All" value="All" />
                  <Picker.Item label="💼 Work" value="Work" />
                  <Picker.Item label="📚 School" value="School" />
                  <Picker.Item label="🏠 Personal" value="Personal" />
                </Picker>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>The dojo is empty... 🍃</Text>}
      />

      {/* EDIT MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Mission</Text>
            <TextInput value={editItem} onChangeText={setEditItem} style={styles.input} />
            <View style={styles.modalBtns}>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>Retreat</Text>
              </Pressable>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={saveEdit}><Text style={styles.confirm}>Update</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* DELETE MODAL */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Eliminate this task?</Text>
            <View style={styles.modalBtns}>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={() => setDeleteModalVisible(false)}><Text style={styles.cancel}>Cancel</Text></Pressable>
              <Pressable
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={handleDelete}><Text style={styles.deleteConfirm}>Eliminate</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  headerPadding: { padding: 15 },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: "#fff",
    letterSpacing: 3,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: CARD_BG,
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  input: {
    backgroundColor: "#121212",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    color: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  pickerWrapper: { backgroundColor: "#121212", borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
  picker: { height: 50, color: "#fff" },
  addBtn: { backgroundColor: PRIMARY, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  addText: { color: "#fff", fontWeight: "900", letterSpacing: 1 },
  filterRow: { flexDirection: 'row', marginBottom: 10 },
  todoCard: { backgroundColor: CARD_BG, padding: 12, borderRadius: 10, marginBottom: 8, marginHorizontal: 15, borderLeftWidth: 4, borderLeftColor: ACCENT },
  todoContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryTag: { fontSize: 10, color: ACCENT, fontWeight: "800", textTransform: 'uppercase', marginBottom: 2 },
  todoText: { fontSize: 15, color: "#eee" },
  actionBtns: { flexDirection: "row", gap: 8 },
  miniBtn: { width: 34, height: 34, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { backgroundColor: "#2a1212", borderWidth: 1, borderColor: PRIMARY },
  editBtn: { backgroundColor: "#2a2a2a" },
  doneBtn: { backgroundColor: "#122a12", borderWidth: 1, borderColor: "#2ecc71" },
  empty: { textAlign: "center", marginTop: 40, color: "#555", fontStyle: 'italic' },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", padding: 30 },
  modalCard: { backgroundColor: CARD_BG, borderRadius: 12, padding: 20, borderTopWidth: 4, borderTopColor: PRIMARY },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  modalBtns: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  cancel: { color: "#888", fontWeight: "700" },
  confirm: { color: "#2ecc71", fontWeight: "700" },
  deleteConfirm: { color: PRIMARY, fontWeight: "700" },
});