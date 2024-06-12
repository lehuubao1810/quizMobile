import { SafeAreaView, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { OtpInput } from "react-native-otp-entry";
import { IconButton, Text } from "react-native-paper";

import { useEffect, useState } from "react";
import { clearError, sendOTP, verifyOTP } from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function VerificationOtpScreen() {
  const { email } = useLocalSearchParams() as { email: string };

  const navigateBack = () => {
    router.back();
  };

  const [time, setTime] = useState<Date | null>(new Date(30 * 1000)); // 30 seconds

  const { loading, error } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === null || prevTime.getTime() === 0) {
          return new Date(0);
        }
        return new Date(prevTime.getTime() - 1000);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resendOTP = () => {
    dispatch(sendOTP(email))
      .unwrap()
      .then(() => {
        console.log("Resend OTP success");
        setTime(new Date(30 * 1000));
      });
  };

  const handleVerifyOTP = (otp: string) => {
    dispatch(verifyOTP({ email, otp }))
      .unwrap()
      .then(() => {
        router.push({
          pathname: "ResetPasswordScreen",
          params: { otp, email },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Navigation
  const navigation = useNavigation();

  // Effect
  useEffect(() => {
    navigation.addListener("beforeRemove", (event) => {
      dispatch(clearError());
    });
  }, [navigation]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`w-full pl-1 pt-[35px]`}>
        <IconButton
          icon="chevron-left"
          size={35}
          onPress={navigateBack}
          // style={tw`bg-white`}
        ></IconButton>
      </View>
      <View style={tw`px-8`}>
        <Text style={tw`text-2xl font-bold text-left mb-4 w-full`}>
          Verification OTP
        </Text>
        <Text style={tw`text-base text-left mb-4 w-full`}>
          We've sent a verification code to{" "}
          <Text style={tw`font-bold text-zinc-500`}>{String(email)}</Text>.
          Please enter it
        </Text>
        <OtpInput
          numberOfDigits={6}
          focusColor={"#000"}
          onFilled={(otp) => {
            handleVerifyOTP(otp);
          }}
        />

        <View style={tw`justify-center mt-4 w-full flex-row`}>
          {loading ? (
            <LoadingBtn />
          ) : time?.getSeconds() === 0 ? (
            <TouchableOpacity onPress={resendOTP}>
              <Text style={tw`text-base text-zinc-800`}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={tw`text-base`}>Resend OTP in </Text>
              <Text style={tw`text-base text-zinc-800`}>
                {time?.getSeconds()} s
              </Text>
            </>
          )}
        </View>
        {error && (
          <Text style={tw`text-red-500 text-sm font-bold text-center mt-4`}>
            {error}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
