import Loader from "@/components/common/Loader";
import { Colors } from "@/constants/Colors";
import { useAppSelector } from "@/redux/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { useColorScheme } from "react-native";

const CourseLayout = () => {
  // const { loading } = useAppSelector((state) => state.coursesState);
  const quizsState = useAppSelector((state) => state.quizsState);
  const essayState = useAppSelector((state) => state.essaysState);
  const loading = useMemo(
    () => quizsState.loading || essayState.loading,
    [quizsState.loading, essayState.loading]
  );

  const colorScheme = useColorScheme();

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            paddingTop: 32,
          },
        }}
      >
        <Stack.Screen
          name="DetailCourseScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ListEssayScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ListQuizScreen"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar
        backgroundColor={`${Colors[colorScheme ?? "light"].background}`}
        style={`${colorScheme === "dark" ? "light" : "dark"}`}
      />
    </>
  );
};

export default CourseLayout;
