import {
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import tw from "twrnc";
import { Icon, IconButton, Text } from "react-native-paper";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as Progress from "react-native-progress";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import RenderHtml from "react-native-render-html";
import { getData } from "../../utils/asyncStoreage";
import {
  postAnswerEssay,
  updateAnswerEssay,
} from "../../redux/essay/essaySlice";
import { showToast } from "../../utils/toast";
import { ModalConfirm } from "../../components/common/ModalConfirm";
import { router } from "expo-router";
import { EssayFileModal } from "@/components/exam/EssayFileModal";
import { BtnBack } from "@/components/common/BtnBack";
import { ThemedText } from "@/components/default/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedBtn } from "@/components/default/ThemedBtn";
import { ThemedCard } from "@/components/default/ThemedCard";
import TextEditor from "@/components/exam/TextEditor";

export default function EssayScreen() {
  const dispatch = useAppDispatch();

  const { essayCurrent, essayAnswerCurrent } = useAppSelector(
    (state) => state.essaysState
  );

  const [answer, setAnswer] = useState(essayAnswerCurrent.content_answers);
  const [fileUriAnswer, setfileUriAnswer] = useState<string>(
    essayAnswerCurrent.file_upload[0]
  );

  const initialProgress =
    essayCurrent.total_time_left / (essayCurrent.total_time * 60);
  // console.log('remain', initialProgress);
  const [progress, setProgress] = useState(initialProgress);
  const [color, setColor] = useState("rgb(59 130 246)");
  const [time, setTime] = useState({
    minutes: Math.floor(essayCurrent?.total_time_left / 60) ?? 1,
    seconds: Math.floor(essayCurrent?.total_time_left % 60) ?? 0,
  });
  const total_time = time.minutes;

  useEffect(() => {
    console.log("essayCurrent", essayCurrent?.total_time_left / 60);
  }, [essayCurrent]);

  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowFileModal, setIsShowFileModal] = useState(false);

  const [mainContentFileModal, setMainContentFileModal] = useState<{
    contentModal: string[];
    setContetModal: React.Dispatch<React.SetStateAction<string>>;
    isUploadFile: boolean;
  }>({
    contentModal: [""],
    setContetModal: () => {},
    isUploadFile: false,
  });

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
    console.log("essay file", file.assets[0].uri);

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
      // console.log("remain", prevProgress - 1 / (total_time * 60));
      // console.log("sub", 1 / (total_time * 60));
      return prevProgress - 1 / (total_time * 60);
    });
  };

  // handle modal file
  const handleModalFile = (isUploadFile: boolean) => {
    setIsShowFileModal(true);
    if (isUploadFile) {
      setMainContentFileModal({
        contentModal: fileUriAnswer ? [fileUriAnswer] : [],
        setContetModal: setfileUriAnswer,
        isUploadFile,
      });
    } else {
      setMainContentFileModal({
        contentModal: essayCurrent.files ?? [""],
        setContetModal: () => {},
        isUploadFile,
      });
    }
  };

  // handle answer
  const handleSubmit = async () => {
    const accessToken = await getData<string>("@accessToken");
    console.log("accessToken", accessToken);
    dispatch(
      postAnswerEssay({
        answer,
        id: essayAnswerCurrent._id,
        accessToken,
        uri: fileUriAnswer,
      })
    )
      .unwrap()
      .then(() => {
        // navigation.navigate("ResultEssayScreen");
        router.push("ResultEssayScreen");
      })
      .catch((err) => {
        showToast("error", err.message);
      });
  };

  const handleUpdate = async () => {
    const accessToken = await getData<string>("@accessToken");
    console.log("accessToken", accessToken);
    // if fileUriAnswer is not start with "file" then it is a link, so we don't need to upload it
    const isLink = fileUriAnswer.startsWith("file");
    dispatch(
      updateAnswerEssay({
        answer,
        id: essayAnswerCurrent._id,
        accessToken,
        uri: isLink ? fileUriAnswer : "",
      })
    )
      .unwrap()
      .then(() => {
        // navigation.navigate("ResultEssayScreen");
        router.push("ResultEssayScreen");
      })
      .catch((err) => {
        showToast("error", err.message);
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
      return;
      // handleUpdate();
    }
    return () => {};
  }, [time]);

  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`h-full flex-2`}>
        {isShowModal && (
          <ModalConfirm
            isShowModal={isShowModal}
            setIsShowModal={setIsShowModal}
            handleConfirm={async () => {
              // if (essayCurrent?.isFirst) {
              //   await handleSubmit();
              // } else {
              //   await handleUpdate();
              // }
              await handleUpdate();
              // await handleSubmit();
            }}
            contentModal={"Are you sure you want to submit the answer?"}
          />
        )}
        {isShowFileModal && (
          <EssayFileModal
            isShowModal={isShowFileModal}
            setIsShowModal={setIsShowFileModal}
            contentModal={mainContentFileModal.contentModal}
            setContetModal={mainContentFileModal.setContetModal}
            isUploadFile={mainContentFileModal.isUploadFile}
          />
        )}
        <View>
          <View
            style={tw`w-full pl-1 pr-3 flex-row items-center justify-between`}
          >
            <View style={tw`flex-row items-center justify-between w-full`}>
              <BtnBack />
              <ThemedText style={tw`text-lg font-bold`}>
                {time.minutes}:{time.seconds < 10 ? "0" : ""}
                {time.seconds}
              </ThemedText>
              <IconButton
                icon="download"
                size={28}
                onPress={() => {
                  handleModalFile(false);
                }}
                iconColor={`${Colors[colorScheme ?? "light"].text}`}
              />
            </View>
          </View>

          <View style={tw`px-8 mb-2`}>
            <Progress.Bar progress={progress} width={null} color={color} />
          </View>
          <ThemedText style={tw`text-xl font-bold text-center`}>
            {essayCurrent.title}
          </ThemedText>
          <View style={tw`items-center px-6`}>
            <RenderHtml
              contentWidth={100}
              source={{
                html: essayCurrent.content,
              }}
              baseStyle={tw`text-[${Colors[colorScheme ?? "light"].text}]`}
            />
          </View>
        </View>
        <ScrollView style={tw`flex-3`}>
          <View style={tw`px-8`}>
            {/* <TextInput
              editable
              multiline
              numberOfLines={15}
              // maxLength={40}
              style={tw`border-2 border-slate-300 rounded-lg p-3 mb-4 min-h-60 bg-white`}
              onChangeText={setAnswer}
              value={answer}
              placeholder="Your answer here..."
              keyboardType="default"
            /> */}
            <TextEditor html={answer} setAnswer={setAnswer} />
            <View style={tw`flex-row justify-between`}>
              <ThemedCard
                style={tw`shadow-md rounded-full mb-4 w-14 h-14 items-center justify-center`}
                onPress={pickFile}
              >
                <Icon
                  source="upload"
                  size={28}
                  color={`${Colors[colorScheme ?? "light"].text}`}
                />
              </ThemedCard>
              <ThemedCard
                style={tw`shadow-md rounded-lg mb-4 flex-row items-center justify-between px-4 gap-2
                  ${
                    fileUriAnswer
                      ? `bg-[${Colors[colorScheme ?? "light"].btn}]`
                      : `bg-[${Colors[colorScheme ?? "light"].card}]`
                  }
                  `}
                onPress={() => {
                  handleModalFile(true);
                }}
              >
                <Icon
                  source="file"
                  size={28}
                  color={`${
                    fileUriAnswer
                      ? `#fff`
                      : `${Colors[colorScheme ?? "light"].text}`
                  }`}
                />
                <ThemedText style={tw`${fileUriAnswer ? `text-white` : ``}`}>
                  File upload preview
                </ThemedText>
              </ThemedCard>
            </View>
          </View>
          <ThemedBtn
            style={tw`rounded-lg p-3 mb-4 mx-8`}
            onPress={() => setIsShowModal(true)}
          >
            <Text style={tw`text-lg text-white font-bold text-center`}>
              {/* {essayCurrent?.isFirst ? "Submit" : "Update"} */}
              Submit
            </Text>
          </ThemedBtn>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
