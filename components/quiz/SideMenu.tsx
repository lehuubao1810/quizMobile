import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

import { Quiz } from "../../types/Exam/Quiz";

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
        style={tw`w-4/6 h-full bg-white p-4 justify-between shadow-2xl`}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
      >
        <View style={tw``}>
          <Text style={tw`font-bold text-base mb-4`}>List question</Text>
          <View style={tw`flex flex-row flex-wrap gap-4`}>
            {quiz.dataExam &&
              quiz.dataExam.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCurrentQuestion(index);
                    hideSideMenu();
                  }}
                  style={tw`border-2 border-slate-200 rounded-lg p-4 mb-4
                ${index === currentQuestion ? "border-sky-600" : ""} 
                ${checkIsSelectedinQuiz(question._id) ? "bg-blue-400" : ""}`}
                >
                  <Text
                    style={tw`text-lg font-bold ${checkIsSelectedinQuiz(question._id) ? "text-white" : ""}`}
                  >
                    {index + 1}
                  </Text>
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