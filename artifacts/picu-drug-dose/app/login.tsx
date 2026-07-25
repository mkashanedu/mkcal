/**
 * Login / Register / Profile screen
 * Uses AuthContext (LocalStorage scaffold) for auth state.
 */
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

type Tab = "login" | "register";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { user, login, register, logout } = useAuth();

  const [tab, setTab] = useState<Tab>("login");

  // Login state
  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");
  const [lLoading, setLLoading] = useState(false);
  const [lError, setLError] = useState("");
  const [lPassVisible, setLPassVisible] = useState(false);

  // Register state
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");
  const [rConfirm, setRConfirm] = useState("");
  const [rLoading, setRLoading] = useState(false);
  const [rError, setRError] = useState("");
  const [rPassVisible, setRPassVisible] = useState(false);
  const [rSuccess, setRSuccess] = useState(false);

  const teal = "#0891B2";
  const bg = isDark ? "#0B132B" : "#F0F9FF";
  const card = isDark ? "#0A192F" : "#FFFFFF";
  const border = isDark ? "#1E3A5F" : "#E2EFF6";
  const inputBg = isDark ? "#0D2137" : "#F8FAFF";
  const tp = isDark ? "#FFFFFF" : "#0D1B2A";
  const tm = isDark ? "#8892B0" : "#64748B";

  const inputStyle = {
    flex: 1,
    color: tp,
    fontSize: 15,
    fontFamily: "Inter_400Regular" as const,
    paddingVertical: 0,
  };

  const fieldWrap = [
    styles.fieldWrap,
    { backgroundColor: inputBg, borderColor: border },
  ];

  // ── LOGGED-IN PROFILE VIEW ───────────────────────────────────────────
  if (user) {
    const initials = user.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 12, backgroundColor: card, borderBottomColor: border },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color={teal} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tp }]}>Account</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }} showsVerticalScrollIndicator={false}>
          {/* Avatar card */}
          <View style={[styles.avatarCard, { backgroundColor: card, borderColor: border }]}>
            <View style={[styles.avatarCircle, { backgroundColor: teal }]}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <Text style={[styles.profileName, { color: tp }]}>{user.name}</Text>
            <Text style={[styles.profileEmail, { color: tm }]}>{user.email}</Text>
            <View style={[styles.profileBadge, { backgroundColor: teal + "18", borderColor: teal + "30" }]}>
              <Feather name="shield" size={11} color={teal} />
              <Text style={[styles.profileBadgeText, { color: teal }]}>Clinical Professional</Text>
            </View>
          </View>

          {/* Info card */}
          <View style={[styles.infoCard, { backgroundColor: card, borderColor: border }]}>
            <Text style={[styles.infoCardTitle, { color: tp }]}>Local Account</Text>
            <Text style={[styles.infoCardBody, { color: tm }]}>
              Your account is stored securely on this device. Favourites, preferences, and settings sync within this installation.
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={async () => { await logout(); }}
            activeOpacity={0.8}
            style={[styles.logoutBtn, { borderColor: "#DC2626" + "40" }]}
          >
            <Feather name="log-out" size={16} color="#DC2626" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={[styles.disclaimer, { color: isDark ? "#3A5070" : "#CBD5E1" }]}>
            PeadsCal v1.0 · For clinical professionals only{"\n"}
            Prepared By: M. Kashan, RN
          </Text>
        </ScrollView>
      </View>
    );
  }

  // ── LOGIN FORM ───────────────────────────────────────────────────────
  async function handleLogin() {
    setLError("");
    if (!lEmail.trim() || !lPass) {
      setLError("Please enter your email and password.");
      return;
    }
    setLLoading(true);
    const res = await login(lEmail, lPass);
    setLLoading(false);
    if (!res.success) setLError(res.error ?? "Login failed.");
    // On success AuthContext updates `user` → this screen re-renders to profile view
  }

  // ── REGISTER FORM ────────────────────────────────────────────────────
  async function handleRegister() {
    setRError("");
    if (rPass !== rConfirm) {
      setRError("Passwords do not match.");
      return;
    }
    setRLoading(true);
    const res = await register(rName, rEmail, rPass);
    setRLoading(false);
    if (!res.success) {
      setRError(res.error ?? "Registration failed.");
    } else {
      setRSuccess(true);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { backgroundColor: bg }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 12, backgroundColor: card, borderBottomColor: border },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color={teal} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tp }]}>Account</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand hero */}
          <View style={styles.hero}>
            <View style={[styles.heroIcon, { backgroundColor: teal + "18", borderColor: teal + "30" }]}>
              <View style={styles.heroIconCross}>
                <View style={[styles.crossH, { backgroundColor: teal }]} />
                <View style={[styles.crossV, { backgroundColor: teal }]} />
              </View>
            </View>
            <Text style={[styles.heroTitle, { color: tp }]}>PeadsCal Account</Text>
            <Text style={[styles.heroSub, { color: tm }]}>
              Sync favourites &amp; preferences across sessions
            </Text>
          </View>

          {/* Tab switcher */}
          <View style={[styles.tabs, { backgroundColor: isDark ? "#0D2137" : "#EFF6FF", borderColor: border }]}>
            {(["login", "register"] as Tab[]).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => { setTab(t); setLError(""); setRError(""); }}
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  tab === t && [styles.tabItemActive, { backgroundColor: card, shadowColor: teal }],
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: tm },
                    tab === t && [styles.tabTextActive, { color: teal }],
                  ]}
                >
                  {t === "login" ? "Login" : "Register"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: tm }]}>Email Address</Text>
                <View style={fieldWrap}>
                  <Feather name="mail" size={15} color={tm} style={{ marginRight: 8 }} />
                  <TextInput
                    style={inputStyle}
                    value={lEmail}
                    onChangeText={setLEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: tm }]}>Password</Text>
                <View style={fieldWrap}>
                  <Feather name="lock" size={15} color={tm} style={{ marginRight: 8 }} />
                  <TextInput
                    style={inputStyle}
                    value={lPass}
                    onChangeText={setLPass}
                    placeholder="Your password"
                    placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                    secureTextEntry={!lPassVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    onSubmitEditing={handleLogin}
                    returnKeyType="go"
                  />
                  <TouchableOpacity onPress={() => setLPassVisible((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Feather name={lPassVisible ? "eye-off" : "eye"} size={15} color={tm} />
                  </TouchableOpacity>
                </View>
              </View>

              {lError ? (
                <View style={styles.errorBox}>
                  <Feather name="alert-circle" size={13} color="#DC2626" />
                  <Text style={styles.errorText}>{lError}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={lLoading}
                style={[styles.submitBtn, { backgroundColor: teal, opacity: lLoading ? 0.7 : 1 }]}
              >
                {lLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Feather name="log-in" size={16} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>Login</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setTab("register")} activeOpacity={0.7} style={styles.switchLink}>
                <Text style={[styles.switchLinkText, { color: tm }]}>
                  Don't have an account?{" "}
                  <Text style={{ color: teal, fontFamily: "Inter_600SemiBold" }}>Register</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── REGISTER ── */}
          {tab === "register" && (
            <View style={styles.form}>
              {rSuccess ? (
                <View style={styles.successBox}>
                  <View style={[styles.successIcon, { backgroundColor: "#16A34A18" }]}>
                    <Feather name="check-circle" size={32} color="#16A34A" />
                  </View>
                  <Text style={[styles.successTitle, { color: tp }]}>Account Created!</Text>
                  <Text style={[styles.successSub, { color: tm }]}>
                    You're now signed in as {user?.name ?? rName}.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Full Name</Text>
                    <View style={fieldWrap}>
                      <Feather name="user" size={15} color={tm} style={{ marginRight: 8 }} />
                      <TextInput
                        style={inputStyle}
                        value={rName}
                        onChangeText={setRName}
                        placeholder="Dr. Jane Smith"
                        placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                        autoCapitalize="words"
                        autoComplete="name"
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Email Address</Text>
                    <View style={fieldWrap}>
                      <Feather name="mail" size={15} color={tm} style={{ marginRight: 8 }} />
                      <TextInput
                        style={inputStyle}
                        value={rEmail}
                        onChangeText={setREmail}
                        placeholder="you@hospital.com"
                        placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Password</Text>
                    <View style={fieldWrap}>
                      <Feather name="lock" size={15} color={tm} style={{ marginRight: 8 }} />
                      <TextInput
                        style={inputStyle}
                        value={rPass}
                        onChangeText={setRPass}
                        placeholder="Min. 6 characters"
                        placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                        secureTextEntry={!rPassVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                      />
                      <TouchableOpacity onPress={() => setRPassVisible((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Feather name={rPassVisible ? "eye-off" : "eye"} size={15} color={tm} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Confirm Password</Text>
                    <View style={fieldWrap}>
                      <Feather name="lock" size={15} color={tm} style={{ marginRight: 8 }} />
                      <TextInput
                        style={inputStyle}
                        value={rConfirm}
                        onChangeText={setRConfirm}
                        placeholder="Repeat password"
                        placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                        secureTextEntry={!rPassVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                        onSubmitEditing={handleRegister}
                        returnKeyType="go"
                      />
                    </View>
                  </View>

                  {rError ? (
                    <View style={styles.errorBox}>
                      <Feather name="alert-circle" size={13} color="#DC2626" />
                      <Text style={styles.errorText}>{rError}</Text>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    onPress={handleRegister}
                    activeOpacity={0.85}
                    disabled={rLoading}
                    style={[styles.submitBtn, { backgroundColor: teal, opacity: rLoading ? 0.7 : 1 }]}
                  >
                    {rLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Feather name="user-plus" size={16} color="#FFFFFF" />
                        <Text style={styles.submitBtnText}>Create Account</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setTab("login")} activeOpacity={0.7} style={styles.switchLink}>
                    <Text style={[styles.switchLinkText, { color: tm }]}>
                      Already have an account?{" "}
                      <Text style={{ color: teal, fontFamily: "Inter_600SemiBold" }}>Login</Text>
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* Disclaimer */}
          <Text style={[styles.disclaimer, { color: isDark ? "#3A5070" : "#CBD5E1" }]}>
            Account data is stored locally on this device.{"\n"}
            For qualified clinical professionals only.
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },

  // Hero
  hero: {
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
    gap: 8,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heroIconCross: { width: 44, height: 44, position: "relative", alignItems: "center", justifyContent: "center" },
  crossH: { position: "absolute", width: 36, height: 10, borderRadius: 5 },
  crossV: { position: "absolute", height: 36, width: 10, borderRadius: 5 },
  heroTitle: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  heroSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },

  // Tabs
  tabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
  },
  tabItemActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  tabTextActive: { fontFamily: "Inter_700Bold" },

  // Form
  form: {
    paddingHorizontal: 20,
    gap: 14,
  },
  fieldGroup: { gap: 6 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  fieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DC262610",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DC262630",
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#DC2626",
    fontFamily: "Inter_500Medium",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  switchLink: {
    alignItems: "center",
    paddingVertical: 8,
  },
  switchLinkText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  // Success
  successBox: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  successSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },

  // Profile
  avatarCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 6,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarInitials: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  profileName: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  profileEmail: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  profileBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  infoCardTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  infoCardBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#DC2626" },

  disclaimer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
    paddingTop: 24,
    lineHeight: 17,
  },
});
