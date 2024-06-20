import {
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from "react-native";
import tw from "twrnc";
import { Text } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { router } from "expo-router";
import { useState } from "react";
import { socket } from "@/constants/socket";
import { ThemedText } from "@/components/default/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedCard } from "@/components/default/ThemedCard";
import { ThemedBtn } from "@/components/default/ThemedBtn";

export default function QuizRealTimeScreen() {
  const dispatch = useAppDispatch();

  const [roomId, setRoomId] = useState("");

  const { user } = useAppSelector((state) => state.authReducer);

  const [error, setError] = useState("");

  const handleJoinRoom = () => {
    if (roomId.trim() === "") {
      setError("Game PIN is required");
      return;
    }
    socket.emit("joinRoom", {
      roomId,
      userName: `${user?.name.first_name} ${user?.name.last_name}`,
    });
    console.log("roomId", roomId);
    console.log("user", `${user?.name.first_name} ${user?.name.last_name}`);
    console.log("socket", socket.id);
    // navigation.navigate("LobbyScreen", { roomId });
    router.push({
      pathname: "LobbyScreen",
      params: { roomId },
    });
    // router.push({
    //   pathname: "QuizTestScreen",
    //   params: { roomId },
    // });
  };

  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`px-6 items-center flex-1 pt-[45px]`}>
        {/* QuizRealTimeScreen */}
        <ThemedText style={tw`text-xl font-bold mb-4`}>Quiz</ThemedText>
        <TextInput
          style={tw`border-2 border-slate-300 p-2 w-full mb-4 rounded-lg font-bold text-center bg-white text-[${
            Colors[colorScheme ?? "light"].btn
          }]`}
          placeholder="Game PIN"
          value={roomId}
          onChangeText={(text) => setRoomId(text)}
          keyboardType="number-pad"
          placeholderTextColor={`${Colors[colorScheme ?? "light"].input}`}
        />
        {/* {errorText} */}
        <ThemedBtn
          style={tw`bg-zinc-800 p-4 rounded-lg w-full`}
          onPress={handleJoinRoom}
        >
          <Text style={tw`text-white text-center font-bold uppercase`}>
            Join
          </Text>
        </ThemedBtn>
      </View>
    </SafeAreaView>
  );
}
