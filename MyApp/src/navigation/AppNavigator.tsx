import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNavigationContainerRef } from "@react-navigation/native";
import { AuthContext } from "../store/AuthContext";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import SystemAdminScreen from "../screens/dashboard/SystemAdminScreen";
import TenantAdminScreen from "../screens/dashboard/TenantAdminScreen";
import MemberScreen from "../screens/dashboard/MemberScreen";
import ProjectDetailsScreen from "../screens/dashboard/tenant/ProjectDetailsScreen";
import ProjectTasksScreen from "../screens/dashboard/tenant/ProjectTasksScreen";
import TenantProfileScreen from "../screens/dashboard/tabs/TenantProfileScreen";
import UserProfileScreen from "../screens/dashboard/tabs/UserProfileScreen";

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function AppNavigator() {
  const { token, user } = useContext(AuthContext);

  let DashboardScreen = MemberScreen; // Default to MemberScreen
  if (user) {
    switch (user.role) {
      case "SYSTEM_ADMIN":
        DashboardScreen = SystemAdminScreen;
        break;
      case "TENANT_ADMIN":
        DashboardScreen = TenantAdminScreen;
        break;
      case "MEMBER":
        DashboardScreen = MemberScreen;
        break;
      default:
        DashboardScreen = MemberScreen;
    }
  }

  return (
    <NavigationContainer key={token ? 'loggedIn' : 'loggedOut'}>
      {!token || !user ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
          <Stack.Screen name="ProjectTasks" component={ProjectTasksScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
