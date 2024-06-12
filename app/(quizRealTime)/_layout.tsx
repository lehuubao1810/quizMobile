import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const QuizRealTimeLayout = () => {

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: "#fff",
            paddingTop: 35
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

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default QuizRealTimeLayout;
