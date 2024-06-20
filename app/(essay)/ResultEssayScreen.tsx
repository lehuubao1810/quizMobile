import { SafeAreaView, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import { changeCategory } from "@/redux/course/courseSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function ResultEssayScreen() {
  const dispatch = useAppDispatch();

  

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`justify-between p-8 h-full`}>
        <View>
          <Text style={tw`text-2xl font-bold mb-6 w-full text-center`}>
            Result Essay
          </Text>
          <Text style={tw`text-3xl font-bold text-zinc-500 text-center`}>
            Grading
          </Text>
        </View>
        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
