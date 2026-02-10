import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAllUsers } from "../../../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant: {
    id: string;
    name: string;
  };
}

interface Tenant {
  id: string;
  name: string;
}

export default function TenantProfileScreen({ route, navigation }: any) {
  const { tenant }: { tenant: Tenant } = route.params;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      const tenantUsers = allUsers.filter((user: User) => user.tenant?.id === tenant.id);
      setUsers(tenantUsers);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [tenant.id]);

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate("UserProfile", { user: item })}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <Text style={styles.userTenant}>Tenant: {item.tenant?.name}</Text>
    </TouchableOpacity>
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
      <Text style={styles.title}>{tenant.name}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        ListEmptyComponent={<Text style={styles.emptyText}>No users in this tenant</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  userItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "#666" },
  userTenant: { fontSize: 14, color: "#007bff" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
});
