import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { changeCategory } from "@/redux/course/courseSlice";

interface Params {
  questionLength: number;
  personalScore: number;
  top5: string;
}

const ResultScreen = () => {
  const { user } = useAppSelector((state) => state.authReducer);
  const dispacth = useAppDispatch();

  const [top5, setTop5] = useState(
    [] as {
      name: string;
      score: number;
    }[]
  );

  const params = useLocalSearchParams() as Partial<Params>;

  console.log("result params", params);

  const personalScore = params.personalScore ?? 0;

  useEffect(() => {
    if (params.top5) {
      setTop5(JSON.parse(params.top5));
      console.log("top5", JSON.parse(params.top5));
    }
  }, []);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`px-6 items-center`}>
        <Text style={tw`text-xl font-bold mb-8`}>Result</Text>
        <View style={tw`flex-row justify-between gap-4 items-end`}>
          <View>
            <Text style={tw`text-center font-bold`}>
              {top5[1]?.name ?? "---"}
            </Text>
            <View style={tw`h-36 bg-blue-400 w-20 rounded-t-lg items-center`}>
              <View style={tw`items-center`}>
                <View style={tw`bg-stone-300 w-4 h-4 -mb-2`} />
                <View
                  style={tw`bg-stone-300 w-10 h-10 rounded-full justify-center`}
                >
                  <Text style={tw`text-center text-white font-bold text-xl`}>
                    2
                  </Text>
                </View>
                <Text style={tw`text-center text-white font-bold`}>
                  {top5[1]?.score ?? 0} of {params.questionLength ?? 10}
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`items-center`}>
            <Icon source="crown" size={50} color="rgb(252 211 77)" />
            <Text style={tw`text-center font-bold`}>
              {top5[0]?.name ?? "---"}
            </Text>
            <View style={tw`h-50 bg-blue-400 w-20 rounded-t-lg items-center`}>
              <View style={tw`items-center`}>
                <View style={tw`bg-yellow-400 w-4 h-4 -mb-2`} />
                <View
                  style={tw`bg-yellow-400 w-10 h-10 rounded-full justify-center`}
                >
                  <Text style={tw`text-center text-white font-bold text-xl`}>
                    1
                  </Text>
                </View>
                <Text style={tw`text-center text-white font-bold`}>
                  {top5[0]?.score ?? 0} of {params.questionLength ?? 10}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={tw`text-center font-bold`}>
              {top5[2]?.name ?? "---"}
            </Text>
            <View style={tw`h-26 bg-blue-400 w-20 rounded-t-lg items-center`}>
              <View style={tw`items-center`}>
                <View style={tw`bg-amber-600 w-4 h-4 -mb-2`} />
                <View
                  style={tw`bg-amber-600 w-10 h-10 rounded-full justify-center`}
                >
                  <Text style={tw`text-center text-white font-bold text-xl`}>
                    3
                  </Text>
                </View>
                <Text style={tw`text-center text-white font-bold`}>
                  {top5[2]?.score ?? 0} of {params.questionLength ?? 10}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Back to home */}
        <TouchableOpacity
          style={tw`bg-zinc-800 p-3 rounded-lg w-full items-center mt-4`}
          onPress={() => {
            // navigation.navigate("TabNavigator", { screen: "HomeScreen" })
            router.push("/HomeScreen");
            dispacth(changeCategory(""));
          }}
        >
          <Text style={tw`text-white font-bold text-base`}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResultScreen;
