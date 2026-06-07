import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";

const DISCLAIMER_KEY = "picu_disclaimer_v2";

export function DisclaimerModal() {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DISCLAIMER_KEY).then((val) => {
      if (!val) setVisible(true);
    });
  }, []);

  function accept() {
    AsyncStorage.setItem(DISCLAIMER_KEY, "accepted");
    setVisible(false);
  }

  const BG    = isDark ? "#0B132B" : "#FFFFFF";
  const TEXT  = isDark ? "#FFFFFF" : "#0D1B2A";
  const MUTED = isDark ? "#8892B0" : "#475569";
  const BORDER = isDark ? "#233554" : "#E2E8F0";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: BG }]}>
          {/* Title */}
          <View style={styles.titleRow}>
            <Text style={styles.titleEmoji}>⚕️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: TEXT }]}>Medical Disclaimer</Text>
              <Text style={[styles.subtitle, { color: MUTED }]}>
                Please read before proceeding
              </Text>
            </View>
          </View>

          {/* Body */}
          <ScrollView
            style={[styles.bodyScroll, { borderTopColor: BORDER, borderBottomColor: BORDER }]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.body, { color: MUTED }]}>
              This application is intended for use by{" "}
              <Text style={[styles.bold, { color: TEXT }]}>
                qualified healthcare professionals only
              </Text>
              . It is a clinical reference tool designed to assist in pediatric drug dose calculations.
            </Text>

            <View style={[styles.alertBox, { backgroundColor: isDark ? "#6366F120" : "#FEF3C7", borderColor: isDark ? "#6366F1" : "#F59E0B" }]}>
              <Text style={[styles.alertText, { color: isDark ? "#6366F1" : "#92400E" }]}>
                ⚠️  This tool does NOT replace professional medical judgment, institutional protocols,
                or direct patient assessment.
              </Text>
            </View>

            <Text style={[styles.body, { color: MUTED }]}>
              Always verify every dose against current formularies and confirm with an attending
              physician before administration. Drug dosing in critically ill children requires
              expert clinical assessment.
              {"\n\n"}
              The developers and contributors assume no liability for clinical decisions made
              based on information provided by this application.
              {"\n\n"}
              <Text style={[styles.italic, { color: isDark ? "#8892B0" : "#94A3B8" }]}>
                Doses are based on Harriet Lane Handbook 23rd Edition and PALS 2025 Guidelines.
              </Text>
            </Text>
          </ScrollView>

          {/* Attribution */}
          <View style={[styles.attribution, { borderTopColor: BORDER }]}>
            <Text style={[styles.attributionBy, { color: MUTED }]}>Prepared by</Text>
            <Text style={[styles.attributionName, { color: "#0EA5E9" }]}>
              Staff Kashan Peads ICU
            </Text>
          </View>

          {/* Accept */}
          <Pressable
            onPress={accept}
            style={({ pressed }) => [
              styles.acceptBtn,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.acceptBtnText}>I Understand — Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20 },
      android: { elevation: 12 },
    }),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    paddingBottom: 16,
  },
  titleEmoji: { fontSize: 32 },
  title: { fontSize: 20, fontWeight: "800", letterSpacing: -0.4 },
  subtitle: { fontSize: 12, marginTop: 2 },
  bodyScroll: {
    maxHeight: 280,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  body: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
  alertBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  alertText: { fontSize: 13, lineHeight: 19, fontWeight: "600" },
  attribution: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center",
    gap: 2,
  },
  attributionBy: { fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" },
  attributionName: { fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
  attributionRole: { fontSize: 12 },
  acceptBtn: {
    margin: 16,
    marginTop: 8,
    backgroundColor: "#0EA5E9",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  acceptBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
