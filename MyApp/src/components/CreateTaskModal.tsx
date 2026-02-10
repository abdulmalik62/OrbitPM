import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string, assignedTo?: string) => void;
  users: User[];
}

export default function CreateTaskModal({ visible, onClose, onSubmit, users }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    if (title) {
      onSubmit(title, description || undefined, assignedTo);
      setTitle("");
      setDescription("");
      setAssignedTo(undefined);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, assignedTo === item.id && styles.selected]}
      onPress={() => setAssignedTo(assignedTo === item.id ? undefined : item.id)}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Text style={styles.subtitle}>Assign to (optional):</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            style={styles.userList}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modal: { backgroundColor: "white", padding: 20, borderRadius: 8, width: "80%", maxHeight: "80%" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, marginBottom: 12, borderRadius: 4 },
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  userList: { maxHeight: 150, marginBottom: 16 },
  userItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  selected: { backgroundColor: "#e3f2fd" },
  userName: { fontSize: 16, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "#666" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: { backgroundColor: "#6c757d", padding: 12, borderRadius: 4, flex: 1, marginRight: 8 },
  cancelButtonText: { color: "white", textAlign: "center" },
  submitButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 4, flex: 1 },
  submitButtonText: { color: "white", textAlign: "center" },
});
