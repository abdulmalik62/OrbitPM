import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getMyAssignedTasks, updateTaskStatus } from "../../services/api";
import { AuthContext } from "../../store/AuthContext";
import UserProfileScreen from "./tabs/UserProfileScreen";

const Tab = createMaterialTopTabNavigator();

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignedTo?: { id: string; name: string; email: string };
}

function TasksTab() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const tasksData = await getMyAssignedTasks();
      setTasks(tasksData);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      await updateTaskStatus(taskId, status);
      fetchTasks();
      Alert.alert("Success", "Task status updated");
    } catch (error) {
      Alert.alert("Error", "Failed to update task status");
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description || "No description"}</Text>
      <Text style={styles.taskStatus}>Status: {item.status}</Text>
      <View style={styles.taskActions}>
        <View style={styles.statusPickerContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Picker
            selectedValue={item.status}
            style={styles.statusPicker}
            onValueChange={(itemValue) => handleUpdateStatus(item.id, itemValue)}
          >
            <Picker.Item label="TODO" value="TODO" />
            <Picker.Item label="IN_PROGRESS" value="IN_PROGRESS" />
            <Picker.Item label="DONE" value="DONE" />
          </Picker>
        </View>
      </View>
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
      <Text style={styles.title}>My Assigned Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks assigned to you</Text>}
      />
    </View>
  );
}

function ProfileTab() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return <UserProfileScreen route={{ params: { user } }} />;
}

export default function MemberScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tasks" component={TasksTab} />
      <Tab.Screen name="Profile" component={ProfileTab} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  taskItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  taskTitle: { fontSize: 18, fontWeight: "bold" },
  taskDescription: { fontSize: 14, color: "#666", marginBottom: 8 },
  taskStatus: { fontSize: 14, color: "#007bff" },
  taskActions: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  statusPickerContainer: { flexDirection: "row", alignItems: "center", marginRight: 8 },
  statusLabel: { fontSize: 14, marginRight: 8 },
  statusPicker: { height: 40, width: 120 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
});
