import { useState } from "react";
import { Text, View, StyleSheet, TextInput, Image, FlatList, Button, Modal } from "react-native";

export default function Index() {
  const [todo, setTodo] = useState(['Wash plates', 'Take out trash', 'Do laundry']);
  const [textInput, setText] = useState("");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Add new item
  const addItem = () => {
    if (!textInput.trim()) return alert("Please enter a todo item");
    setTodo([...todo, textInput]);
    setText("");
  };

  // Delete item
  const removeTodo = (itemToRemove: string) => {
    setTodo(todo.filter((item) => item !== itemToRemove));
  };

  // Open edit modal
  const openEditModal = (item: string, index: number) => {
    setEditItem(item);
    setEditIndex(index);
    setModalVisible(true);
  };

  // Save edited item
  const saveEdit = () => {
    if (editIndex === null) return;
    const updated = [...todo];
    updated[editIndex] = editItem;
    setTodo(updated);
    setModalVisible(false);
  };

  // Render each todo item
  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{item}</Text>

      <View style={styles.actionBtns}>

        <View style={styles.iconSpace}>
          <Image
            source={{
              uri: 'asa.png',
            }}
            style={{ width: 10, height: 10 }}
          />
          <Button color="orange" title="Edit" onPress={() => openEditModal(item, index)} />
        </View>
        <Button color="forestgreen" title="Done" onPress={() => removeTodo(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>📝 To Do List</Text>

      <TextInput
        value={textInput}
        style={styles.input}
        placeholder="Enter item name"
        onChangeText={setText}
      />

      <View style={styles.addBtn}>
        <Button color="green" title="Add Item" onPress={addItem} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Your Tasks</Text>

        <FlatList
          data={todo}
          keyExtractor={(index) => index.toString()}
          renderItem={renderItem}
        />
      </View>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Todo</Text>
            <TextInput
              value={editItem}
              onChangeText={setEditItem}
              style={styles.modalInput}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e6f2ff", alignItems: "center", paddingTop: 50 },
  titleText: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "60%", height: 45, backgroundColor: "#fff",
    borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: "#ccc",
    marginBottom: 10,
  },
  addBtn: { marginBottom: 20, width: "60%" },
  card: {
    width: "90%", backgroundColor: "#fff", borderRadius: 10, padding: 15,
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5,
  },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  todoItem: {
    borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", borderBottomColor: "#eee", paddingVertical: 10,
  },
  todoText: { fontSize: 16, flex: 1 },
  actionBtns: { flexDirection: "row", width: 250, justifyContent: "space-between" },
  iconSpace: { flexDirection: "row", justifyContent: 'space-between', width: 150, },

  // Modal
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "50%", backgroundColor: "#fff", borderRadius: 10, padding: 20},
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  modalInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15, width:250 },
  modalButtons: { flexDirection: "row", justifyContent: "space-evenly" },
});
