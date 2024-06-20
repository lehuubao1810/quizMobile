import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import tw from "twrnc";

import { Quiz } from "../../types/Exam/Quiz";
import { ThemedText } from "../default/ThemedText";
import { Colors } from "@/constants/Colors";

type Props = {
  isShowListQuestion: boolean;
  hideSideMenu: () => void;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  checkIsSelectedinQuiz: (questionId: string) => boolean;
  currentQuestion: number;
  quiz: Quiz;
  showModalLeaveQuiz: () => void;
  positionX: Animated.Value;
};

export const SideMenu: React.FC<Props> = ({
  isShowListQuestion,
  hideSideMenu,
  quiz,
  setCurrentQuestion,
  checkIsSelectedinQuiz,
  currentQuestion,
  showModalLeaveQuiz,
  positionX,
}) => {
  const colorScheme = useColorScheme();
  return (
    <Animated.View
      style={
        // tw`absolute bg-slate-400/50 z-40 w-full h-full`
        {
          position: "absolute",
          zIndex: 10,
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          transform: [
            {
              translateX: positionX,
            },
          ],
        }
      }
      onTouchStart={hideSideMenu}
    >
      <View
        style={tw`w-4/6 h-full p-4 bg-[${
          Colors[colorScheme ?? "light"].card
        }] justify-between shadow-2xl`}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
      >
        <View style={tw``}>
          <ThemedText style={tw`font-bold text-base mb-4`}>
            List question
          </ThemedText>
          <View style={tw`flex flex-row flex-wrap gap-4`}>
            {quiz.dataExam &&
              quiz.dataExam.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCurrentQuestion(index);
                    hideSideMenu();
                  }}
                  style={tw`border-2 border-slate-300 rounded-lg p-4 mb-4
                ${
                  index === currentQuestion
                    ? `${
                        colorScheme === "dark"
                          ? `border-[${Colors.light.background}] bg-[#333]`
                          : `border-[${Colors.dark.background}] bg-[#ccc]`
                      }`
                    : ""
                }
                ${
                  checkIsSelectedinQuiz(question._id)
                    ? `bg-[${Colors[colorScheme ?? "light"].btn}]`
                    : ""
                }`}
                >
                  <ThemedText
                    style={tw`text-lg font-bold ${
                      checkIsSelectedinQuiz(question._id) ? `text-white` : ""
                    }`}
                  >
                    {index + 1}
                  </ThemedText>
                </TouchableOpacity>
              ))}
          </View>
        </View>
        <TouchableOpacity
          style={tw`bg-red-500 rounded-lg p-3 mb-10`}
          onPress={showModalLeaveQuiz}
        >
          <Text style={tw`text-lg font-bold text-center text-white`}>
            Leave Quiz
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
