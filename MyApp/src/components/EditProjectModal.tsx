import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";

interface EditProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
  initialName: string;
  initialDescription?: string;
}

export default function EditProjectModal({ visible, onClose, onSubmit, initialName, initialDescription }: EditProjectModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription || "");

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription || "");
  }, [initialName, initialDescription]);

  const handleSubmit = () => {
    if (name) {
      onSubmit(name, description || undefined);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Project</Text>
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
              <Text style={styles.submitButtonText}>Update</Text>
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
