import {
  View,
} from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import dayjs from "dayjs";
import { ListItem } from "../../components/common/ListItem";
import { getQuizByID } from "../../redux/quiz/quizsSlice";
import { getData } from "../../utils/asyncStoreage";
import { showToast } from "../../utils/toast";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { BtnBack } from "@/components/common/BtnBack";
import { ThemedText } from "@/components/default/ThemedText";

export default function ListQuizScreen() {
  const navigateBack = () => {
    router.back();
  };

  // const route = useRoute<HomeStackRouteScreenProps<"ListQuizScreen">>();

  const { quizs } = useAppSelector((state) => state.quizsState);
  const dispatch = useAppDispatch();

  const onHandleQuiz = async (quizId: string) => {
    const accessToken = await getData<string>("@accessToken");
    dispatch(getQuizByID({ quizId, accessToken }))
      .unwrap()
      .then(() => {
        // navigation.navigate("QuizScreen", { quizId });
        router.push({
          pathname: "QuizScreen",
          params: { quizId },
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
          <ThemedText style={tw`text-lg font-bold`}>List Quiz Exam</ThemedText>
        </View>
        <View style={tw`ios:pb-36 min-h-full`}>
          <FlashList
            estimatedItemSize={200}
            contentContainerStyle={tw`pt-2 px-6 android:pb-34`}
            data={quizs}
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
                  status: item.status,
                }}
                action={(id, name) => {
                  onHandleQuiz(id);
                }}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
