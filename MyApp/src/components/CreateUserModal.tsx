import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string, password: string, role: string) => void;
}

export default function CreateUserModal({ visible, onClose, onSubmit }: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");

  const handleSubmit = () => {
    if (name && email && password) {
      onSubmit(name, email, password, role);
      setName("");
      setEmail("");
      setPassword("");
      setRole("MEMBER");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New User</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.subtitle}>Role:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === "MEMBER" && styles.selectedRole]}
              onPress={() => setRole("MEMBER")}
            >
              <Text style={styles.roleText}>Member</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === "TENANT_ADMIN" && styles.selectedRole]}
              onPress={() => setRole("TENANT_ADMIN")}
            >
              <Text style={styles.roleText}>Tenant Admin</Text>
            </TouchableOpacity>
          </View>
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
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  roleContainer: { flexDirection: "row", marginBottom: 16 },
  roleButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: "#ddd", marginHorizontal: 4, borderRadius: 4 },
  selectedRole: { backgroundColor: "#007bff", borderColor: "#007bff" },
  roleText: { textAlign: "center", color: "#333" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: { backgroundColor: "#6c757d", padding: 12, borderRadius: 4, flex: 1, marginRight: 8 },
  cancelButtonText: { color: "white", textAlign: "center" },
  submitButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 4, flex: 1 },
  submitButtonText: { color: "white", textAlign: "center" },
});
