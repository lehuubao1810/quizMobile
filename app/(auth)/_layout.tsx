import { Redirect, router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Loader from "@/components/common/Loader";
import { useAppSelector } from "@/redux/hooks";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "LoginScreen",
};

const AuthLayout = () => {
  const { loading, user, isAuth } = useAppSelector(
    (state) => state.authReducer
  );

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: "#fff",
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
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
