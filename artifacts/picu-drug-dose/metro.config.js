const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Keep Expo's default asset handling, while explicitly preserving the
// TrueType icon fonts used by @expo/vector-icons in web exports.
if (!config.resolver.assetExts.includes("ttf")) {
  config.resolver.assetExts.push("ttf");
}

module.exports = config;
