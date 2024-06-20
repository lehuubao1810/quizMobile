import Loader from "@/components/common/Loader";
import { Colors } from "@/constants/Colors";
import { useAppSelector } from "@/redux/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

const EssayLayout = () => {
  const { loading } = useAppSelector((state) => state.essaysState);

  const colorScheme = useColorScheme();

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            // backgroundColor: "#fff",
            paddingTop: 32,
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
      <StatusBar
        backgroundColor={`${Colors[colorScheme ?? "light"].background}`}
        style={`${colorScheme === "dark" ? "light" : "dark"}`}
      />
    </>
  );
};

export default EssayLayout;
