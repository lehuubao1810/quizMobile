import Loader from "@/components/common/Loader";
import { useAppSelector } from "@/redux/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const CourseLayout = () => {
  const { loading } = useAppSelector((state) => state.coursesState);

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
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default CourseLayout;
