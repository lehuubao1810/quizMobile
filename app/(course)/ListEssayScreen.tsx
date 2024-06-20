import { View } from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import dayjs from "dayjs";
import { ListItem } from "../../components/common/ListItem";
import { getData } from "../../utils/asyncStoreage";
import { getEssayByID } from "../../redux/essay/essaySlice";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import { showToast } from "@/utils/toast";
import { BtnBack } from "@/components/common/BtnBack";
import { ThemedText } from "@/components/default/ThemedText";

export default function ListEssayScreen() {
  const navigateBack = () => {
    router.back();
  };

  // const route = useRoute<HomeStackRouteScreenProps<"ListEssayScreen">>();
  // const courseId = useMemo(() => route.params.courseId, [route]);

  const courseId = useLocalSearchParams().courseId as string;

  const { essays } = useAppSelector((state) => state.essaysState);
  const dispatch = useAppDispatch();

  const onHandleEssay = async (essayId: string) => {
    const accessToken = await getData<string>("@accessToken");
    dispatch(getEssayByID({ essayId, courseId, accessToken }))
      .unwrap()
      .then(() => {
        // navigation.navigate("EssayScreen", { essayId });
        router.push({
          pathname: "EssayScreen",
          params: { essayId },
        });
      })
      .catch((err) => {
        showToast("error", err);
      });
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw``}>
        <View style={tw`w-full pl-1 flex-row items-center`}>
          <BtnBack/>
          <ThemedText style={tw`text-lg font-bold`}>List Essay Exam</ThemedText>
        </View>
        <View style={tw`px-6 ios:pb-36 android:pb-44 min-h-full`}>
          <FlashList
            estimatedItemSize={200}
            contentContainerStyle={tw`pt-2 pb-24 pl-2`}
            data={essays}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ListItem
                item={{
                  _id: item._id,
                  name: item.title,
                  icon: "quiz",
                  time: `${dayjs(item.time_end)
                    .format("HH:mm:ss DD/MM")
                    .toString()}`,
                  status: item.isFirst ? "null" : "pending",
                }}
                action={(id, name) => {
                  onHandleEssay(id);
                }}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
