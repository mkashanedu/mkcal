/**
 * AppDrawer — slide-in navigation + settings panel.
 * Settings include: theme, weight unit, text size, biometrics (native only),
 * cloud backup (scaffold), login, and privacy policy.
 */
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDrawer } from "@/context/DrawerContext";
import { useTheme } from "@/context/ThemeContext";
import { useWeight } from "@/context/WeightContext";
import { usePreferences, TextSize } from "@/context/PreferencesContext";
import { useFavorites } from "@/context/FavoritesContext";
import Colors from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.80, 340);

interface NavItem {
  label: string;
  icon: string;
  route: string;
  color: string;
  description: string;
  isEmergency?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "home", route: "/", color: "#0891B2", description: "Home screen" },
  { label: "EMERGENCY / RESUSCITATION", icon: "alert-triangle", route: "/emergency", color: "#DC2626", description: "Rapid resuscitation reference", isEmergency: true },
  { label: "Drug Calculator", icon: "sliders", route: "/calculator", color: "#0891B2", description: "95+ drugs — Harriet Lane & Nelson's" },
  { label: "Drug Infusions", icon: "activity", route: "/infusion", color: "#7C3AED", description: "IV drip & infusion calculator" },
  { label: "Formulary", icon: "book-open", route: "/formulary", color: "#0D9488", description: "Tablets, syrups, nebulisers & IV" },
  { label: "Electrolytes & Protocols", icon: "zap", route: "/calcs", color: "#0EA5E9", description: "K⁺ / Na⁺ correction, ABG & more" },
  { label: "Toxicology & Antidotes", icon: "shield", route: "/toxicology", color: "#991B1B", description: "16 antidotes with weight-based dosing" },
  { label: "Tools & Protocols", icon: "tool", route: "/tools", color: "#16A34A", description: "Ventilator · BIG · Phoenix Sepsis · GCS" },
  { label: "Favorites", icon: "star", route: "/favorites", color: "#D97706", description: "Your starred drugs & infusions" },
];

const TEXT_SIZE_OPTIONS: { key: TextSize; label: string }[] = [
  { key: "small",  label: "S" },
  { key: "medium", label: "M" },
  { key: "large",  label: "L" },
];

// ── Drawer Row helpers ────────────────────────────────────────────────────────
function SettingsDivider({ color }: { color: string }) {
  return <View style={{ height: 1, backgroundColor: color, marginHorizontal: 12 }} />;
}

