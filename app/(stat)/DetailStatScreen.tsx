import { Platform, SafeAreaView, View } from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";

import { useAppSelector } from "../../redux/hooks";
import { router, useLocalSearchParams } from "expo-router";
import { Chart } from "@/components/stat/Chart";
import { BtnBack } from "@/components/common/BtnBack";
import { ThemedText } from "@/components/default/ThemedText";

export default function DetailStatScreen() {
  const navigateBack = () => {
    // navigation.goBack();
    router.back();
  };

  // const route = useRoute<HomeStackRouteScreenProps<"DetailStatScreen">>();

  // const { examId } = useMemo(() => route.params, [route]);

  const { examId } = useLocalSearchParams() as { examId: string };

  const { exam, chart } = useAppSelector((state) => state.statState);

  const totalValue = (chart: any[]) => {
    return chart.reduce((acc, item) => acc + item.value, 0);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`min-h-full`}>
        <View style={tw`w-full pl-1 flex-row items-center`}>
          <BtnBack />
          <ThemedText style={tw`text-lg font-bold`}>{exam.title}</ThemedText>
        </View>
        <View style={tw`px-6 `}>
          <View style={tw`min-h-50 my-6 w-full justify-center items-center`}>
            <Chart
              data={
                // chart.slice(1, 11)
                // test//
                [
                  { label: "1", value: 2 },
                  { label: "2", value: 3 },
                  { label: "3", value: 4 },
                  { label: "4", value: 5 },
                  { label: "5", value: 14 },
                  { label: "6", value: 18 },
                  { label: "7", value: 5 },
                  { label: "8", value: 4 },
                  { label: "9", value: 2 },
                  { label: "10", value: 1 },
                ]
              }
              myScore={exam.score ?? 0}
            />
            <ThemedText
              style={tw`text-base font-bold mt-4 text-center`}
            >
              Stat score of quiz
            </ThemedText>
          </View>
          <View style={tw`items-center justify-center w-full mt-10`}>
            <ThemedText style={tw`text-xl font-bold`}>Your score: {exam.score}</ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
