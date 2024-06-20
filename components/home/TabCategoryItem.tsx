import { TouchableOpacity, useColorScheme } from "react-native";
import tw from "twrnc";
import { Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = {
  title: string;
  active: boolean;
  onPress: () => void;
};

export const TabCategoryItem = (props: Props) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      style={tw`flex-1 items-center py-2 px-6 my-2 ml-2 ${
        props.active ? `bg-[${Colors[colorScheme ?? "light"].btn}] shadow-md` : ""
      } rounded-3xl`}
      onPress={props.onPress}
    >
      <Text
        style={tw`text-base font-bold ${
          props.active
            ? `text-[${Colors[colorScheme ?? "light"].tabCategory}]`
            : `text-[${Colors[colorScheme ?? "light"].text}]`
        }`}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};
