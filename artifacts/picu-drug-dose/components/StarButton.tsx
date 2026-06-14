import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface StarButtonProps {
  isFav: boolean;
  onToggle: () => void;
  size?: number;
  color?: string;
}

export function StarButton({ isFav, onToggle, size = 20, color = "#F59E0B" }: StarButtonProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ padding: 2 }}
    >
      <Feather
        name={isFav ? "star" : "star"}
        size={size}
        color={isFav ? color : "#8892B0"}
      />
    </TouchableOpacity>
  );
}
