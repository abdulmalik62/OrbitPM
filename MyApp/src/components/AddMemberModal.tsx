import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (userId: string, role: string) => void;
  users: User[];
}

export default function AddMemberModal({ visible, onClose, onSubmit, users }: AddMemberModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState("MEMBER");

  const handleSubmit = () => {
    if (selectedUser) {
      onSubmit(selectedUser.id, role);
      setSelectedUser(null);
      setRole("MEMBER");
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, selectedUser?.id === item.id && styles.selected]}
      onPress={() => setSelectedUser(item)}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Member</Text>
          <Text style={styles.subtitle}>Select a user:</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            style={styles.userList}
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
              style={[styles.roleButton, role === "PROJECT_ADMIN" && styles.selectedRole]}
              onPress={() => setRole("PROJECT_ADMIN")}
            >
              <Text style={styles.roleText}>Project Admin</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={!selectedUser}>
              <Text style={styles.submitButtonText}>Add</Text>
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
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  userList: { maxHeight: 200, marginBottom: 16 },
  userItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  selected: { backgroundColor: "#e3f2fd" },
  userName: { fontSize: 16, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "#666" },
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
