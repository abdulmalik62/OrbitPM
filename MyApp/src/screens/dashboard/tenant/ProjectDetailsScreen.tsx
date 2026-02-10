import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { getProjectById, getMyTenantUsers, addMember, removeMember, updateMemberRole, updateProject } from "../../../services/api";
import AddMemberModal from "../../../components/AddMemberModal";
import EditProjectModal from "../../../components/EditProjectModal";

interface Project {
  id: string;
  name: string;
  description?: string;
  members: { user: { id: string; name: string; email: string }; role: string }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProjectDetailsScreen({ route }: any) {
  const { projectId } = route.params;
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const [projectData, usersData] = await Promise.all([getProjectById(projectId), getMyTenantUsers()]);
      setProject(projectData);
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

  const handleAddMember = async (userId: string, role: string) => {
    try {
      await addMember(projectId, userId, role);
      setAddModalVisible(false);
      fetchData();
      Alert.alert("Success", "Member added");
    } catch (error) {
      Alert.alert("Error", "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember(projectId, userId);
      fetchData();
      Alert.alert("Success", "Member removed");
    } catch (error) {
      Alert.alert("Error", "Failed to remove member");
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await updateMemberRole(projectId, userId, role);
      fetchData();
      Alert.alert("Success", "Role updated");
    } catch (error) {
      Alert.alert("Error", "Failed to update role");
    }
  };

  const handleEditProject = async (name: string, description?: string) => {
    try {
      await updateProject(projectId, name, description);
      setEditModalVisible(false);
      fetchData();
      Alert.alert("Success", "Project updated");
    } catch (error) {
      Alert.alert("Error", "Failed to update project");
    }
  };

  const renderMember = ({ item }: { item: { user: User; role: string } }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberName}>{item.user.name}</Text>
      <Text style={styles.memberEmail}>{item.user.email}</Text>
      <Text style={styles.memberRole}>{item.role}</Text>
      <View style={styles.memberActions}>
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleUpdateRole(item.user.id, item.role === "MEMBER" ? "PROJECT_ADMIN" : "MEMBER")}
        >
          <Text style={styles.roleButtonText}>Change Role</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveMember(item.user.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
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

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Project not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{project.name}</Text>
        <Text style={styles.description}>{project.description || "No description"}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
          <Text style={styles.editButtonText}>Edit Project</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.membersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Members</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
            <Text style={styles.addButtonText}>Add Member</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={project.members}
          keyExtractor={(item) => item.user.id}
          renderItem={renderMember}
          ListEmptyComponent={<Text style={styles.emptyText}>No members</Text>}
        />
      </View>
      <AddMemberModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleAddMember}
        users={users.filter(u => !project.members.some(m => m.user.id === u.id))}
      />
      <EditProjectModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleEditProject}
        initialName={project.name}
        initialDescription={project.description}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, color: "#666", marginBottom: 16 },
  editButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 4, alignSelf: "flex-start" },
  editButtonText: { color: "white", textAlign: "center" },
  membersSection: { flex: 1 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  addButton: { backgroundColor: "#28a745", padding: 8, borderRadius: 4 },
  addButtonText: { color: "white", textAlign: "center" },
  memberItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  memberName: { fontSize: 18, fontWeight: "bold" },
  memberEmail: { fontSize: 14, color: "#666" },
  memberRole: { fontSize: 14, color: "#007bff", marginBottom: 8 },
  memberActions: { flexDirection: "row" },
  roleButton: { backgroundColor: "#ffc107", padding: 8, borderRadius: 4, marginRight: 8 },
  roleButtonText: { color: "black", textAlign: "center" },
  removeButton: { backgroundColor: "#dc3545", padding: 8, borderRadius: 4 },
  removeButtonText: { color: "white", textAlign: "center" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666" },
});
