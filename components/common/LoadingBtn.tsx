import { Colors } from "@/constants/Colors";
import { useColorScheme, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from "twrnc";

type Props = {
  style?: string;
};

export const LoadingBtn = (props: Props) => {
  const colorScheme = useColorScheme();
  return (
    <View style={tw`py-3 ${props.style ? props.style : ""}`}>
      <ActivityIndicator
        animating={true}
        color={`${Colors[colorScheme ?? "light"].tabCategory}`}
      />
    </View>
  );
};
