import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { useDrawer } from "@/context/DrawerContext";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleDark } = useTheme();
  const { openDrawer } = useDrawer();
  const colors = Colors.light;

  const topPadding = insets.top;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0B132B" : "#F0F9FF" }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: isDark ? "#0A192F" : "#FFFFFF",
          },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={openDrawer}
            style={[styles.hamburgerBtn, { backgroundColor: isDark ? "#0A192F" : "#E8F4FA" }]}
            activeOpacity={0.7}
          >
            <Feather name="menu" size={20} color={isDark ? "#8892B0" : colors.tint} />
          </TouchableOpacity>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_700Bold" },
              ]}
              numberOfLines={1}
            >
              MKashanEdu
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: isDark ? "#8892B0" : "#8A9BB0", fontFamily: "Inter_400Regular" },
              ]}
            >
              Pediatric Clinical Suite
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleDark}
            style={[styles.darkToggle, { backgroundColor: isDark ? "#0A192F" : "#E8F4FA" }]}
            activeOpacity={0.7}
          >
            <Feather
              name={isDark ? "sun" : "moon"}
              size={16}
              color={isDark ? "#FFD700" : colors.tint}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Dose Calculator Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/calculator" as any)}
          activeOpacity={0.85}
          style={[
            styles.mainButton,
            {
              backgroundColor: isDark ? "#0E2A45" : "#FFFFFF",
              borderColor: colors.tint,
              shadowColor: colors.tint,
            },
          ]}
        >
          <View style={[styles.mainButtonIconWrap, { backgroundColor: colors.tint + "18" }]}>
            <Feather name="sliders" size={32} color={colors.tint} />
          </View>
          <View style={styles.mainButtonText}>
            <Text style={[styles.mainButtonTitle, { color: isDark ? "#FFFFFF" : "#0D1B2A", fontFamily: "Inter_700Bold" }]}>
              Dose Calculator
            </Text>
            <Text style={[styles.mainButtonDesc, { color: isDark ? "#8892B0" : "#64748B", fontFamily: "Inter_400Regular" }]}>
              Weight-based drug doses · 95+ medications
            </Text>
          </View>
          <Feather name="chevron-right" size={22} color={colors.tint} />
        </TouchableOpacity>

        {/* Emergency Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/emergency" as any)}
          activeOpacity={0.85}
          style={[
            styles.mainButton,
            styles.emergencyButton,
            {
              backgroundColor: "#DC2626",
              borderColor: "#B91C1C",
              shadowColor: "#DC2626",
            },
          ]}
        >
          <View style={[styles.mainButtonIconWrap, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
            <Feather name="alert-triangle" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.mainButtonText}>
            <Text style={[styles.mainButtonTitle, { color: "#FFFFFF", fontFamily: "Inter_700Bold" }]}>
              EMERGENCY
            </Text>
            <Text style={[styles.mainButtonDesc, { color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular" }]}>
              RESUSCITATION · Rapid reference
            </Text>
          </View>
          <Feather name="chevron-right" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={[styles.hint, { color: isDark ? "#3A5070" : "#B0C4D8", fontFamily: "Inter_400Regular" }]}>
          All other modules accessible via the menu ☰
        </Text>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={[styles.footerText, { color: isDark ? "#3A5070" : "#B0C4D8", fontFamily: "Inter_400Regular" }]}>
          Prepared By: M. Kashan, RN
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  darkToggle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
    gap: 16,
  },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  emergencyButton: {
    borderWidth: 0,
    shadowOpacity: 0.3,
  },
  mainButtonIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  mainButtonText: { flex: 1 },
  mainButtonTitle: {
    fontSize: 20,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  mainButtonDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    alignItems: "center",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
  },
});
