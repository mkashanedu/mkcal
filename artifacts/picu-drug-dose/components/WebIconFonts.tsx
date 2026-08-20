import FeatherFont from "@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf";
import FontAwesomeFont from "@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf";
import IoniconsFont from "@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf";
import MaterialIconsFont from "@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf";
import MaterialCommunityIconsFont from "@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";
import React, { useEffect } from "react";
import { Platform } from "react-native";

const STYLE_ID = "peadscal-web-icon-fonts";

const ICON_FONTS = [
  ["Feather", FeatherFont],
  ["FontAwesome", FontAwesomeFont],
  ["Ionicons", IoniconsFont],
  ["MaterialIcons", MaterialIconsFont],
  ["MaterialCommunityIcons", MaterialCommunityIconsFont],
] as const;

/**
 * React Native Web normally loads icon fonts through useFonts. Netlify-hosted
 * exports can still render missing-glyph boxes when the generated font-face
 * rules are not present in the document, so we inject them explicitly.
 */
export function WebIconFonts() {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = ICON_FONTS.map(
      ([family, source]) => `
        @font-face {
          font-family: "${family}";
          src: url("${source}") format("truetype");
          font-style: normal;
          font-weight: 400;
          font-display: block;
        }
      `,
    ).join("\n");
    document.head.appendChild(style);

    return () => {
      document.getElementById(STYLE_ID)?.remove();
    };
  }, []);

  return null;
}