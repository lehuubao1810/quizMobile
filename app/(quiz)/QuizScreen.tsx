import {
  Animated,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as Progress from "react-native-progress";
import { SideMenu } from "../../components/quiz/SideMenu";
import { ModalConfirm } from "../../components/common/ModalConfirm";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Answer, Quiz } from "../../types/Exam/Quiz";
import { postAnswer, submitQuiz } from "../../redux/quiz/quizsSlice";
import RenderHtml from "react-native-render-html";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { changeCategory } from "@/redux/course/courseSlice";
import { ThemedText } from "@/components/default/ThemedText";
import { Colors } from "@/constants/Colors";

export default function QuizScreen() {
  // const route = useRoute<HomeStackRouteScreenProps<"QuizScreen">>();
  // const quizId = useMemo(() => route.params.quizId, [route.params.quizId]);

  const { quizId } = useLocalSearchParams() as {
    quizId: string;
  };

  const { quizCurrent, answerSelected } = useAppSelector(
    (state) => state.quizsState
  );
  // console.log("quizCurrent", quizCurrent);
  const dispatch = useAppDispatch();
  const initialProgress =
    quizCurrent.time_remaining / (quizCurrent.total_time * 60);
  // console.log('remain', initialProgress);
  const [progress, setProgress] = useState(initialProgress);
  const [color, setColor] = useState("rgb(59 130 246)");
  const [time, setTime] = useState({
    minutes: Math.floor(quizCurrent?.time_remaining / 60) ?? 1,
    seconds: Math.floor(quizCurrent?.time_remaining % 60) ?? 0,
  });
  const total_time = time.minutes;

  const [answers, setAnswers] = useState<Answer[]>(answerSelected);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isShowListQuestion, setIsShowListQuestion] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [contentModal, setContentModal] = useState("");
  const [handleConfirm, setHanleConfirm] = useState<() => void>(() => () => {});

  const handleSubmitExam = () => {
    dispatch(
      submitQuiz({
        id: quizCurrent.quiz_answer_id,
        quizId,
      })
    )
      .unwrap()
      .then(() => {
        // navigation.navigate("ResultQuizScreen");
        router.push("ResultQuizScreen");
      });
  };

  // progress bar
  const updateProgress = () => {
    setProgress((prevProgress) => {
      if (prevProgress <= 0) {
        return 0;
      }
      if (prevProgress <= 0.5) {
        setColor("rgb(250, 198, 18)");
      }
      if (prevProgress <= 0.1) {
        setColor("rgb(247, 85, 85)");
      }
      return prevProgress - 1 / (total_time * 60);
    });
  };

  const updateAnswer = (answer: number) => {
    const answers = [
      {
        question: {
          _id: quizCurrent?.dataExam[currentQuestion]._id,
        },
        answer_select: answer,
      },
    ];

    dispatch(
      postAnswer({
        answers,
        quiz_answer_id: quizCurrent.quiz_answer_id,
        quiz_exam_id: quizCurrent.quiz_exam_id,
        quizId,
      })
    );
  };

  const handleSelectAnswer = (answer: number) => {
    updateAnswer(answer);
    if (
      answers.some(
        (ans) => ans.question_id === quizCurrent?.dataExam[currentQuestion]._id
      )
    ) {
      setAnswers((prev) =>
        prev.map((ans) => {
          if (ans.question_id === quizCurrent?.dataExam[currentQuestion]._id) {
            return { ...ans, answer };
          } else {
            return ans;
          }
        })
      );
    } else {
      setAnswers((prev) => [
        ...prev,
        {
          question_id: quizCurrent?.dataExam[currentQuestion]._id,
          answer: answer,
        },
      ]);
    }
  };

  // check if question is selected in quizCurrent?
  const checkIsSelectedinQuiz = (questionId?: string) => {
    return answers.some(
      (answer) => answer.question_id === questionId && answer.answer !== null
    );
  };

  // check if answer is selected in current question
  const checkIsSelectedAnswer = (answerIndex: number) => {
    return answers.some(
      (answer) =>
        answer.question_id === quizCurrent?.dataExam[currentQuestion]._id &&
        answer.answer === answerIndex
    );
  };

  // check length of valid answers
  const lengthAnswers = () => {
    return answers.filter((answer) => answer.answer !== null).length;
  };

  const handleLeaveQuiz = () => {
    // navigation.navigate("TabNavigator", { screen: "HomeScreen" });
    router.push("HomeScreen");
    dispatch(changeCategory(""));
  };

  const handleSubmitBtn = () => {
    console.log(lengthAnswers(), quizCurrent?.dataExam.length);
    if (quizCurrent?.dataExam.length !== lengthAnswers()) {
      setContentModal(
        "You have not completed all the questions! Do you want to submit?"
      );
      setHanleConfirm(() => handleSubmitExam);

      setIsShowModal(true);
      return;
    }
    setContentModal("Are you sure to submit?");
    setHanleConfirm(() => handleSubmitExam);
    setIsShowModal(true);
  };

  useEffect(() => {
    console.log(answers);
    console.log(lengthAnswers());
  }, [answers]);

  // count down time
  useEffect(() => {
    const interval = setInterval(() => {
      updateProgress();
      setTime((prevTime) => {
        if (prevTime.minutes === 0 && prevTime.seconds === 0) {
          clearInterval(interval);
          return { minutes: 0, seconds: 0 };
        }
        if (prevTime.seconds === 0) {
          return { minutes: prevTime.minutes - 1, seconds: 59 };
        }
        return { minutes: prevTime.minutes, seconds: prevTime.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (time.minutes === 0 && time.seconds === 0) {
      handleSubmitExam();
    }
  }, [time]);

  // Animated sidemenu
  // positionX will be used as the value for opacity. Initial Value: 0
  const positionX = useRef(new Animated.Value(-500)).current;

  const showSideMenu = () => {
    // Will change positionX value to 1 in 5 seconds
    Animated.timing(positionX, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const hideSideMenu = () => {
    // Will change positionX value to 0 in 3 seconds
    Animated.timing(positionX, {
      toValue: -500,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  // Navigation
  const navigation = useNavigation();

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        const data = e.data.action.payload as {
          name: string;
          params: {
            screen: string;
          };
        };
        console.log("prevent back", data?.params.screen === "LoginScreen");
        console.log("prevent back 2", e);

        if (data?.params.screen === "LoginScreen") {
          return;
        }
        // Prevent default
        e.preventDefault();
      }),
    [navigation]
  );

  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={tw`flex-1`}>
      {isShowModal && (
        <ModalConfirm
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
          handleConfirm={handleConfirm}
          contentModal={contentModal}
        />
      )}
      <SideMenu
        isShowListQuestion={isShowListQuestion}
        hideSideMenu={hideSideMenu}
        positionX={positionX}
        quiz={quizCurrent ?? ({} as Quiz)}
        setCurrentQuestion={setCurrentQuestion}
        checkIsSelectedinQuiz={checkIsSelectedinQuiz}
        currentQuestion={currentQuestion}
        showModalLeaveQuiz={() => {
          setHanleConfirm(() => handleLeaveQuiz);
          setContentModal("Are you sure to leave?");
          setIsShowModal(true);
        }}
      />
      <View style={tw`w-full pl-3 pr-8 flex-row items-center justify-between`}>
        <IconButton
          icon="view-grid-outline"
          size={30}
          onPress={() => {
            setIsShowListQuestion(true);
            showSideMenu();
          }}
          iconColor={`${Colors[colorScheme ?? "light"].btn}`}
        ></IconButton>
        <ThemedText style={tw`text-lg font-bold`}>
          {time.minutes}:{time.seconds < 10 ? "0" : ""}
          {time.seconds}
        </ThemedText>
        <ThemedText style={tw`text-lg font-bold`}>{`${currentQuestion + 1}/${
          quizCurrent?.dataExam.length
        }`}</ThemedText>
      </View>
      <View style={tw`px-8 mb-4`}>
        <Progress.Bar progress={progress} width={null} color={color} />
      </View>

      <ScrollView style={tw`flex-2`}>
        <View style={tw`px-8`}>
          <View
            style={tw`w-full min-h-50 border-2 border-slate-200 p-4 rounded-lg bg-white shadow-md`}
          >
            {/* <Text style={tw`text-lg font-bold`}>
            {quizCurrent?.dataExam[currentQuestion]?.question} 
          
          </Text> */}
            <RenderHtml
              contentWidth={100}
              source={{
                html: quizCurrent?.dataExam[currentQuestion]?.question,
              }}
            />
          </View>
          <ThemedText style={tw`text-lg font-bold my-2 mt-4`}>
            Answer
          </ThemedText>
          <View style={tw``}>
            {quizCurrent?.dataExam.length !== 0 &&
              quizCurrent?.dataExam[currentQuestion].answer.map(
                (answer, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleSelectAnswer(index);
                    }}
                    style={tw`border-2 border-slate-200 rounded-lg p-4 mb-4 bg-[${
                      Colors[colorScheme ?? "light"].card
                    }] border-slate-300 shadow-md ${
                      checkIsSelectedAnswer(index)
                        ? "bg-slate-200 border-zinc-600"
                        : ""
                    }`}
                  >
                    <RenderHtml
                      contentWidth={100}
                      source={{
                        html: answer.content,
                      }}
                      baseStyle={tw`${
                        checkIsSelectedAnswer(index)
                          ? `text-[${Colors.light.text}]`
                          : `text-[${Colors[colorScheme ?? "light"].text}]`
                      }`}
                    />
                  </TouchableOpacity>
                )
              )}
          </View>
        </View>
        <View style={tw`px-8 pb-8`}>
          {currentQuestion === quizCurrent?.dataExam.length - 1 ? (
            <View>
              <TouchableOpacity
                onPress={handleSubmitBtn}
                style={tw`border-2 border-slate-200 rounded-lg p-3 mt-4 bg-[${
                  Colors[colorScheme ?? "light"].btn
                }] ${
                  quizCurrent?.dataExam.length === lengthAnswers()
                    ? ""
                    : "bg-white"
                }`}
              >
                <Text
                  style={tw`text-lg font-bold text-center text-white  ${
                    quizCurrent?.dataExam.length === lengthAnswers()
                      ? ""
                      : "text-black"
                  }`}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : currentQuestion === 0 ? (
            <TouchableOpacity
              style={tw`border-2 border-slate-200 rounded-lg p-3 mt-4 bg-[${
                Colors[colorScheme ?? "light"].btn
              }] ${
                checkIsSelectedinQuiz(
                  quizCurrent?.dataExam[currentQuestion]?._id
                )
                  ? ""
                  : "bg-white"
              }`}
              onPress={() => {
                setCurrentQuestion((prev) => prev + 1);
              }}
            >
              <Text
                style={tw`text-lg font-bold text-center text-white ${
                  checkIsSelectedinQuiz(
                    quizCurrent?.dataExam[currentQuestion]?._id
                  )
                    ? ""
                    : "text-slate-800"
                }`}
              >
                Next question
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={tw`flex-row gap-4`}>
              <TouchableOpacity
                style={tw`border-2 border-slate-200 rounded-lg p-3 mt-4 bg-[${
                  Colors[colorScheme ?? "light"].btn
                }]`}
                onPress={() => {
                  setCurrentQuestion((prev) => prev - 1);
                }}
              >
                <Text style={tw`text-lg font-bold text-center text-white`}>
                  Prev question
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`border-2 border-slate-200 rounded-lg p-3 mt-4 bg-[${
                  Colors[colorScheme ?? "light"].btn
                }] ${
                  checkIsSelectedinQuiz(
                    quizCurrent?.dataExam[currentQuestion]?._id
                  )
                    ? ""
                    : "bg-white"
                }`}
                onPress={() => {
                  setCurrentQuestion((prev) => prev + 1);
                }}
              >
                <Text
                  style={tw`text-lg font-bold text-center text-white ${
                    checkIsSelectedinQuiz(
                      quizCurrent?.dataExam[currentQuestion]?._id
                    )
                      ? ""
                      : "text-slate-800"
                  }`}
                >
                  Next question
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
