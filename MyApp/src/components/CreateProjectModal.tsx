import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
}

export default function CreateProjectModal({ visible, onClose, onSubmit }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (name) {
      onSubmit(name, description || undefined);
      setName("");
      setDescription("");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New Project</Text>
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
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
  modal: { backgroundColor: "white", padding: 20, borderRadius: 8, width: "80%" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, marginBottom: 12, borderRadius: 4 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: { backgroundColor: "#6c757d", padding: 12, borderRadius: 4, flex: 1, marginRight: 8 },
  cancelButtonText: { color: "white", textAlign: "center" },
  submitButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 4, flex: 1 },
  submitButtonText: { color: "white", textAlign: "center" },
});
