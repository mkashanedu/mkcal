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
      <NativeTabs.Trigger name="emergency">
        <Icon sf={{ default: "cross.circle", selected: "cross.circle.fill" }} />
        <Label>Emergency</Label>
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
      screenOptions={{
        tabBarActiveTintColor: C.tint,
        tabBarInactiveTintColor: C.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : isDark ? "#0D1B2A" : "#fff",
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: isDark ? "#1E2D3D" : "#E2E8F0",
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
                { backgroundColor: isDark ? "#0D1B2A" : "#fff" },
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
        name="emergency"
        options={{
          title: "Emergency",
          tabBarActiveTintColor: "#AE2012",
          tabBarInactiveTintColor: "#C0392B",
          tabBarIcon: () =>
            isIOS ? (
              <SymbolView name="cross.circle.fill" tintColor="#AE2012" size={24} />
            ) : (
              <Feather name="alert-circle" size={22} color="#AE2012" />
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
