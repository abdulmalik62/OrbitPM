import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TenantsTab from "./tabs/TenantsTab";
import UsersTab from "./tabs/UsersTab";
import ProfileTab from "./tabs/ProfileTab";

const Tab = createMaterialTopTabNavigator();

export default function SystemAdminScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tenants" component={TenantsTab} />
      <Tab.Screen name="Users" component={UsersTab} />
      <Tab.Screen name="Profile" component={ProfileTab} />
    </Tab.Navigator>
  );
}
