import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { getMyProjects, createProject, deleteProject } from "../../../services/api";
import CreateProjectModal from "../../../components/CreateProjectModal";

interface Project {
  id: string;
  name: string;
  description?: string;
  members: { user: { id: string; name: string; email: string }; role: string }[];
}

export default function TenantProjectsScreen({ navigation }: any) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (name: string, description?: string) => {
    try {
      await createProject(name, description);
      setModalVisible(false);
      fetchProjects();
      Alert.alert("Success", "Project created successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to create project");
    }
  };

  const handleDeleteProject = (projectId: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this project?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteProject(projectId);
            fetchProjects();
            Alert.alert("Success", "Project deleted");
          } catch (error) {
            Alert.alert("Error", "Failed to delete project");
          }
        },
      },
    ]);
  };

  const renderProject = ({ item }: { item: Project }) => (
    <View style={styles.projectItem}>
      <Text style={styles.projectName}>{item.name}</Text>
      <Text style={styles.projectDescription}>{item.description || "No description"}</Text>
      <Text style={styles.membersCount}>{item.members.length} members</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate("ProjectDetails", { projectId: item.id })}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProject(item.id)}
        >
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
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Project</Text>
      </TouchableOpacity>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        ListEmptyComponent={<Text style={styles.emptyText}>No projects found</Text>}
      />
      <CreateProjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateProject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  projectItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  projectName: { fontSize: 18, fontWeight: "bold" },
  projectDescription: { fontSize: 14, color: "#666", marginBottom: 8 },
  membersCount: { fontSize: 12, color: "#999" },
  buttonRow: { flexDirection: "row", marginTop: 8 },
  viewButton: { backgroundColor: "#28a745", padding: 8, borderRadius: 4, marginRight: 8 },
  viewButtonText: { color: "white", textAlign: "center" },
  deleteButton: { backgroundColor: "#dc3545", padding: 8, borderRadius: 4 },
  deleteButtonText: { color: "white", textAlign: "center" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
});
