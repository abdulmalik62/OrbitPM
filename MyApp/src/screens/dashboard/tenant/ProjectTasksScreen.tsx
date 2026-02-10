import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { getProjectTasks, createTask, updateTaskStatus, deleteTask, getMyTenantUsers } from "../../../services/api";
import CreateTaskModal from "../../../components/CreateTaskModal";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignedTo?: { id: string; name: string; email: string };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProjectTasksScreen({ route }: any) {
  const { projectId, projectName } = route.params;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const [tasksData, usersData] = await Promise.all([getProjectTasks(projectId), getMyTenantUsers()]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleCreateTask = async (title: string, description?: string, assignedTo?: string) => {
    try {
      await createTask(projectId, title, description, assignedTo);
      setModalVisible(false);
      fetchData();
      Alert.alert("Success", "Task created");
    } catch (error) {
      Alert.alert("Error", "Failed to create task");
    }
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      await updateTaskStatus(taskId, status);
      fetchData();
      Alert.alert("Success", "Task status updated");
    } catch (error) {
      Alert.alert("Error", "Failed to update task status");
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this task?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteTask(taskId);
            fetchData();
            Alert.alert("Success", "Task deleted");
          } catch (error) {
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description || "No description"}</Text>
      <Text style={styles.taskStatus}>Status: {item.status}</Text>
      <Text style={styles.taskAssignee}>
        Assigned to: {item.assignedTo ? item.assignedTo.name : "Unassigned"}
      </Text>
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => handleUpdateStatus(item.id, item.status === "TODO" ? "IN_PROGRESS" : item.status === "IN_PROGRESS" ? "DONE" : "TODO")}
        >
          <Text style={styles.statusButtonText}>Change Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
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
      <Text style={styles.title}>Tasks for {projectName}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found</Text>}
      />
      <CreateTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateTask}
        users={users}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  addButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  taskItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  taskTitle: { fontSize: 18, fontWeight: "bold" },
  taskDescription: { fontSize: 14, color: "#666", marginBottom: 8 },
  taskStatus: { fontSize: 14, color: "#007bff" },
  taskAssignee: { fontSize: 14, color: "#666" },
  taskActions: { flexDirection: "row", marginTop: 12 },
  statusButton: { backgroundColor: "#28a745", padding: 8, borderRadius: 4, marginRight: 8 },
  statusButtonText: { color: "white", textAlign: "center" },
  deleteButton: { backgroundColor: "#dc3545", padding: 8, borderRadius: 4 },
  deleteButtonText: { color: "white", textAlign: "center" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
});
