import { View, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";

import { useForm, Controller } from "react-hook-form";
import { regEmail, regPassword } from "../../utils/validate";
import InputSection from "../../components/auth/InputSection";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useCallback, useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { clearError, register } from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .matches(regEmail, "Email is invalid"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(
        regPassword,
        "Password must contain at least 1 letter and 1 number"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>(formOptions);

  const { loading, error } = useAppSelector((state) => state.authReducer);

  const dispatch = useAppDispatch();

  const onSubmit = handleSubmit((data) => {
    dispatch(register(data))
      .unwrap()
      .then(() => {
        router.push("LoginScreen");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const navigateLogin = useCallback(() => {
    router.push("LoginScreen");
  }, []);

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
      <View style={tw`bg-white`}>
        <View style={tw`w-full pl-1 `}>
          <IconButton
            icon="chevron-left"
            size={35}
            onPress={navigateBack}
            // style={tw`bg-white`}
          ></IconButton>
        </View>
        <View style={tw`flex items-center h-full px-8`}>
          <Text style={tw`text-2xl font-bold text-left mb-4 w-full`}>
            Register
          </Text>
          <View style={tw`flex items-center w-full`}>
            <Controller
              name="email"
              control={control}
              // rules={{ required: true, pattern: regEmail }}
              render={({ field: { onChange, value } }) => (
                <InputSection
                  onChangeText={onChange}
                  value={value}
                  error={errors.email ? errors.email?.message : undefined}
                  style={tw`mb-4 w-full`}
                  icon="email"
                  placeholder="abc@email.com"
                />
              )}
            ></Controller>
            <Controller
              name="password"
              control={control}
              // rules={{
              //   required: true,
              //   pattern: regPassword,
              // }}
              render={({ field: { onChange, value } }) => (
                <InputSection
                  value={value}
                  error={errors.password ? errors.password?.message : undefined}
                  onChangeText={onChange}
                  style={tw`mb-2 w-full`}
                  icon="lock"
                  placeholder={"Password"}
                  isCanSecureText={true}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              // rules={{
              //   required: true,
              // }}
              render={({ field: { onChange, value } }) => (
                <InputSection
                  value={value}
                  error={
                    errors.confirmPassword
                      ? errors.confirmPassword?.message
                      : undefined
                  }
                  onChangeText={onChange}
                  style={tw`mb-2 w-full`}
                  icon="lock"
                  placeholder={"Confirm Password"}
                  isCanSecureText={true}
                />
              )}
            />
            {error && (
              <Text style={tw`text-red-500 text-sm font-bold`}>{error}</Text>
            )}

            {loading ? (
              <LoadingBtn />
            ) : (
              <TouchableOpacity
                style={tw`bg-zinc-800 p-3 rounded-lg w-full items-center`}
                onPress={() => onSubmit()}
              >
                <Text style={tw`text-white font-bold text-base`}>REGISTER</Text>
              </TouchableOpacity>
            )}
            <View style={tw`flex-row mt-8`}>
              <Text style={tw`text-base`}>Already have an account?</Text>
              <TouchableOpacity onPress={navigateLogin}>
                <Text style={tw`text-zinc-800 font-bold text-base`}>
                  {" "}
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
