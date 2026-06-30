import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDrawer } from "@/context/DrawerContext";
import { useTheme } from "@/context/ThemeContext";
import Colors from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.72, 320);

interface NavItem {
  label: string;
  icon: string;
  route: string;
  color: string;
  description: string;
  isEmergency?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: "home",
    route: "/(tabs)/index",
    color: "#0891B2",
    description: "Home screen",
  },
  {
    label: "EMERGENCY / RESUSCITATION",
    icon: "alert-triangle",
    route: "/(tabs)/emergency",
    color: "#DC2626",
    description: "Rapid resuscitation reference",
    isEmergency: true,
  },
  {
    label: "Drug Infusions",
    icon: "activity",
    route: "/(tabs)/infusion",
    color: "#7C3AED",
    description: "IV drip & infusion calculator",
  },
  {
    label: "Growth Charts",
    icon: "trending-up",
    route: "/(tabs)/tools",
    color: "#0D9488",
    description: "WHO/CDC growth centiles",
  },
  {
    label: "Electrolytes",
    icon: "zap",
    route: "/(tabs)/calcs",
    color: "#0EA5E9",
    description: "K⁺ / Na⁺ correction calculator",
  },
  {
    label: "VIS / Cardiac & Haemodynamic",
    icon: "heart",
    route: "/(tabs)/tools",
    color: "#7C3AED",
    description: "Vasoactive-Inotropic Score",
  },
  {
    label: "Protocols",
    icon: "clipboard",
    route: "/(tabs)/calcs",
    color: "#D97706",
    description: "ABG, epilepsy, burns & airway",
  },
  {
    label: "Toxicology & Antidotes",
    icon: "shield",
    route: "/(tabs)/toxicology",
    color: "#991B1B",
    description: "16 antidotes with weight-based dosing",
  },
  {
    label: "Tools",
    icon: "tool",
    route: "/(tabs)/tools",
    color: "#16A34A",
    description: "BP percentile, GCS, fluids, scores & more",
  },
];

