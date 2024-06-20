import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

const QuizRealTimeLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            // backgroundColor: "#fff",
            paddingTop: 32
          },
        }}
      >
        <Stack.Screen
          name="LobbyScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="QuizTestScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResultScreen"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar
        backgroundColor={`${Colors[colorScheme ?? "light"].background}`}
        style={`${colorScheme === "dark" ? "light" : "dark"}`}
      />
    </>
  );
};

export default QuizRealTimeLayout;
