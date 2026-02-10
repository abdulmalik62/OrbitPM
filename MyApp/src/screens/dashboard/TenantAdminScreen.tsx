import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AuthContext } from "../../store/AuthContext";
import TenantUsersScreen from "./tenant/TenantUsersScreen";
import TenantProjectsScreen from "./tenant/TenantProjectsScreen";
import TenantTasksScreen from "./tenant/TenantTasksScreen";

const Tab = createMaterialTopTabNavigator();

export default function TenantAdminScreen() {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tenantName}>{user?.tenantName}</Text>
        <Text style={styles.userName}>{user?.name}</Text>
      </View>
      <Tab.Navigator>
        <Tab.Screen name="Users" component={TenantUsersScreen} />
        <Tab.Screen name="Projects" component={TenantProjectsScreen} />
        <Tab.Screen name="Tasks" component={TenantTasksScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, backgroundColor: "#f8f9fa", alignItems: "center" },
  tenantName: { fontSize: 18, fontWeight: "bold", color: "#007bff" },
  userName: { fontSize: 16, color: "#666" },
});
