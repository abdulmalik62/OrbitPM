import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { getMyTenantUsers, createTenantUser } from "../../../services/api";
import CreateUserModal from "../../../components/CreateUserModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function TenantUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getMyTenantUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (name: string, email: string, password: string, role: string) => {
    try {
      await createTenantUser(name, email, password, role);
      setModalVisible(false);
      fetchUsers();
      Alert.alert("Success", "User created successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to create user");
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <Text style={styles.userRole}>{item.role}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add User</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
      />
      <CreateUserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  userItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "#666" },
  userRole: { fontSize: 12, color: "#999" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
});
