import { Redirect, router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Loader from "@/components/common/Loader";
import { useAppSelector } from "@/redux/hooks";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "LoginScreen",
};

const AuthLayout = () => {
  const { loading, user, isAuth } = useAppSelector(
    (state) => state.authReducer
  );

  const colorScheme = useColorScheme();

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            // backgroundColor: "#fff",
          },
        }}
      >
        <Stack.Screen
          name="LoginScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RegisterScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="VerificationOtpScreen"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar
        backgroundColor={`${Colors[colorScheme ?? "light"].background}`}
        style={`${colorScheme === "dark" ? "light" : "dark"}`}
      />
    </>
  );
};

export default AuthLayout;
