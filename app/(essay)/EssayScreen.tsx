import {
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as Progress from "react-native-progress";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import RenderHtml from "react-native-render-html";
import { getData } from "../../utils/asyncStoreage";
import { postAnswerEssay } from "../../redux/essay/essaySlice";
import { showToast } from "../../utils/toast";
import { ModalConfirm } from "../../components/common/ModalConfirm";
import { router } from "expo-router";

export default function EssayScreen() {

  const dispatch = useAppDispatch();

  const [answer, setAnswer] = useState("");

  const [fileUriAnswer, setfileUriAnswer] = useState<string | undefined>(
    undefined
  );

  const { essayCurrent, essayAnswerCurrent } = useAppSelector(
    (state) => state.essaysState
  );
  const initialProgress =
    essayCurrent.total_time_left / (essayCurrent.total_time * 60);
  // console.log('remain', initialProgress);
  const [progress, setProgress] = useState(initialProgress);
  const [color, setColor] = useState("rgb(59 130 246)");
  const [time, setTime] = useState({
    minutes: Math.floor((essayCurrent?.total_time_left / 60)) ?? 1,
    seconds: Math.floor((essayCurrent?.total_time_left % 60)) ?? 0,
  });
  const total_time = time.minutes;

  useEffect(() => {
    console.log("essayCurrent", essayCurrent?.total_time_left/60);
  }, [essayCurrent]);

  const [isShowModal, setIsShowModal] = useState(false);

  const pickFile = async () => {
    // const result = await DocumentPicker.getDocumentAsync({
    //   type: ["application/pdf", "application/msword", "text/plain", "image"],
    // });
    // console.log("result", result);
    const options: DocumentPicker.DocumentPickerOptions = {
      type: ["application/pdf", "application/msword", "text/plain"],
    };

    const file = await DocumentPicker.getDocumentAsync(options);
    if (file.canceled) {
      showToast("error", "File is not selected");
      return;
    }
    console.log(file);

    setfileUriAnswer(file.assets[0].uri);
    showToast("success", "File is selected");
  };

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

  // const handleLeaveQuiz = () => {
  //   navigation.navigate("TabNavigator", { screen: "HomeScreen" });
  // };

  // useEffect(() => {
  //   console.log(answers);

  // }, [answers]);

  const handleSubmit = async () => {
    const accessToken = await getData<string>("@accessToken");
    console.log("accessToken", accessToken);
    dispatch(
      postAnswerEssay({
        answer,
        id: essayAnswerCurrent._id,
        accessToken,
      })
    )
      .unwrap()
      .then(() => {
        // navigation.navigate("ResultEssayScreen");
        router.push("ResultEssayScreen");
      });
  };

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
      handleSubmit();
    }
  }, [time]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`h-full flex-2`}>
        {isShowModal && (
          <ModalConfirm
            isShowModal={isShowModal}
            setIsShowModal={setIsShowModal}
            handleConfirm={async () => {
              console.log("submit");
              await handleSubmit();
            }}
            contentModal={"Are you sure you want to submit the answer?"}
          />
        )}
        <View>
          <View
            style={tw`w-full pl-1 pr-8 flex-row items-center justify-between`}
          >
            <View style={tw`flex-row items-center`}>
              <IconButton
                icon="chevron-left"
                size={35}
                onPress={() => {
                  // navigation.goBack();
                  router.back();
                }}
                // style={tw`bg-white`}
              ></IconButton>
              <Text style={tw`text-lg font-bold`}>{essayCurrent.title}</Text>
            </View>
            <View>
              <Text style={tw`text-lg font-bold`}>
                {time.minutes}:{time.seconds < 10 ? "0" : ""}
                {time.seconds}
              </Text>
            </View>
          </View>

          <View style={tw`px-8 mb-2`}>
            <Progress.Bar progress={progress} width={null} color={color} />
          </View>
          <Text style={tw`text-xl font-bold text-zinc-500 text-center`}>
            Đề bài
          </Text>
          <View style={tw`items-center px-6`}>
            <RenderHtml
              contentWidth={100}
              source={{
                html: essayCurrent.content,
              }}
            />
          </View>
        </View>
        <ScrollView style={tw`flex-3`}>
          <View style={tw`px-8`}>
            <TextInput
              editable
              multiline
              numberOfLines={15}
              // maxLength={40}
              style={tw`border-2 border-slate-200 rounded-lg p-3 mb-4 min-h-60`}
              onChangeText={setAnswer}
              value={answer}
              placeholder="Your answer here..."
              keyboardType="default"
            />
            <TouchableOpacity
              style={tw`bg-zinc-500 rounded-lg p-3 mb-4`}
              onPress={pickFile}
            >
              <Text style={tw`text-lg font-bold text-center text-white`}>
                Upload Image Answer
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={tw`bg-zinc-800 rounded-lg p-3 mb-4 mx-8`}
            onPress={() => setIsShowModal(true)}
          >
            <Text style={tw`text-lg font-bold text-center text-white`}>
              Submit
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
