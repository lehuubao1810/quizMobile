import { Redirect, router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Loader from "@/components/common/Loader";
import { useAppSelector } from "@/redux/hooks";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

const StatLayout = () => {
  const { loading } = useAppSelector((state) => state.statState);

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
          name="DetailStatScreen"
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

export default StatLayout;
