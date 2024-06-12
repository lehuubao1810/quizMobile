import { SafeAreaView, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";

import { Controller, useForm } from "react-hook-form";
import InputSection from "../../components/auth/InputSection";
import { regPassword } from "../../utils/validate";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { clearError, resetPassword } from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

type FormData = {
  newPassword: string;
  confirmNewPassword: string;
};

export default function ResetPasswordScreen() {
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(
        regPassword,
        "Password must contain at least 1 letter and 1 number"
      ),
    confirmNewPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>(formOptions);

  const { otp, email } = useLocalSearchParams() as {
    otp: string;
    email: string;
  };

  const { loading, error } = useAppSelector((state) => state.authReducer);

  const dispatch = useAppDispatch();

  const onSubmit = handleSubmit((data) => {
    const apiData = {
      ...data,
      otp,
      email,
    };
    dispatch(resetPassword(apiData))
      .unwrap()
      .then(() => {
        router.push("LoginScreen");
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
        <IconButton
          icon="chevron-left"
          size={35}
          onPress={navigateBack}
          // style={tw`bg-white`}
        ></IconButton>
      </View>
      <View style={tw`flex items-center h-full px-8 `}>
        <Text style={tw`text-2xl font-bold text-left mb-4 w-full`}>
          Reset Password
        </Text>
        <Text style={tw`text-base text-left mb-4 w-full`}>
          Please enter your new password
        </Text>
        <Controller
          name="newPassword"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSection
              onChangeText={onChange}
              value={value}
              error={
                errors.newPassword ? errors.newPassword?.message : undefined
              }
              style={tw`mb-4 w-full`}
              icon="lock"
              placeholder="New Password"
              isCanSecureText={true}
            />
          )}
        ></Controller>
        <Controller
          name="confirmNewPassword"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSection
              onChangeText={onChange}
              value={value}
              error={
                errors.confirmNewPassword
                  ? errors.confirmNewPassword?.message
                  : undefined
              }
              style={tw`mb-4 w-full`}
              icon="lock"
              placeholder={"Confirm New Password"}
              isCanSecureText={true}
            />
          )}
        ></Controller>
        {error && (
          <Text style={tw`text-red-500 text-sm font-bold`}>{error}</Text>
        )}
        {loading ? (
          <LoadingBtn />
        ) : (
          <TouchableOpacity
            style={tw`bg-zinc-800 p-3 rounded-lg w-full items-center`}
            onPress={onSubmit}
          >
            <Text style={tw`text-white font-bold`}>Confirm</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
