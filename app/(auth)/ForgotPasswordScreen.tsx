import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc";
import { IconButton } from "react-native-paper";

import { Controller, useForm } from "react-hook-form";
import InputSection from "../../components/auth/InputSection";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearError, sendOTP } from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ThemedCard } from "@/components/default/ThemedCard";
import { BtnBack } from "@/components/common/BtnBack";
import { ThemedText } from "@/components/default/ThemedText";
import { ThemedBtn } from "@/components/default/ThemedBtn";

type FormData = {
  email: string;
  password: string;
};

export default function ForgotPasswordScreen() {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "lehuubao2909@gmail.com",
    },
  });

  const { loading, error } = useAppSelector((state) => state.authReducer);

  const onSubmit = handleSubmit((data) => {
    dispatch(sendOTP(data.email))
      .unwrap()
      .then(() => {
        router.push({
          pathname: "VerificationOtpScreen",
          params: { email: data.email },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const navigateBack = () => {
    router.back();
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
        <BtnBack onPress={!loading ? navigateBack : () => {}} />
      </View>
      <View style={tw`flex items-center h-full px-8 `}>
        <ThemedText style={tw`text-2xl font-bold text-left mb-4 w-full`}>
          Forgot Password
        </ThemedText>
        <ThemedText style={tw`text-base text-left mb-4 w-full`}>
          Please enter your email address below and we'll send you a link to
          reset your password.
        </ThemedText>
        <Controller
          name="email"
          control={control}
          rules={
            {
              // required: true,
              // pattern: regEmail,
            }
          }
          render={({ field: { onChange, value } }) => (
            <InputSection
              onChangeText={onChange}
              value={value}
              error={errors.email ? "Email is invalid" : undefined}
              style={tw`mb-4 w-full`}
              icon="email"
              placeholder="abc@email.com"
            />
          )}
        ></Controller>
        {error && (
          <Text style={tw`text-red-500 text-sm font-bold`}>{error}</Text>
        )}
        {loading ? (
          <LoadingBtn />
        ) : (
          <ThemedBtn
            style={tw`bg-zinc-800 p-3 rounded-lg w-full items-center`}
            onPress={onSubmit}
          >
            <Text style={tw`text-white font-bold`}>Send Email</Text>
          </ThemedBtn>
        )}
      </View>
    </SafeAreaView>
  );
}
