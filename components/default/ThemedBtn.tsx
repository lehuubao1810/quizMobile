import { TouchableOpacity, type TouchableOpacityProps } from "react-native";
import tw from "twrnc";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedBtnProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedBtn({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedBtnProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  console.log(backgroundColor);
  return (
    <TouchableOpacity style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
