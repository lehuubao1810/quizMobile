import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

import { useAppSelector } from "../../redux/hooks";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { socket } from "../../constants/socket";
import { Icon } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";

const QuizTestScreen = () => {
  const { user } = useAppSelector((state) => state.authReducer);

  const { roomId } = useLocalSearchParams() as { roomId: string };

  const [answerLength, setAnswerLength] = useState(0);
  const [questionLength, setQuestionLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [answerCorrectIndex, setAnswerCorrectIndex] = useState(null);

  const [answerSelected, setAnswerSelected] = useState<number | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    let questionLengthParams = 0;
    socket.on("quizStarted", (questionLength) => {
      if (questionLength) {
        console.log("questionLength", questionLength);
        questionLengthParams = questionLength;
        setQuestionLength(questionLength);
        setIsLoading(false);
      }
    });

    socket.on("countdown", (countdown) => {
      console.log("countdown qzt", countdown);
      setCountdown(countdown);
      if (countdown > 0 && questionLength === 0) {
        setIsLoading(true);
      }
    });

    socket.on("timeUp", ({ correctAnswerIndex }) => {
      setAnswerCorrectIndex(correctAnswerIndex);
      console.log(
        "timeUp",
        correctAnswerIndex,
        answerSelected,
        correctAnswerIndex === answerSelected
      );
    });

    socket.on("newQuestion", ({ questions, timeLeft }) => {
      setAnswerLength(questions.answers.length);
      setAnswerCorrectIndex(null);
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswerSelected(null);
    });

    socket.on("quizEnd", ({ personalScore, top5 }) => {
      console.log("quizend", personalScore, top5);
      router.push({
        pathname: "/ResultScreen",
        params: {
          personalScore,
          top5: JSON.stringify(top5),
          questionLength: questionLengthParams,
        },
      });
    });

    // Error
    return () => {
      socket.off("newQuestion");
      socket.off("quizStarted");
      socket.off("countdown");
      socket.off("timeUp");
      socket.off("newQuestion");
      socket.off("quizEnd");
    };
  }, []);

  const handleSubmitAnswer = (answerIndex: number) => {
    if (answerSelected !== null) {
      return;
    }
    console.log("answerIndex", answerIndex);
    console.log("socket", socket.id);
    setAnswerSelected(answerIndex);
    socket.emit("answer", { roomId, answerIndex });
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      {countdown === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-2xl font-bold mb-12`}>
            Question {currentQuestionIndex}
          </Text>
          <View style={tw`flex-row w-full px-6 justify-between mb-6`}>
            <TouchableOpacity
              style={tw`bg-red-400 rounded-lg p-4 mb-2 w-[45%] h-36 items-center justify-center 
                ${
                  answerSelected !== 0 && answerSelected !== null
                    ? "opacity-50"
                    : ""
                }
              `}
              onPress={() => handleSubmitAnswer(0)}
            >
              {answerCorrectIndex !== null ? (
                answerCorrectIndex === 0 ? (
                  <Icon source={"check-bold"} size={38} color={"#fff"} />
                ) : answerSelected === 0 ? (
                  <Icon source={"close-thick"} size={38} color={"#fff"} />
                ) : (
                  <Icon source={"triangle"} size={38} color={"#fff"} />
                )
              ) : (
                <Icon source={"triangle"} size={38} color={"#fff"} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-blue-400 rounded-lg p-4 mb-2 w-[45%] h-36 items-center justify-center 
                ${
                  answerSelected !== 1 && answerSelected !== null
                    ? "opacity-50"
                    : ""
                }
              `}
              onPress={() => handleSubmitAnswer(1)}
            >
              {answerCorrectIndex !== null ? (
                answerCorrectIndex === 1 ? (
                  <Icon source={"check-bold"} size={38} color={"#fff"} />
                ) : answerSelected === 1 ? (
                  <Icon source={"close-thick"} size={38} color={"#fff"} />
                ) : (
                  <Icon source={"rhombus"} size={38} color={"#fff"} />
                )
              ) : (
                <Icon source={"rhombus"} size={38} color={"#fff"} />
              )}
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row w-full px-6 justify-between`}>
            <TouchableOpacity
              style={tw`bg-yellow-400 rounded-lg p-4 mb-2 w-[45%] h-36 items-center justify-center 
                ${
                  answerSelected !== 2 && answerSelected !== null
                    ? "opacity-50"
                    : ""
                }
              `}
              onPress={() => handleSubmitAnswer(2)}
            >
              {answerCorrectIndex !== null ? (
                answerCorrectIndex === 2 ? (
                  <Icon source={"check-bold"} size={38} color={"#fff"} />
                ) : answerSelected === 2 ? (
                  <Icon source={"close-thick"} size={38} color={"#fff"} />
                ) : (
                  <Icon source={"circle"} size={38} color={"#fff"} />
                )
              ) : (
                <Icon source={"circle"} size={38} color={"#fff"} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-green-400 rounded-lg p-4 mb-2 w-[45%] h-36 items-center justify-center 
                ${
                  answerSelected !== 3 && answerSelected !== null
                    ? "opacity-50"
                    : ""
                }
              `}
              onPress={() => handleSubmitAnswer(3)}
            >
              {answerCorrectIndex !== null ? (
                answerCorrectIndex === 3 ? (
                  <Icon source={"check-bold"} size={38} color={"#fff"} />
                ) : answerSelected === 3 ? (
                  <Icon source={"close-thick"} size={38} color={"#fff"} />
                ) : (
                  <Icon source={"square"} size={38} color={"#fff"} />
                )
              ) : (
                <Icon source={"square"} size={38} color={"#fff"} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <View
            style={tw`justify-center items-center bg-zinc-800 w-20 h-20 rounded-full`}
          >
            <Text style={tw`text-4xl font-bold text-white`}>{countdown}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default QuizTestScreen;
