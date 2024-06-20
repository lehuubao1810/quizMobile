import { SafeAreaView, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Text } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { router } from "expo-router";
import { changeCategory } from "@/redux/course/courseSlice";
import { ThemedBtn } from "@/components/default/ThemedBtn";
import { ThemedText } from "@/components/default/ThemedText";

export default function ResultQuizScreen() {
  const { result } = useAppSelector((state) => state.quizsState);
  const dispatch = useAppDispatch();
  console.log("result", result?.ten_point_scale);
  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`justify-between p-8 h-full`}>
        <View>
          <ThemedText style={tw`text-2xl font-bold mb-6 w-full text-center`}>
            Result
          </ThemedText>
          <Text style={tw`text-3xl font-bold text-zinc-500 text-center`}>
            {result?.ten_point_scale}
          </Text>
        </View>
        <ThemedBtn
          style={tw`bg-zinc-800 rounded-lg p-3 mb-10`}
          onPress={() => {
            // navigation.navigate("TabNavigator", { screen: "HomeScreen" });
            router.push("/HomeScreen");
            dispatch(changeCategory(""));
          }}
        >
          <Text style={tw`text-lg font-bold text-center text-white`}>
            Back to Home
          </Text>
        </ThemedBtn>
      </View>
    </SafeAreaView>
  );
}
