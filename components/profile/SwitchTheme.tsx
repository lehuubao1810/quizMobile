import { useAppDispatch } from "@/redux/hooks";
import { Appearance, useColorScheme } from "react-native";
import { Icon, IconButton, useTheme } from "react-native-paper";
import tw from "twrnc";
import { Colors } from "@/constants/Colors";
import { ThemedCard } from "../default/ThemedCard";

export const SwitchTheme = () => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  const toggleTheme = () => {
    console.log("toggle theme");
    Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <ThemedCard style={tw`p-2 rounded-full shadow-md`} onPress={toggleTheme}>
      <Icon
        source={colorScheme === "dark" ? "weather-sunny" : "weather-night"}
        size={30}
        color={`${Colors[colorScheme ?? "light"].text}`}
      />
    </ThemedCard>
  );
};
