import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";
import { changeCategory } from "@/redux/course/courseSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ThemedText } from "@/components/default/ThemedText";
import { ThemedBtn } from "@/components/default/ThemedBtn";

export default function ResultEssayScreen() {
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`justify-between p-8 h-full`}>
        <View>
          <ThemedText style={tw`text-2xl font-bold mb-6 w-full text-center`}>
            Result Essay
          </ThemedText>
          <ThemedText style={tw`text-3xl font-bold text-center`}>
            Grading
          </ThemedText>
        </View>
        <ThemedBtn
          style={tw`bg-zinc-800 rounded-lg p-3 mb-10`}
          onPress={() => {
            // navigation.navigate("TabNavigator", { screen: "HomeScreen" });
            router.push("/HomeScreen");
            dispatch(changeCategory(""));
          }}
        >
          <Text style={tw`text-lg text-white font-bold text-center`}>
            Back to Home
          </Text>
        </ThemedBtn>
      </View>
    </SafeAreaView>
  );
}