function SettingsRow({
  icon, label, sublabel, color, right, onPress,
}: {
  icon: string; label: string; sublabel?: string; color: string;
  right?: React.ReactNode; onPress?: () => void;
}) {
  const Inner = (
    <View style={styles.settingsRow}>
      <View style={[styles.settingsIcon, { backgroundColor: color + "18" }]}>
        <Feather name={icon as any} size={15} color={color} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.settingsRowLabel}>{label}</Text>
        {sublabel ? <Text style={styles.settingsRowSub}>{sublabel}</Text> : null}
      </View>
      {right}
    </View>
  );
  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>{Inner}</TouchableOpacity>
  ) : (
    <View>{Inner}</View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AppDrawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const { isDark, toggleDark }  = useTheme();
  const { weightUnit, setWeightUnit } = useWeight();
  const { textSize, setTextSize, biometricEnabled, setBiometricEnabled } = usePreferences();
  const { syncNow, syncStatus, syncMessage } = useFavorites();
  const insets = useSafeAreaInsets();

  const slideAnim    = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible]           = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupDone, setBackupDone]     = useState(false);

  const teal       = Colors.light.tint;
  const bg         = isDark ? "#0A192F" : "#FFFFFF";
  const border     = isDark ? "#1E3A5F" : "#E2EFF6";
  const textPrimary = isDark ? "#E2E8F0" : "#0D1B2A";
  const textMuted  = isDark ? "#8892B0" : "#64748B";
  const settingsBg = isDark ? "#070F1D" : "#F4F8FC";

  // Inject style vars for SettingsRow (can't easily use context from style fn)
  const rowLabelColor = textPrimary;
  const rowSubColor   = textMuted;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setSettingsOpen(false);
      setBackupDone(false);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 200, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }
  }, [isOpen]);

  function navigate(route: string) {
    closeDrawer();
    setTimeout(() => { router.replace(route as any); }, 180);
  }

  function goPrivacyPolicy() {
    closeDrawer();
    setTimeout(() => { router.push("/privacy-policy" as any); }, 180);
  }

  async function handleBackup() {
    if (backupLoading) return;
    setBackupLoading(true);
    setBackupDone(false);
    const success = await syncNow();
    setBackupLoading(false);
    setBackupDone(success);
  }

  if (!visible && !isOpen) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeDrawer} statusBarTranslucent>
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
              paddingBottom: insets.bottom + 8,
            },
          ]}
        >
          {/* ── Header ── */}
          <View style={[styles.drawerHeader, { borderBottomColor: border }]}>
            <View style={styles.drawerBrand}>
              <View style={[styles.brandDot, { backgroundColor: teal }]} />
              <View>
                <Text style={[styles.brandName, { color: textPrimary }]}>MKashanEdu</Text>
                <Text style={[styles.brandSub, { color: textMuted }]}>Clinical Suite</Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeDrawer}
              style={[styles.closeBtn, { backgroundColor: isDark ? "#1A2F4A" : "#F0F4F8" }]}
              activeOpacity={0.7}>
              <Feather name="x" size={18} color={textMuted} />
            </TouchableOpacity>
          </View>

          {/* ── Nav ── */}
          <Text style={[styles.sectionLabel, { color: textMuted }]}>NAVIGATION</Text>

          {NAV_ITEMS.map((item) => (
            <TouchableOpacity key={item.label} onPress={() => navigate(item.route)}
              activeOpacity={0.75}
              style={[
                styles.navItem,
                item.isEmergency && styles.emergencyNavItem,
                item.isEmergency && { backgroundColor: "#DC262612", borderColor: "#DC262630" },
              ]}
            >
              <View style={[styles.navIcon, { backgroundColor: item.isEmergency ? "#DC262620" : item.color + "18" }]}>
                <Feather name={item.icon as any} size={18} color={item.color} />
              </View>
              <View style={styles.navText}>
                <Text
                  style={[styles.navLabel, {
                    color: item.isEmergency ? "#DC2626" : textPrimary,
                    fontFamily: item.isEmergency ? "Inter_700Bold" : "Inter_600SemiBold",
                  }]}
                  numberOfLines={1} adjustsFontSizeToFit
                >
                  {item.label}
                </Text>
                <Text style={[styles.navDesc, { color: item.isEmergency ? "#DC262699" : textMuted }]} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <Feather name="chevron-right" size={15} color={item.isEmergency ? "#DC262666" : isDark ? "#3A5070" : "#CBD5E0"} />
            </TouchableOpacity>
          ))}

          <View style={[styles.divider, { backgroundColor: border }]} />

          {/* ── Settings ── */}
          <Text style={[styles.sectionLabel, { color: textMuted }]}>SETTINGS</Text>

          <TouchableOpacity onPress={() => setSettingsOpen((v) => !v)}
            activeOpacity={0.75} style={styles.navItem}>
            <View style={[styles.navIcon, { backgroundColor: "#64748B18" }]}>
              <Feather name="settings" size={18} color="#64748B" />
            </View>
            <View style={styles.navText}>
              <Text style={[styles.navLabel, { color: textPrimary }]}>Settings &amp; Preferences</Text>
              <Text style={[styles.navDesc, { color: textMuted }]}>Theme · Units · Text Size · Security</Text>
            </View>
            <Feather name={settingsOpen ? "chevron-up" : "chevron-down"} size={15} color={isDark ? "#3A5070" : "#CBD5E0"} />
          </TouchableOpacity>

          {settingsOpen && (
            <View style={[styles.settingsPanel, { backgroundColor: settingsBg, borderColor: border }]}>

              {/* ── Theme ── */}
              <SettingsRow
                icon={isDark ? "sun" : "moon"}
                label={isDark ? "Day Mode" : "Night Mode"}
                sublabel="Toggle app appearance"
                color={isDark ? "#F59E0B" : teal}
                onPress={toggleDark}
                right={
                  <Switch
                    value={isDark}
                    onValueChange={toggleDark}
                    trackColor={{ false: "#CBD5E1", true: teal + "60" }}
                    thumbColor={isDark ? teal : "#94A3B8"}
                    ios_backgroundColor="#CBD5E1"
                  />
                }
              />

              <SettingsDivider color={border} />

              {/* ── Weight Unit ── */}
              <SettingsRow
                icon="activity"
                label="Default Weight Unit"
                sublabel={`Currently: ${weightUnit === "kg" ? "Kilograms (kg)" : "Pounds (lbs)"}`}
                color="#0D9488"
                right={
                  <View style={styles.segmentRow}>
                    {(["kg", "lbs"] as const).map((u) => (
                      <TouchableOpacity
                        key={u}
                        onPress={() => setWeightUnit(u)}
                        style={[
                          styles.segmentBtn,
                          { borderColor: border, backgroundColor: weightUnit === u ? "#0D9488" : "transparent" },
                        ]}
                      >
                        <Text style={{ fontSize: 11, fontFamily: "Inter_700Bold",
                          color: weightUnit === u ? "#FFFFFF" : textMuted }}>
                          {u.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                }
              />

              <SettingsDivider color={border} />

              {/* ── Text Size ── */}
              <SettingsRow
                icon="type"
                label="Clinical Display Text Size"
                sublabel={`Currently: ${textSize.charAt(0).toUpperCase() + textSize.slice(1)}`}
                color="#7C3AED"
                right={
                  <View style={styles.segmentRow}>
                    {TEXT_SIZE_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.key}
                        onPress={() => setTextSize(opt.key)}
                        style={[
                          styles.segmentBtn,
                          { borderColor: border, backgroundColor: textSize === opt.key ? "#7C3AED" : "transparent" },
                        ]}
                      >
                        <Text style={{ fontSize: 11, fontFamily: "Inter_700Bold",
                          color: textSize === opt.key ? "#FFFFFF" : textMuted }}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                }
              />

              <SettingsDivider color={border} />

              {/* ── Biometrics (native only) ── */}
              {Platform.OS !== "web" ? (
                <>
                  <SettingsRow
                    icon="lock"
                    label="Face ID / Fingerprint"
                    sublabel="Unlock app with biometrics"
                    color="#0891B2"
                    right={
                      <Switch
                        value={biometricEnabled}
                        onValueChange={setBiometricEnabled}
                        trackColor={{ false: "#CBD5E1", true: "#0891B260" }}
                        thumbColor={biometricEnabled ? "#0891B2" : "#94A3B8"}
                        ios_backgroundColor="#CBD5E1"
                      />
                    }
                  />
                  <SettingsDivider color={border} />
                </>
              ) : (
                <>
                  <View style={styles.settingsRow}>
                    <View style={[styles.settingsIcon, { backgroundColor: "#94A3B818" }]}>
                      <Feather name="lock" size={15} color="#94A3B8" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.settingsRowLabel, { color: "#94A3B8" }]}>
                        Face ID / Fingerprint
                      </Text>
                      <Text style={[styles.settingsRowSub, { color: "#94A3B8" }]}>
                        Available on native app only
                      </Text>
                    </View>
                    <View style={[styles.nativeBadge, { backgroundColor: "#94A3B820", borderColor: "#94A3B840" }]}>
                      <Text style={{ fontSize: 9, fontFamily: "Inter_700Bold", color: "#94A3B8" }}>
                        NATIVE
                      </Text>
                    </View>
                  </View>
                  <SettingsDivider color={border} />
                </>
              )}

              {/* ── Cloud Backup ── */}
              <TouchableOpacity onPress={handleBackup} activeOpacity={0.8} disabled={backupLoading}>
                <View style={styles.settingsRow}>
                  <View style={[styles.settingsIcon, { backgroundColor: backupDone ? "#16A34A18" : "#F59E0B18" }]}>
                    {backupLoading ? (
                      <ActivityIndicator size="small" color="#F59E0B" />
                    ) : (
                      <Feather name={backupDone ? "check-circle" : "upload-cloud"} size={15}
                        color={backupDone ? "#16A34A" : "#F59E0B"} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingsRowLabel, { color: backupDone ? "#16A34A" : rowLabelColor }]}>
                      {backupDone ? "Backup Complete!" : "Backup Favorites to Cloud"}
                    </Text>
                    <Text style={[styles.settingsRowSub, { color: rowSubColor }]}>
                      {backupLoading
                        ? "Uploading…"
                        : backupDone
                        ? "Favorites synced successfully"
                        : syncStatus === "error"
                        ? syncMessage
                        : syncStatus === "synced"
                        ? syncMessage
                        : "Sync your favorites across devices"}
                    </Text>
                  </View>
                  {!backupLoading && !backupDone && syncStatus === "syncing" && (
                    <ActivityIndicator size="small" color="#F59E0B" />
                  )}
                </View>
              </TouchableOpacity>

              <SettingsDivider color={border} />

              {/* ── Login ── */}
              <TouchableOpacity activeOpacity={0.8}
                onPress={() => { closeDrawer(); setTimeout(() => router.push("/login" as any), 180); }}>
                <View style={styles.settingsRow}>
                  <View style={[styles.settingsIcon, { backgroundColor: teal + "18" }]}>
                    <Feather name="log-in" size={15} color={teal} />
                  </View>
                  <Text style={[styles.settingsRowLabel, { color: rowLabelColor, flex: 1 }]}>
                    Login / Account
                  </Text>
                  <Feather name="chevron-right" size={14} color={isDark ? "#3A5070" : "#CBD5E0"} />
                </View>
              </TouchableOpacity>

              <SettingsDivider color={border} />

              {/* ── Privacy Policy ── */}
              <TouchableOpacity onPress={goPrivacyPolicy} activeOpacity={0.8}>
                <View style={styles.settingsRow}>
                  <View style={[styles.settingsIcon, { backgroundColor: "#64748B18" }]}>
                    <Feather name="shield" size={15} color="#64748B" />
                  </View>
                  <Text style={[styles.settingsRowLabel, { color: rowLabelColor, flex: 1 }]}>
                    Privacy Policy
                  </Text>
                  <Feather name="chevron-right" size={14} color={isDark ? "#3A5070" : "#CBD5E0"} />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Footer ── */}
          <View style={styles.drawerFooter}>
            <Text style={[styles.footerText, { color: textMuted }]}>
              Prepared By: M. Kashan, RN
            </Text>
            <Text style={[styles.footerSub, { color: isDark ? "#2D4A6A" : "#CBD5E0" }]}>
              Pediatric Clinical Suite · v1.0.0
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.50)" },
  drawer: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    shadowColor: "#000", shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.20, shadowRadius: 20, elevation: 24,
    overflow: "scroll" as any,
  },
  drawerHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, marginBottom: 4,
  },
  drawerBrand: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandDot: { width: 36, height: 36, borderRadius: 10 },
  brandName: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  brandSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1, letterSpacing: 0.3 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },

  sectionLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1.2, paddingHorizontal: 18, paddingVertical: 6, marginTop: 2 },

  navItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, marginHorizontal: 6, borderRadius: 12, gap: 12 },
  emergencyNavItem: { borderWidth: 1, marginVertical: 2 },
  navIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  navText: { flex: 1, minWidth: 0 },
  navLabel: { fontSize: 13, letterSpacing: -0.1 },
  navDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },

  divider: { height: 1, marginHorizontal: 18, marginVertical: 8 },

  settingsPanel: { marginHorizontal: 8, borderRadius: 14, borderWidth: 1, overflow: "hidden", marginBottom: 4 },

  settingsRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 11, gap: 10 },
  settingsIcon: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  settingsRowLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#0D1B2A" },
  settingsRowSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1, color: "#64748B" },

  segmentRow: { flexDirection: "row", gap: 4 },
  segmentBtn: {
    paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6, borderWidth: 1.5,
    alignItems: "center", justifyContent: "center",
  },

  nativeBadge: {
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },

  drawerFooter: { marginTop: "auto", paddingHorizontal: 18, paddingTop: 12, alignItems: "center" },
  footerText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  footerSub: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },
});
