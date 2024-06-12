import { Platform, SafeAreaView, View } from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";


import { useAppSelector } from "../../redux/hooks";
import { router, useLocalSearchParams } from "expo-router";
import { Chart } from "@/components/stat/Chart";

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
          <IconButton
            icon="chevron-left"
            size={35}
            onPress={navigateBack}
            // style={tw`bg-white`}
          ></IconButton>
          <Text style={tw`text-lg font-bold`}>{exam.title}</Text>
        </View>
        <View style={tw`px-6 `}>
          <View style={tw`min-h-50 my-6 w-full`}>
            <Chart
              data={chart.slice(1, 11)}
            />
            <Text
              style={tw`text-base font-bold text-zinc-500 mt-4 text-center`}
            >
              Stat score of quiz
            </Text>
          </View>
          <View style={tw`items-center justify-center w-full mt-10`}>
            <Text style={tw`text-xl font-bold`}>Your score: {exam.score}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
