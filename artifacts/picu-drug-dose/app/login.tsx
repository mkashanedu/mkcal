/**
 * Login / Register / Profile screen
 * Features: Google & Apple scaffold buttons, Clinical Role selector,
 * email/password auth — all persisted offline via AsyncStorage.
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

import {
  useAuth,
  ClinicalRole,
  CLINICAL_ROLE_LABELS,
} from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

type Tab = "login" | "register";

const ROLES: ClinicalRole[] = [
  "physician",
  "rn",
  "respiratory_therapist",
  "paramedic",
  "other",
];

// ── Role Picker ───────────────────────────────────────────────────────────────
function RolePicker({
  value,
  onChange,
  isDark,
  border,
  card,
  tp,
  tm,
  teal,
}: {
  value: ClinicalRole;
  onChange: (r: ClinicalRole) => void;
  isDark: boolean;
  border: string;
  card: string;
  tp: string;
  tm: string;
  teal: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
        style={[
          styles.fieldWrap,
          { backgroundColor: isDark ? "#0D2137" : "#F8FAFF", borderColor: open ? teal : border },
        ]}
      >
        <Feather name="briefcase" size={15} color={tm} style={{ marginRight: 8 }} />
        <Text style={{ flex: 1, fontSize: 15, color: value ? tp : tm, fontFamily: "Inter_400Regular" }}>
          {CLINICAL_ROLE_LABELS[value]}
        </Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={15} color={tm} />
      </TouchableOpacity>
      {open && (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => { onChange(r); setOpen(false); }}
              activeOpacity={0.75}
              style={[
                styles.dropdownItem,
                { borderBottomColor: border },
                r === value && { backgroundColor: teal + "14" },
              ]}
            >
              <View
                style={[
                  styles.dropdownDot,
                  { backgroundColor: r === value ? teal : isDark ? "#1E3A5F" : "#E2E8F0" },
                ]}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: r === value ? "Inter_600SemiBold" : "Inter_400Regular",
                  color: r === value ? teal : tp,
                  flex: 1,
                }}
              >
                {CLINICAL_ROLE_LABELS[r]}
              </Text>
              {r === value && <Feather name="check" size={14} color={teal} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ── Social Button ─────────────────────────────────────────────────────────────
function SocialButton({
  provider,
  onPress,
  isDark,
  border,
  card,
  tp,
}: {
  provider: "google" | "apple";
  onPress: () => void;
  isDark: boolean;
  border: string;
  card: string;
  tp: string;
}) {
  const isApple = provider === "apple";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.socialBtn,
        {
          backgroundColor: isApple
            ? isDark ? "#FFFFFF" : "#000000"
            : isDark ? "#1A2F4A" : "#FFFFFF",
          borderColor: isApple ? "transparent" : border,
        },
      ]}
    >
      {/* Icon glyph */}
      <Text
        style={{
          fontSize: 17,
          marginRight: 8,
          color: isApple ? (isDark ? "#000000" : "#FFFFFF") : tp,
          fontFamily: "Inter_700Bold",
        }}
      >
        {isApple ? "" : "G"}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Inter_600SemiBold",
          color: isApple ? (isDark ? "#000000" : "#FFFFFF") : tp,
        }}
      >
        Continue with {isApple ? "Apple" : "Google"}
      </Text>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { user, login, register, loginSocial, logout, updateRole } = useAuth();

  const [tab, setTab] = useState<Tab>("login");

  // Login state
  const [lEmail, setLEmail]           = useState("");
  const [lPass, setLPass]             = useState("");
  const [lRole, setLRole]             = useState<ClinicalRole>("rn");
  const [lLoading, setLLoading]       = useState(false);
  const [lError, setLError]           = useState("");
  const [lPassVisible, setLPassVisible] = useState(false);

  // Register state
  const [rName, setRName]             = useState("");
  const [rEmail, setREmail]           = useState("");
  const [rPass, setRPass]             = useState("");
  const [rConfirm, setRConfirm]       = useState("");
  const [rRole, setRRole]             = useState<ClinicalRole>("rn");
  const [rLoading, setRLoading]       = useState(false);
  const [rError, setRError]           = useState("");
  const [rPassVisible, setRPassVisible] = useState(false);
  const [rSuccess, setRSuccess]       = useState(false);

  // Social scaffold state
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);

  const teal    = "#0891B2";
  const bg      = isDark ? "#0B132B" : "#F0F9FF";
  const card    = isDark ? "#0A192F" : "#FFFFFF";
  const border  = isDark ? "#1E3A5F" : "#E2EFF6";
  const inputBg = isDark ? "#0D2137" : "#F8FAFF";
  const tp      = isDark ? "#FFFFFF" : "#0D1B2A";
  const tm      = isDark ? "#8892B0" : "#64748B";

  const inputStyle = {
    flex: 1,
    color: tp,
    fontSize: 15,
    fontFamily: "Inter_400Regular" as const,
    paddingVertical: 0,
  };
  const fieldWrap = [styles.fieldWrap, { backgroundColor: inputBg, borderColor: border }];

  // ── Social scaffold handler ───────────────────────────────────────────────
  async function handleSocial(provider: "google" | "apple") {
    setSocialLoading(provider);
    // Scaffold: in production, trigger OAuth flow here.
    // For now, simulate a short delay then create/login a demo account.
    await new Promise((r) => setTimeout(r, 900));
    const demoEmail = `demo.${provider}@peadscal.app`;
    const demoName  = provider === "google" ? "Google User" : "Apple User";
    await loginSocial(provider, demoName, demoEmail, lRole);
    setSocialLoading(null);
  }

  // ── LOGGED-IN PROFILE VIEW ───────────────────────────────────────────────
  if (user) {
    const initials = user.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const providerColor =
      user.provider === "google" ? "#EA4335" :
      user.provider === "apple"  ? (isDark ? "#FFFFFF" : "#000000") :
      teal;

    const providerLabel =
      user.provider === "google" ? "Google Account" :
      user.provider === "apple"  ? "Apple Account" :
      "Local Account";

    const [editingRole, setEditingRole] = useState(false);
    const [profileRole, setProfileRole] = useState<ClinicalRole>(user.role ?? "rn");

    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: card, borderBottomColor: border }]}>
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
            {/* Provider badge */}
            <View style={[styles.profileBadge, { backgroundColor: providerColor + "18", borderColor: providerColor + "30" }]}>
              <Feather
                name={user.provider === "local" ? "shield" : user.provider === "google" ? "globe" : "smartphone"}
                size={11}
                color={providerColor}
              />
              <Text style={[styles.profileBadgeText, { color: providerColor }]}>{providerLabel}</Text>
            </View>
          </View>

          {/* Role card */}
          <View style={[styles.infoCard, { backgroundColor: card, borderColor: border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <Text style={[styles.infoCardTitle, { color: tp }]}>Clinical Role</Text>
              <TouchableOpacity onPress={() => setEditingRole((v) => !v)} activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Feather name={editingRole ? "check" : "edit-2"} size={13} color={teal} />
                <Text style={{ fontSize: 12, color: teal, fontFamily: "Inter_600SemiBold" }}>
                  {editingRole ? "Done" : "Change"}
                </Text>
              </TouchableOpacity>
            </View>
            {editingRole ? (
              <RolePicker
                value={profileRole}
                onChange={(r) => { setProfileRole(r); updateRole(r); }}
                isDark={isDark} border={border} card={card} tp={tp} tm={tm} teal={teal}
              />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: teal }} />
                <Text style={{ fontSize: 14, color: tp, fontFamily: "Inter_500Medium" }}>
                  {CLINICAL_ROLE_LABELS[user.role ?? "rn"]}
                </Text>
              </View>
            )}
          </View>

          {/* Info card */}
          <View style={[styles.infoCard, { backgroundColor: card, borderColor: border }]}>
            <Text style={[styles.infoCardTitle, { color: tp }]}>Offline Storage</Text>
            <Text style={[styles.infoCardBody, { color: tm }]}>
              Your account is stored securely on this device. Favourites, preferences, and settings are available fully offline without a network connection.
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity onPress={async () => { await logout(); }} activeOpacity={0.8}
            style={[styles.logoutBtn, { borderColor: "#DC2626" + "40" }]}>
            <Feather name="log-out" size={16} color="#DC2626" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={[styles.disclaimer, { color: isDark ? "#3A5070" : "#CBD5E1" }]}>
            PeadsCal v1.0.0 · For clinical professionals only{"\n"}
            Prepared By: M. Kashan, RN
          </Text>
        </ScrollView>
      </View>
    );
  }

  // ── LOGIN FORM ────────────────────────────────────────────────────────────
  async function handleLogin() {
    setLError("");
    if (!lEmail.trim() || !lPass) {
      setLError("Please enter your email and password.");
      return;
    }
    setLLoading(true);
    const res = await login(lEmail, lPass, lRole);
    setLLoading(false);
    if (!res.success) setLError(res.error ?? "Login failed.");
  }

  // ── REGISTER FORM ─────────────────────────────────────────────────────────
  async function handleRegister() {
    setRError("");
    if (rPass !== rConfirm) {
      setRError("Passwords do not match.");
      return;
    }
    setRLoading(true);
    const res = await register(rName, rEmail, rPass, rRole);
    setRLoading(false);
    if (!res.success) setRError(res.error ?? "Registration failed.");
    else setRSuccess(true);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { backgroundColor: bg }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: card, borderBottomColor: border }]}>
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
              Sync favourites &amp; preferences · Works fully offline
            </Text>
          </View>

          {/* ── Social Buttons ── */}
          <View style={[styles.socialGroup, { paddingHorizontal: 20 }]}>
            <SocialButton
              provider="google"
              onPress={() => handleSocial("google")}
              isDark={isDark} border={border} card={card} tp={tp}
            />
            {socialLoading === "google" && (
              <View style={styles.socialLoader}>
                <ActivityIndicator size="small" color={teal} />
                <Text style={{ fontSize: 12, color: tm, fontFamily: "Inter_500Medium" }}>Connecting to Google…</Text>
              </View>
            )}

            {/* Apple — shown only on iOS/macOS for policy compliance; on web show grayed out */}
            {(Platform.OS === "ios" || Platform.OS === "web") && (
              <SocialButton
                provider="apple"
                onPress={() => handleSocial("apple")}
                isDark={isDark} border={border} card={card} tp={tp}
              />
            )}
            {socialLoading === "apple" && (
              <View style={styles.socialLoader}>
                <ActivityIndicator size="small" color={teal} />
                <Text style={{ fontSize: 12, color: tm, fontFamily: "Inter_500Medium" }}>Connecting to Apple…</Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={[styles.dividerRow, { paddingHorizontal: 20 }]}>
            <View style={[styles.dividerLine, { backgroundColor: border }]} />
            <Text style={[styles.dividerText, { color: tm }]}>or continue with email</Text>
            <View style={[styles.dividerLine, { backgroundColor: border }]} />
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
                <Text style={[styles.tabText, { color: tm }, tab === t && [styles.tabTextActive, { color: teal }]]}>
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
                    style={inputStyle} value={lEmail} onChangeText={setLEmail}
                    placeholder="you@example.com" placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                    keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: tm }]}>Password</Text>
                <View style={fieldWrap}>
                  <Feather name="lock" size={15} color={tm} style={{ marginRight: 8 }} />
                  <TextInput
                    style={inputStyle} value={lPass} onChangeText={setLPass}
                    placeholder="Your password" placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                    secureTextEntry={!lPassVisible} autoCapitalize="none" autoCorrect={false}
                    autoComplete="password" onSubmitEditing={handleLogin} returnKeyType="go"
                  />
                  <TouchableOpacity onPress={() => setLPassVisible((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Feather name={lPassVisible ? "eye-off" : "eye"} size={15} color={tm} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: tm }]}>Clinical Role</Text>
                <RolePicker value={lRole} onChange={setLRole} isDark={isDark} border={border} card={card} tp={tp} tm={tm} teal={teal} />
              </View>

              {lError ? (
                <View style={styles.errorBox}>
                  <Feather name="alert-circle" size={13} color="#DC2626" />
                  <Text style={styles.errorText}>{lError}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={handleLogin} activeOpacity={0.85} disabled={lLoading}
                style={[styles.submitBtn, { backgroundColor: teal, opacity: lLoading ? 0.7 : 1 }]}
              >
                {lLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : (
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
                    Signed in as {rName || rEmail}.{"\n"}Role: {CLINICAL_ROLE_LABELS[rRole]}
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Full Name</Text>
                    <View style={fieldWrap}>
                      <Feather name="user" size={15} color={tm} style={{ marginRight: 8 }} />
                      <TextInput style={inputStyle} value={rName} onChangeText={setRName}
                        placeholder="Dr. Jane Smith" placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                        autoCapitalize="words" autoComplete="name" />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Email Address</Text>
                    <View style={fieldWrap}>
                      <Feather name="mail" size={15} color={tm} style={{ marginRight: 8 }} />
                      <TextInput style={inputStyle} value={rEmail} onChangeText={setREmail}
                        placeholder="you@hospital.com" placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Password</Text>
                    <View style={fieldWrap}>
                      <Feather name="lock" size={15} color={tm} style={{ marginRight: 8 }} />
                      <TextInput style={inputStyle} value={rPass} onChangeText={setRPass}
                        placeholder="Min. 6 characters" placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                        secureTextEntry={!rPassVisible} autoCapitalize="none" autoCorrect={false} autoComplete="new-password" />
                      <TouchableOpacity onPress={() => setRPassVisible((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Feather name={rPassVisible ? "eye-off" : "eye"} size={15} color={tm} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Confirm Password</Text>
                    <View style={fieldWrap}>
                      <Feather name="lock" size={15} color={tm} style={{ marginRight: 8 }} />
                      <TextInput style={inputStyle} value={rConfirm} onChangeText={setRConfirm}
                        placeholder="Repeat password" placeholderTextColor={isDark ? "#3A5070" : "#94A3B8"}
                        secureTextEntry={!rPassVisible} autoCapitalize="none" autoCorrect={false}
                        autoComplete="new-password" onSubmitEditing={handleRegister} returnKeyType="go" />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: tm }]}>Clinical Role</Text>
                    <RolePicker value={rRole} onChange={setRRole} isDark={isDark} border={border} card={card} tp={tp} tm={tm} teal={teal} />
                  </View>

                  {rError ? (
                    <View style={styles.errorBox}>
                      <Feather name="alert-circle" size={13} color="#DC2626" />
                      <Text style={styles.errorText}>{rError}</Text>
                    </View>
                  ) : null}

                  <TouchableOpacity onPress={handleRegister} activeOpacity={0.85} disabled={rLoading}
                    style={[styles.submitBtn, { backgroundColor: teal, opacity: rLoading ? 0.7 : 1 }]}>
                    {rLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : (
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
            Google &amp; Apple login are UI scaffolding — cloud sync coming soon.{"\n"}
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
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },

  hero: { alignItems: "center", paddingTop: 28, paddingBottom: 20, paddingHorizontal: 24, gap: 8 },
  heroIcon: { width: 72, height: 72, borderRadius: 22, borderWidth: 1.5, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  heroIconCross: { width: 44, height: 44, position: "relative", alignItems: "center", justifyContent: "center" },
  crossH: { position: "absolute", width: 36, height: 10, borderRadius: 5 },
  crossV: { position: "absolute", height: 36, width: 10, borderRadius: 5 },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },

  // Social
  socialGroup: { gap: 10, marginBottom: 8 },
  socialBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 13, borderRadius: 13, borderWidth: 1.5, gap: 4,
  },
  socialLoader: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 4 },

  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: "Inter_500Medium" },

  tabs: {
    flexDirection: "row", marginHorizontal: 20, borderRadius: 12,
    borderWidth: 1, padding: 4, marginBottom: 20,
  },
  tabItem: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  tabItemActive: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 3 },
  tabText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  tabTextActive: { fontFamily: "Inter_700Bold" },

  form: { paddingHorizontal: 20, gap: 14 },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  fieldWrap: {
    flexDirection: "row", alignItems: "center", borderWidth: 1.5,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
  },

  // Dropdown
  dropdown: {
    borderWidth: 1.5, borderRadius: 12, marginTop: 4,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 6 },
      web: { boxShadow: "0 4px 16px rgba(0,0,0,0.12)" } as any,
    }),
  },
  dropdownItem: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 14,
    paddingVertical: 13, gap: 10, borderBottomWidth: 1,
  },
  dropdownDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },

  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#DC262610", borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: "#DC262630",
  },
  errorText: { flex: 1, fontSize: 13, color: "#DC2626", fontFamily: "Inter_500Medium" },

  submitBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 15, borderRadius: 14, marginTop: 4,
  },
  submitBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: -0.2 },
  switchLink: { alignItems: "center", paddingVertical: 8 },
  switchLinkText: { fontSize: 13, fontFamily: "Inter_400Regular" },

  successBox: { alignItems: "center", gap: 12, paddingVertical: 24, paddingHorizontal: 16 },
  successIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  successSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },

  avatarCard: { borderWidth: 1, borderRadius: 20, padding: 24, alignItems: "center", gap: 6 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  avatarInitials: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  profileName: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  profileEmail: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  profileBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6,
  },
  profileBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  infoCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 6 },
  infoCardTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  infoCardBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5,
  },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#DC2626" },

  disclaimer: {
    fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center",
    paddingHorizontal: 28, paddingTop: 20, lineHeight: 17,
  },
});
