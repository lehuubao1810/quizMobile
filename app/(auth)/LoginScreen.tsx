import { View, Image, TouchableOpacity, Text } from "react-native";
import tw from "twrnc";

import { useForm, Controller } from "react-hook-form";
import { regEmail, regPassword } from "../../utils/validate";
import InputSection from "../../components/auth/InputSection";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useCallback, useEffect, useMemo } from "react";
import {
  clearError,
  fetchUserByToken,
  login,
} from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getData } from "@/utils/asyncStoreage";

type FormData = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "lehuubao2909@gmail.com",
      password: "Bao1234@",
    },
  });

  const { loading, user, error, isAuth } = useAppSelector(
    (state) => state.authReducer
  );

  const dispatch = useAppDispatch();

  // Will navigate to HomeScreen when have user
  useEffect(() => {
    if (isAuth) {
      router.replace("/HomeScreen");
    }
  }, [isAuth]);

  // Navigation
  const navigation = useNavigation();

  // Effect
  useEffect(() => {
    navigation.addListener("beforeRemove", (event) => {
      dispatch(clearError());
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = await getData<string>("@accessToken");
      console.log("accessToken", accessToken);
      await dispatch(fetchUserByToken(accessToken ?? "")).catch((error) => {
        if (!accessToken) {
          dispatch(clearError());
        }
      });
    };
    fetchUser();
  }, []);

  const onSubmit = handleSubmit((data) => {
    dispatch(login(data));
  });

  const navigateRegister = useCallback(() => {
    router.push("RegisterScreen");
  }, []);

  const navigateForgotPassword = useCallback(() => {
    router.push("ForgotPasswordScreen");
  }, []);

  const errorText = useMemo(() => {
    if (error) {
      return (
        <View style={tw`mb-2`}>
          <Text style={tw`text-red-500 text-sm font-bold text-center`}>
            {error}
          </Text>
        </View>
      );
    }
    return null;
  }, [error]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex items-center h-full px-8 pt-10 bg-white`}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={tw`w-40 h-40`}
          resizeMode="contain"
        />
        <Text style={tw`text-2xl font-bold text-left mb-4 w-full`}>Login</Text>
        <View style={tw`w-full`}>
          <Controller
            name="email"
            control={control}
            rules={{ required: true, pattern: regEmail }}
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
          <Controller
            name="password"
            control={control}
            rules={{
              required: true,
              pattern: regPassword,
            }}
            render={({ field: { onChange, value } }) => (
              <InputSection
                value={value}
                error={errors.password ? "Password is invalid" : undefined}
                style={tw`mb-2 w-full`}
                onChangeText={onChange}
                icon="lock"
                placeholder={"Password"}
                isCanSecureText={true}
              />
            )}
          />
          {/* <Pressable> */}
          <Text
            onPress={navigateForgotPassword}
            style={tw`w-full text-right mb-4`}
          >
            Forgot password?
          </Text>
        </View>
        {/* </Pressable> */}
        <View style={tw`w-full mt-4`}>
          {errorText}
          {loading ? (
            <LoadingBtn />
          ) : (
            <TouchableOpacity
              style={tw`bg-zinc-800 p-3 rounded-lg w-full items-center`}
              onPress={() => onSubmit()}
            >
              <Text style={tw`text-white font-bold text-base text-center`}>
                LOGIN
              </Text>
            </TouchableOpacity>
          )}
          <View style={tw`flex-row justify-center mt-2`}>
            <Text style={tw`text-base`}>Don't have an account?</Text>
            <TouchableOpacity onPress={navigateRegister}>
              <Text style={tw`text-zinc-800 font-bold text-base`}>
                {" "}
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
