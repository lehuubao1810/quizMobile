import Loader from "@/components/common/Loader";
import { useAppSelector } from "@/redux/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const QuizLayout = () => {
  const { loading } = useAppSelector((state) => state.quizsState);

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
          name="QuizScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResultQuizScreen"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default QuizLayout;
