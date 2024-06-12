import { Redirect, router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Loader from "@/components/common/Loader";
import { useAppSelector } from "@/redux/hooks";


const StatLayout = () => {
  const { loading } = useAppSelector(
    (state) => state.statState
  );

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
          name="DetailStatScreen"
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

export default StatLayout;
