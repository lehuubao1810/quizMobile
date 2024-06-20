import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useColorScheme } from "react-native";
import { IconButton } from "react-native-paper";

type Props = {
  onPress?: () => void;
};

export const BtnBack = (props: Props) => {
  const navigateBack = () => {
    router.back();
  };
  const colorScheme = useColorScheme();
  return (
    <IconButton
      icon="chevron-left"
      size={35}
      onPress={props.onPress ? props.onPress : navigateBack}
      iconColor={`${Colors[colorScheme ?? "light"].text}`}
    ></IconButton>
  );
};
