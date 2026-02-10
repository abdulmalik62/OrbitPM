import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../store/AuthContext";
import { api } from "../../services/api";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");

  const handleLogin = async () => {
    try {
      const query = `
        mutation Login($email: String!, $password: String!, $tenantName: String) {
          login(email: $email, password: $password, tenantName: $tenantName) {
            token
            name
            email
            role
            tenantName
          }
        }
      `;

      const res = await api.post("", {
        query,
        variables: { email, password, tenantName: tenantName || null },
      });

      if (res.data.errors) {
        Alert.alert("Error", res.data.errors[0].message);
        return;
      }

      const { token, name, email: userEmail, role, tenantName: userTenantName } = res.data.data.login;
      const user = { name, email: userEmail, role, tenantName: userTenantName };

      login(token, user);
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Tenant Name (optional for system admin)"
        onChangeText={setTenantName}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  registerText: { color: 'blue', textAlign: 'center', marginTop: 10 },
});
