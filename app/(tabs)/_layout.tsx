import React from "react";
import { Tabs } from "expo-router";
import { 
  BarChart, 
  Home, 
  BookOpen, 
  Clock, 
  Settings 
} from "lucide-react-native";
import Colors from "../constants/colors";
import { FontDisplay } from "expo-font";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.light,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          // backgroundColor: Colors.card.light,
          display: 'none',
          // dont display the header
          height: 40,
          padding: 12,

        },
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.text.light,
          // dont display the heaeder title
          display: 'none',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: "Trades",
          tabBarIcon: ({ color, size }) => <BarChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Reminders",
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}