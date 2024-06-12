import Loader from "@/components/common/Loader";
import { useAppSelector } from "@/redux/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ProfileLayout = () => {
  const { loading } = useAppSelector((state) => state.authReducer);

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
          name="ChangePasswordScreen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProfileScreen"
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

export default ProfileLayout;
