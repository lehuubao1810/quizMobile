import { Redirect, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "expo-status-bar";
import { useAppSelector } from "@/redux/hooks";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "HomeScreen",
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isAuth } = useAppSelector((state) => state.authReducer);

  if (!isAuth) {
    return <Redirect href="/LoginScreen" />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="HomeScreen"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
            tabBarShowLabel: false,
          }}
        />
        <Tabs.Screen
          name="QuizRealTimeScreen"
          options={{
            title: "Quiz Real Time",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "book" : "book-outline"}
                color={color}
              />
            ),
            tabBarShowLabel: false,
          }}
        />
        <Tabs.Screen
          name="StatScreen"
          options={{
            title: "Stat",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "bar-chart" : "bar-chart-outline"}
                color={color}
              />
            ),
            tabBarShowLabel: false,
          }}
        />
        <Tabs.Screen
          name="ProfileScreen"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                color={color}
              />
            ),
            tabBarShowLabel: false,
          }}
        />
      </Tabs>
      <StatusBar
        backgroundColor={`${Colors[colorScheme ?? "light"].background}`}
        style={`${colorScheme === "dark" ? "light" : "dark"}`}
      />
    </>
  );
}