export function AppDrawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const { isDark, toggleDark } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const teal = Colors.light.tint;
  const bg = isDark ? "#0A192F" : "#FFFFFF";
  const border = isDark ? "#1E3A5F" : "#E2EFF6";
  const textPrimary = isDark ? "#E2E8F0" : "#0D1B2A";
  const textMuted = isDark ? "#8892B0" : "#64748B";
  const settingsBg = isDark ? "#0D1B2A" : "#F8FAFD";

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setSettingsOpen(false);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [isOpen]);

  function navigate(route: string) {
    closeDrawer();
    setTimeout(() => {
      router.push(route as any);
    }, 180);
  }

  function goPrivacyPolicy() {
    closeDrawer();
    setTimeout(() => {
      router.push("/privacy-policy" as any);
    }, 180);
  }

  if (!visible && !isOpen) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeDrawer}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              backgroundColor: bg,
              transform: [{ translateX: slideAnim }],
              paddingTop: Platform.OS === "web" ? 16 : insets.top,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          {/* ── Drawer Header ── */}
          <View style={[styles.drawerHeader, { borderBottomColor: border }]}>
            <View style={styles.drawerBrand}>
              <View style={[styles.brandDot, { backgroundColor: teal }]} />
              <View>
                <Text style={[styles.brandName, { color: textPrimary }]}>
                  MKashanEdu
                </Text>
                <Text style={[styles.brandSub, { color: textMuted }]}>
                  Clinical Suite
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={closeDrawer}
              style={[styles.closeBtn, { backgroundColor: isDark ? "#1A2F4A" : "#F0F4F8" }]}
              activeOpacity={0.7}
            >
              <Feather name="x" size={18} color={textMuted} />
            </TouchableOpacity>
          </View>

          {/* ── Nav Section Label ── */}
          <Text style={[styles.sectionLabel, { color: textMuted }]}>NAVIGATION</Text>

          {/* ── Nav Items ── */}
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigate(item.route)}
              activeOpacity={0.75}
              style={[
                styles.navItem,
                item.isEmergency && styles.emergencyNavItem,
                item.isEmergency && { backgroundColor: "#DC262612", borderColor: "#DC262630" },
              ]}
            >
              <View
                style={[
                  styles.navIcon,
                  { backgroundColor: item.isEmergency ? "#DC262620" : item.color + "18" },
                ]}
              >
                <Feather name={item.icon as any} size={18} color={item.color} />
              </View>
              <View style={styles.navText}>
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: item.isEmergency ? "#DC2626" : textPrimary,
                      fontFamily: item.isEmergency ? "Inter_700Bold" : "Inter_600SemiBold",
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.label}
                </Text>
                <Text style={[styles.navDesc, { color: item.isEmergency ? "#DC262699" : textMuted }]} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={15}
                color={item.isEmergency ? "#DC262666" : isDark ? "#3A5070" : "#CBD5E0"}
              />
            </TouchableOpacity>
          ))}

          <View style={[styles.divider, { backgroundColor: border }]} />

          {/* ── Settings ── */}
          <Text style={[styles.sectionLabel, { color: textMuted }]}>SETTINGS</Text>

          <TouchableOpacity
            onPress={() => setSettingsOpen((v) => !v)}
            activeOpacity={0.75}
            style={styles.navItem}
          >
            <View style={[styles.navIcon, { backgroundColor: "#64748B18" }]}>
              <Feather name="settings" size={18} color="#64748B" />
            </View>
            <View style={styles.navText}>
              <Text style={[styles.navLabel, { color: textPrimary }]}>Settings</Text>
              <Text style={[styles.navDesc, { color: textMuted }]}>Login · Privacy Policy</Text>
            </View>
            <Feather
              name={settingsOpen ? "chevron-up" : "chevron-down"}
              size={15}
              color={isDark ? "#3A5070" : "#CBD5E0"}
            />
          </TouchableOpacity>

          {settingsOpen && (
            <View style={[styles.settingsPanel, { backgroundColor: settingsBg, borderColor: border }]}>
              {/* Theme Toggle */}
              <TouchableOpacity
                onPress={toggleDark}
                activeOpacity={0.8}
                style={styles.settingsRow}
              >
                <Feather
                  name={isDark ? "sun" : "moon"}
                  size={16}
                  color={isDark ? "#FFD700" : teal}
                />
                <Text style={[styles.settingsRowText, { color: textPrimary }]}>
                  {isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
                </Text>
              </TouchableOpacity>

              <View style={[styles.settingsDivider, { backgroundColor: border }]} />

              {/* Login (placeholder) */}
              <TouchableOpacity activeOpacity={0.8} style={styles.settingsRow}>
                <Feather name="log-in" size={16} color={teal} />
                <Text style={[styles.settingsRowText, { color: textPrimary }]}>
                  Login / Sync Account
                </Text>
                <View style={[styles.comingSoonBadge, { backgroundColor: teal + "18" }]}>
                  <Text style={[styles.comingSoonText, { color: teal }]}>Soon</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.settingsDivider, { backgroundColor: border }]} />

              {/* Privacy Policy */}
              <TouchableOpacity
                onPress={goPrivacyPolicy}
                activeOpacity={0.8}
                style={styles.settingsRow}
              >
                <Feather name="shield" size={16} color="#64748B" />
                <Text style={[styles.settingsRowText, { color: textPrimary }]}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Footer ── */}
          <View style={styles.drawerFooter}>
            <Text style={[styles.footerText, { color: textMuted }]}>
              Prepared By: M. Kashan, RN
            </Text>
            <Text style={[styles.footerSub, { color: isDark ? "#2D4A6A" : "#CBD5E0" }]}>
              Pediatric Clinical Suite
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginBottom: 6,
  },
  drawerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandDot: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  brandName: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginTop: 2,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 12,
    gap: 12,
  },
  emergencyNavItem: {
    borderWidth: 1,
    marginVertical: 2,
  },
  navIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  navText: { flex: 1, minWidth: 0 },
  navLabel: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
  navDesc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 18,
    marginVertical: 8,
  },
  settingsPanel: {
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 4,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  settingsRowText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  settingsDivider: {
    height: 1,
    marginHorizontal: 12,
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  comingSoonText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  drawerFooter: {
    marginTop: "auto",
    paddingHorizontal: 18,
    paddingTop: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  footerSub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
});
