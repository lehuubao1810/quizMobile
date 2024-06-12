import Loader from "@/components/common/Loader";
import { useAppSelector } from "@/redux/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const EssayLayout = () => {
  const { loading } = useAppSelector((state) => state.essaysState);

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
          name="EssayScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResultEssayScreen"
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

export default EssayLayout;
