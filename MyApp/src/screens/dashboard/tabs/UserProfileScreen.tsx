import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant?: {
    id: string;
    name: string;
  };
}

export default function UserProfileScreen({ route }: any) {
  const { user }: { user: User } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user.role}</Text>
        {user.tenant && (
          <>
            <Text style={styles.label}>Tenant:</Text>
            <Text style={styles.value}>{user.tenant.name}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  profileInfo: { marginBottom: 30 },
  label: { fontWeight: "bold", marginTop: 10 },
  value: { marginBottom: 10 },
});
