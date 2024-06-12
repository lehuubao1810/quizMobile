import { Colors } from "@/constants/Colors";
import {
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
  useColorScheme,
} from "react-native";
import tw from "twrnc";

type Props = {
  isLoading: boolean;
};

const Loader = ({ isLoading }: Props) => {
  const osName = Platform.OS;

  if (!isLoading) return null;
  const colorScheme = useColorScheme();
  return (
    <View
      style={tw`absolute flex justify-center items-center w-full h-full z-10 bg-slate-500/50`}
    >
      <ActivityIndicator
        animating={isLoading}
        color={Colors[colorScheme ?? "light"].tint}
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
