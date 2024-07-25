import {
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import tw from "twrnc";
import { OtpInput } from "react-native-otp-entry";
import { IconButton, Text } from "react-native-paper";

import { useEffect, useState } from "react";
import { clearError, sendOTP, verifyOTP } from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { BtnBack } from "@/components/common/BtnBack";
import { ThemedText } from "@/components/default/ThemedText";
import { Colors } from "@/constants/Colors";
import { showToast } from "@/utils/toast";

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
        dispatch(clearError());
        router.push({
          pathname: "ResetPasswordScreen",
          params: { otp, email },
        });
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

  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`w-full pl-1 pt-[35px]`}>
        <BtnBack />
      </View>
      <View style={tw`px-8`}>
        <ThemedText style={tw`text-2xl font-bold text-left mb-4 w-full`}>
          Verification OTP
        </ThemedText>
        <ThemedText style={tw`text-base text-left mb-4 w-full`}>
          We've sent a verification code to{" "}
          <ThemedText style={tw`font-bold text-zinc-400`}>
            {String(email)}
          </ThemedText>
          . Please enter it
        </ThemedText>
        <OtpInput
          numberOfDigits={6}
          focusColor={`${Colors[colorScheme ?? "light"].btn}`}
          onFilled={(otp) => {
            handleVerifyOTP(otp);
          }}
          theme={{
            pinCodeTextStyle: tw`text-[${
              Colors[colorScheme ?? "light"].text
            }] font-bold`,
          }}
        />
        {error && (
          <Text style={tw`text-red-500 text-sm font-bold text-center mt-2`}>{error}</Text>
        )}
        <View style={tw`justify-center mt-4 w-full flex-row`}>
          {loading ? (
            <LoadingBtn />
          ) : time?.getSeconds() === 0 ? (
            <TouchableOpacity onPress={resendOTP}>
              <ThemedText style={tw`text-base`}>Resend OTP</ThemedText>
            </TouchableOpacity>
          ) : (
            <>
              <ThemedText style={tw`text-base`}>Resend OTP in </ThemedText>
              <ThemedText style={tw`text-base font-bold`}>
                {time?.getSeconds()} s
              </ThemedText>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
