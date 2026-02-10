import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../store/AuthContext";
import { api } from "../../services/api";

export default function RegisterScreen() {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [tenantName, setTenantName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const query = `
        mutation Register($tenantName: String!, $name: String!, $email: String!, $password: String!) {
          register(tenantName: $tenantName, name: $name, email: $email, password: $password) {
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
        variables: { tenantName, name, email, password },
      });

      if (res.data.errors) {
        Alert.alert("Error", res.data.errors[0].message);
        return;
      }

      Alert.alert("Success", "Registration successful! Please login.");
      navigation.navigate('Login' as never);
    } catch (error) {
      console.log("Register error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tenant Name"
        onChangeText={setTenantName}
        style={styles.input}
      />
      <TextInput
        placeholder="Name"
        onChangeText={setName}
        style={styles.input}
      />
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
      <Button title="Register" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  loginText: { color: 'blue', textAlign: 'center', marginTop: 10 },
});
