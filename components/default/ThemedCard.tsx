import { TouchableOpacity, type TouchableOpacityProps } from "react-native";
import tw from "twrnc";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedCardProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedCard({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedCardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "card"
  );
  console.log(backgroundColor);
  return (
    <TouchableOpacity style={[style, { backgroundColor }]} {...otherProps} />
  );
}
