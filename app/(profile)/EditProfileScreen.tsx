import { SafeAreaView, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { IconButton, Text } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import InputSection from "../../components/auth/InputSection";
import { regPhone } from "../../utils/validate";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { getData } from "../../utils/asyncStoreage";
import {
  changeAvatar,
  fetchUserByToken,
  updateProfile,
} from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import { EditAvatar } from "../../components/profile/EditAvatar";
import dayjs from "dayjs";
import { router } from "expo-router";
import { DatePicker } from "@/components/profile/DatePicker";
import { showToast } from "@/utils/toast";
import { BtnBack } from "@/components/common/BtnBack";
import { ThemedText } from "@/components/default/ThemedText";
import { ThemedBtn } from "@/components/default/ThemedBtn";

type FormData = {
  first_name: string;
  last_name: string;
  phone_number: string;
  username?: string;
};

export default function EditProfileScreen() {
  const { loading, user, error } = useAppSelector((state) => state.authReducer);

  const dispatch = useAppDispatch();

  const [birthday, setBirthday] = useState(user?.birthday ?? new Date());

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    phone_number: Yup.string()
      .required("Phone number is required")
      .matches(regPhone, "Phone number is invalid"),
    username: Yup.string(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      first_name: user?.name.first_name,
      last_name: user?.name.last_name,
      phone_number: user?.phone_number,
      username: user?.username,
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const accessToken = await getData<string>("@accessToken");
    const apiData = {
      accessToken,
      ...data,
      phone_number: data.phone_number,
      birthday: birthday,
    };

    console.log("apiData", apiData);

    dispatch(updateProfile(apiData))
      .unwrap()
      .then(async () => {
        await dispatch(fetchUserByToken(accessToken ?? ""));
        showToast("success", "Profile updated successfully");
        // navigation.navigate("TabNavigator", { screen: "ProfileScreen" });
        // router.push("/ProfileScreen");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // Select image from library or camera
  const selectImage = async (useLibrary: boolean) => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    // Save image if not cancelled
    if (!result.canceled) {
      dispatch(changeAvatar(result.assets[0].uri)).unwrap();
    }
  };

  const navigateBack = () => {
    // navigation.goBack();
    router.back();
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`w-full pl-1 flex-row items-center`}>
        <BtnBack />
        <ThemedText style={tw`text-lg font-bold`}>Edit Profile</ThemedText>
      </View>
      <View style={tw`flex items-center h-full px-8`}>
        <EditAvatar selectImage={selectImage} />

        <View style={tw`flex-row w-full gap-4 justify-between`}>
          <Controller
            name="first_name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputSection
                onChangeText={onChange}
                value={value}
                error={
                  errors.first_name ? errors.first_name?.message : undefined
                }
                style={tw`w-[45%]`}
                icon="account"
                placeholder="First Name"
              />
            )}
          ></Controller>
          <Controller
            name="last_name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputSection
                onChangeText={onChange}
                value={value}
                error={errors.last_name ? errors.last_name?.message : undefined}
                style={tw`w-[45%]`}
                icon="account"
                placeholder="Last Name"
              />
            )}
          ></Controller>
        </View>
        <Controller
          name="phone_number"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSection
              onChangeText={onChange}
              value={value}
              error={
                errors.phone_number ? errors.phone_number?.message : undefined
              }
              style={tw`w-full`}
              icon="phone"
              placeholder={"Phone Number"}
            />
          )}
        ></Controller>
        <Controller
          name="username"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSection
              onChangeText={onChange}
              value={value}
              error={errors.username ? errors.username?.message : undefined}
              style={tw`w-full`}
              icon="account"
              placeholder={"Username"}
            />
          )}
        ></Controller>
        {birthday && <DatePicker date={birthday} setDate={setBirthday} />}

        {/* <View style={tw``}></View> */}
        {error && (
          <Text style={tw`text-red-500 text-sm font-bold text-center mt-4`}>
            {error}
          </Text>
        )}
        <ThemedBtn
          style={tw`bg-zinc-800 p-4 rounded-lg w-full items-center mt-4`}
          onPress={onSubmit}
        >
          <Text style={tw`text-white font-bold text-base`}>Confirm</Text>
        </ThemedBtn>
      </View>
    </SafeAreaView>
  );
}
