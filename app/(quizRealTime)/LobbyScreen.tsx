import { Image, Text, View } from "react-native";
import tw from "twrnc";

import { useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { socket } from "../../constants/socket";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/default/ThemedText";

const LobbyScreen = () => {
  const { user } = useAppSelector((state) => state.authReducer);

  const { roomId } = useLocalSearchParams() as { roomId: string };

  useEffect(() => {
    console.log("lobby");
    socket.on("countdown", (countdown) => {
      console.log("countdown lb", countdown);
      if (countdown) {
        // navigation.navigate("QuizTestScreen", { roomId });
        router.replace({
          pathname: "QuizTestScreen",
          params: { roomId },
        });
      }
    });
    return () => {
      socket.off("countdown");
    };
  }, []);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`px-6 items-center`}>
        <ThemedText style={tw`text-xl font-bold mb-4`}>Lobby</ThemedText>
        <View style={tw`mb-6`}>
          <Image
            source={
                user?.avatar
                  ? { uri: user.avatar }
                  :
              require("../../assets/images/avatardefault.png")
            }
            style={tw`w-24 h-24 mx-auto my-2 rounded-full`}
          />
          <ThemedText style={tw`text-center font-bold uppercase text-lg`}>
            {`${user?.name.first_name} ${user?.name.last_name}` || "No name"}
          </ThemedText>
        </View>
        <ThemedText style={tw`text-center font-bold text-base`}>
          You are in! {"\n"}See your nickname on screen?
        </ThemedText>
      </View>
    </SafeAreaView>
  );
};

export default LobbyScreen;
