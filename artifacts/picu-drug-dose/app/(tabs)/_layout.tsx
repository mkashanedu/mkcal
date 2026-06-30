import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import Colors from "@/constants/colors";

const C = Colors.light;

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "pills", selected: "pills.fill" }} />
        <Label>Drugs</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="infusion">
        <Icon sf={{ default: "drop", selected: "drop.fill" }} />
        <Label>Infusion</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calculator">
        <Icon sf={{ default: "scalemass", selected: "scalemass.fill" }} />
        <Label>Calculator</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tools">
        <Icon sf={{ default: "stethoscope", selected: "stethoscope" }} />
        <Label>Tools</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calcs">
        <Icon sf={{ default: "flask", selected: "flask.fill" }} />
        <Label>Protocols</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="emergency">
        <Icon sf={{ default: "cross.circle", selected: "cross.circle.fill" }} />
        <Label>Emergency</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <Icon sf={{ default: "star", selected: "star.fill" }} />
        <Label>Favorites</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      initialRouteName="calculator"
      screenOptions={{
        tabBarActiveTintColor: C.tint,
        tabBarInactiveTintColor: C.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          display: "none",
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : isDark ? "#0B132B" : "#fff",
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: isDark ? "#1A2A4A" : "#E4EDF4",
          elevation: 0,
          height: isWeb ? 64 : undefined,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: Platform.OS === "android" ? 4 : 0,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: isDark ? "#0B132B" : "#fff" },
              ]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Drugs",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="pills" tintColor={color} size={24} />
            ) : (
              <Feather name="list" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="infusion"
        options={{
          title: "Infusion",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="drop.fill" tintColor={color} size={24} />
            ) : (
              <Feather name="activity" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="scalemass" tintColor={color} size={24} />
            ) : (
              <Feather name="sliders" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="stethoscope" tintColor={color} size={24} />
            ) : (
              <Feather name="tool" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="calcs"
        options={{
          title: "Protocols",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="list.clipboard" tintColor={color} size={24} />
            ) : (
              <Feather name="clipboard" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: "Emergency",
          tabBarActiveTintColor: "#6366F1",
          tabBarInactiveTintColor: "#818CF8",
          tabBarIcon: () =>
            isIOS ? (
              <SymbolView name="cross.circle.fill" tintColor="#6366F1" size={24} />
            ) : (
              <Feather name="alert-circle" size={22} color="#6366F1" />
            ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="star" tintColor={color} size={24} />
            ) : (
              <Feather name="star" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
