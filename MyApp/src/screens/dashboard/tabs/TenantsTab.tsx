import React, { useState, useEffect, useContext } from "react";
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

interface Tenant {
  id: string;
  name: string;
}

export default function TenantsTab({ navigation }: any) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tenantName, setTenantName] = useState("");

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const query = `
        query {
          getAllTenants {
            id
            name
          }
        }
      `;
      const res = await api.post("", { query });
      setTenants(res.data.data.getAllTenants);
    } catch (error) {
      console.log("Fetch tenants error:", error);
      Alert.alert("Error", "Failed to fetch tenants");
    }
  };

  const addTenant = async () => {
    if (!tenantName.trim()) {
      Alert.alert("Error", "Tenant name is required");
      return;
    }
    try {
      const mutation = `
        mutation CreateTenant($name: String!) {
          createTenant(name: $name) {
            id
            name
          }
        }
      `;
      const res = await api.post("", {
        query: mutation,
        variables: { name: tenantName },
      });
      setTenants([...tenants, res.data.data.createTenant]);
      setTenantName("");
      setModalVisible(false);
    } catch (error) {
      console.log("Add tenant error:", error);
      Alert.alert("Error", "Failed to add tenant");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Tenant</Text>
      </TouchableOpacity>
      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tenantItem}
            onPress={() => navigation.navigate("TenantProfile", { tenant: item })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Tenant</Text>
          <TextInput
            placeholder="Tenant Name"
            value={tenantName}
            onChangeText={setTenantName}
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Add" onPress={addTenant} />
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
  tenantItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
