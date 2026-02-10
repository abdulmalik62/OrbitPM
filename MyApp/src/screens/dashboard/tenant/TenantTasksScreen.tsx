import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { getMyProjects } from "../../../services/api";

interface Project {
  id: string;
  name: string;
  description?: string;
}

export default function TenantTasksScreen({ navigation }: any) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => navigation.getParent().navigate("ProjectTasks", { projectId: item.id, projectName: item.name })}
    >
      <Text style={styles.projectName}>{item.name}</Text>
      <Text style={styles.projectDescription}>{item.description || "No description"}</Text>
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
      <Text style={styles.title}>Select a Project to Manage Tasks</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        ListEmptyComponent={<Text style={styles.emptyText}>No projects found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  projectItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  projectName: { fontSize: 18, fontWeight: "bold" },
  projectDescription: { fontSize: 14, color: "#666" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
});
