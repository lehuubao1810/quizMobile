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
import { ThemedText } from "@/components/default/ThemedText";
import { ThemedCard } from "@/components/default/ThemedCard";
import { ThemedBtn } from "@/components/default/ThemedBtn";

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
    dispatch(clearError());
    router.push("RegisterScreen");
  }, []);

  const navigateForgotPassword = useCallback(() => {
    dispatch(clearError());
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
      <View style={tw`flex items-center h-full px-8 pt-10`}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={tw`w-40 h-40`}
          resizeMode="contain"
        />
        <ThemedText style={tw`text-2xl font-bold text-left mb-4 w-full`}>
          Login
        </ThemedText>
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
              minLength: 8,
            }}
            render={({ field: { onChange, value } }) => (
              <InputSection
                value={value}
                error={
                  errors.password
                    ? "Password must be at least 8 characters"
                    : undefined
                }
                style={tw`mb-2 w-full`}
                onChangeText={onChange}
                icon="lock"
                placeholder={"Password"}
                isCanSecureText={true}
              />
            )}
          />
          {/* <Pressable> */}

          <TouchableOpacity
            onPress={!loading ? navigateForgotPassword : () => {}}
          >
            <ThemedText style={tw`w-full text-right mb-4 text-sm font-bold`}>
              Forgot password?
            </ThemedText>
          </TouchableOpacity>
        </View>
        {/* </Pressable> */}
        <View style={tw`w-full mt-4`}>
          {errorText}
          {loading ? (
            <LoadingBtn />
          ) : (
            <ThemedBtn
              style={tw`bg-zinc-800 p-3 rounded-lg w-full items-center`}
              onPress={() => onSubmit()}
            >
              <Text style={tw`text-white font-bold text-base text-center`}>
                LOGIN
              </Text>
            </ThemedBtn>
          )}
          <View style={tw`flex-row justify-center mt-2`}>
            <ThemedText style={tw`text-base mr-1`}>
              Don't have an account?
            </ThemedText>
            <TouchableOpacity onPress={!loading ? navigateRegister : () => {}}>
              <ThemedText style={tw`font-bold text-base`}>Register</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
