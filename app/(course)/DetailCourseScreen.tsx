import {
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  useColorScheme,
} from "react-native";
import tw from "twrnc";
import { Icon, IconButton, Text } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import dayjs from "dayjs";
import { getData } from "../../utils/asyncStoreage";
import { getQuizByID } from "../../redux/quiz/quizsSlice";
import { useCallback, useState } from "react";
import { getEssayByID } from "../../redux/essay/essaySlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExamItem } from "../../components/exam/ExamItem";
import { showToast } from "../../utils/toast";
import { FlashList } from "@shopify/flash-list";
import { getDetailCourse } from "../../redux/course/courseSlice";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { BtnBack } from "@/components/common/BtnBack";
import { ThemedText } from "@/components/default/ThemedText";

export default function DetailCourseScreen() {
  // const route = useRoute<HomeStackRouteScreenProps<"DetailCourseScreen">>();

  // const { courseName, courseId } = useMemo(() => route.params, [route]);

  const { courseName, courseId } = useLocalSearchParams() as {
    courseName: string;
    courseId: string;
  };

  const dispatch = useAppDispatch();

  const { quizs, quizCurrent } = useAppSelector((state) => state.quizsState);
  const { essays } = useAppSelector((state) => state.essaysState);
  const {} = useAppSelector((state) => state.coursesState);

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

  const navigateBack = () => {
    // navigation.goBack();
    router.back();
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const accessToken = await getData<string>("@accessToken");

    dispatch(
      getDetailCourse({ courseId, accessToken: accessToken ?? "" })
    ).then(() => {
      setRefreshing(false);
    });
  }, []);

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`w-full pl-1 flex-row items-center`}>
        <BtnBack />
        <ThemedText style={tw`text-lg font-bold`}>{courseName}</ThemedText>
      </View>
      <ScrollView
        style={tw`flex-1`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`android:pb-[${insets.bottom}] min-h-65`}>
          <View style={tw`px-6`}>
            <View style={tw`flex-row items-center justify-between my-4`}>
              <ThemedText style={tw`text-lg font-bold`}>Quiz Exam</ThemedText>
              {quizs.length !== 0 && (
                <TouchableOpacity
                  style={tw`flex-row items-center gap-2`}
                  onPress={() => {
                    // navigation.navigate("ListQuizScreen")
                    router.push("ListQuizScreen");
                  }}
                >
                  <Text style={tw`font-bold text-zinc-500`}>View all</Text>
                  <Icon
                    source={"arrow-right"}
                    size={20}
                    color="rgb(113 113 122)"
                  />
                </TouchableOpacity>
              )}
            </View>
            {quizs.length !== 0 ? (
              <FlashList
                estimatedItemSize={200}
                contentContainerStyle={tw`ios:max-h-65 py-2 pl-2`}
                data={quizs}
                keyExtractor={(item) => item._id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <ExamItem
                    item={{
                      _id: item._id,
                      title: item.title,
                      course_name: item.course_name,
                      status: item.status,
                    }}
                    action={onHandleQuiz}
                    time={dayjs(item.time_end).format("HH:mm:ss DD/MM")}
                  />
                )}
              />
            ) : (
              <View>
                <Text style={tw`text-lg font-bold text-zinc-600 text-center`}>
                  Don't have any quiz
                </Text>
              </View>
            )}
          </View>
          <View style={tw`px-6 min-h-65 pb-4`}>
            <View style={tw`flex-row items-center justify-between my-4`}>
              <ThemedText style={tw`text-lg font-bold`}>Essay Exam</ThemedText>
              {essays.length !== 0 && (
                <TouchableOpacity
                  style={tw`flex-row items-center gap-2`}
                  onPress={() =>
                    // navigation.navigate("ListEssayScreen", { courseId })
                    router.push({
                      pathname: "ListEssayScreen",
                      params: { courseId },
                    })
                  }
                >
                  <Text style={tw`font-bold text-zinc-500`}>View all</Text>
                  <Icon
                    source={"arrow-right"}
                    size={20}
                    color="rgb(113 113 122)"
                  />
                </TouchableOpacity>
              )}
            </View>
            {essays.length !== 0 ? (
              <FlashList
                estimatedItemSize={200}
                contentContainerStyle={tw`py-2 pl-2`}
                data={essays}
                keyExtractor={(item) => item._id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <ExamItem
                    item={{
                      _id: item._id,
                      title: item.title,
                      course_name: item.course_name,
                      status: item.isFirst ? "null" : "pending",
                    }}
                    action={onHandleEssay}
                    time={dayjs(item.time_end).format("HH:mm:ss DD/MM")}
                  />
                )}
              />
            ) : (
              <View>
                <Text style={tw`text-lg font-bold text-zinc-600 text-center`}>
                  Don't have any essay
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
