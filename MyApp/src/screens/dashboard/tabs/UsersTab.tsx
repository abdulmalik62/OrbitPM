import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { api } from "../../../services/api";

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

export default function UsersTab({ navigation }: any) {
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const query = `
        query {
          getAllUsers {
            id
            name
            email
            role
            tenant {
              id
              name
            }
          }
        }
      `;
      const res = await api.post("", { query });
      setUsers(res.data.data.getAllUsers);
    } catch (error) {
      console.log("Fetch users error:", error);
      Alert.alert("Error", "Failed to fetch users");
    }
  };

  const addUser = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      const mutation = `
        mutation CreateSystemAdmin($name: String!, $email: String!, $password: String!) {
          createSystemAdmin(name: $name, email: $email, password: $password) {
            id
            name
            email
            role
          }
        }
      `;
      const res = await api.post("", {
        query: mutation,
        variables: { name, email, password },
      });
      setUsers([...users, res.data.data.createSystemAdmin]);
      setName("");
      setEmail("");
      setPassword("");
      setModalVisible(false);
    } catch (error) {
      console.log("Add user error:", error);
      Alert.alert("Error", "Failed to add user");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add System Admin</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => navigation.navigate("UserProfile", { user: item })}
          >
            <Text style={styles.userName}>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>Role: {item.role}</Text>
            <Text>Tenant: {item.tenant?.name || "N/A"}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add System Admin</Text>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Add" onPress={addUser} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: { fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
