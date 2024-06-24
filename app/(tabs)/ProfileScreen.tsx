import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import tw from "twrnc";
import { Icon, Text } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ThemedText } from "@/components/default/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedCard } from "@/components/default/ThemedCard";
import { ThemedBtn } from "@/components/default/ThemedBtn";
import { SwitchTheme } from "@/components/profile/SwitchTheme";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state) => state.authReducer);

  const birthday = user?.birthday ?? new Date();
  console.log("birthday", birthday);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        router.replace("/LoginScreen");
      });
  };

  const colorScheme = useColorScheme();

  const backgroundColorSlideAnimation = useAnimatedStyle(() => {
    return {
      backgroundColor:
        colorScheme === "dark"
          ? withTiming(`${Colors.dark.background}`)
          : withTiming(`${Colors.light.background}`),
    };
  });

  const cardColorSlideAnimation = useAnimatedStyle(() => {
    return {
      backgroundColor:
        colorScheme === "dark"
          ? withTiming(`${Colors.dark.card}`)
          : withTiming(`${Colors.light.card}`),
    };
  });

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Animated.View style={[tw`flex-1`, backgroundColorSlideAnimation]}>
        <ScrollView style={tw`pt-[45px]`}>
          <ThemedText style={tw`text-center text-xl font-bold`}>
            Profile
          </ThemedText>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("../../assets/images/avatardefault.png")
            }
            style={tw`w-28 h-28 mx-auto my-2 rounded-full`}
          />

          <ThemedText style={tw`text-center text-lg font-bold mb-2`}>
            {user?.name.first_name
              ? `${user?.name.first_name} ${user?.name.last_name}`
              : "User Name"}
          </ThemedText>

          <View style={tw`p-8 ios:p-10 h-full`}>
            <Animated.View
              style={[
                tw`bg-[${
                  Colors[colorScheme ?? "light"].card
                }] p-2 rounded-lg shadow-md`,
                cardColorSlideAnimation,
              ]}
            >
              <View
                style={tw`flex-row justify-between p-3 border-b-2 border-slate-200/50`}
              >
                <ThemedText style={tw`font-bold text-sm`}>Email</ThemedText>
                <Text style={tw`text-gray-400 font-bold`}>{user?.email}</Text>
              </View>
              <View
                style={tw`flex-row justify-between p-3 border-b-2 border-slate-200/50`}
              >
                <ThemedText style={tw`font-bold text-sm`}>Phone</ThemedText>
                <Text style={tw`text-gray-400 font-bold`}>
                  {user?.phone_number || ""}
                </Text>
              </View>
              <View style={tw`flex-row justify-between p-3`}>
                <ThemedText style={tw`font-bold text-sm`}>Birthday</ThemedText>
                <Text style={tw`text-gray-400 font-bold`}>
                  <Text style={tw`text-gray-400 font-bold`}>
                    {dayjs(birthday).format("DD/MM/YYYY")}
                  </Text>
                </Text>
              </View>
              {/* <View style={tw`flex-row justify-between p-2`}>
              <Text style={tw`font-bold `}>Code account</Text>
              <Text style={tw`text-gray-400 font-bold`}>{user?.id}</Text>
            </View> */}
            </Animated.View>
            <View style={tw`flex-row items-center justify-between px-4 mt-3`}>
              <ThemedText style={tw`font-bold text-sm`}>Theme</ThemedText>
              <SwitchTheme />
            </View>
            <Animated.View
              style={[
                tw`mt-3 bg-[${
                  Colors[colorScheme ?? "light"].card
                }] p-2 rounded-lg shadow-md`,
                cardColorSlideAnimation,
              ]}
            >
              <TouchableOpacity
                style={tw`flex-row gap-4 border-b-2 border-slate-200/50 items-center p-2`}
                onPress={() => router.push("EditProfileScreen")}
              >
                <Icon
                  source="pencil-circle"
                  size={30}
                  color={`${Colors[colorScheme ?? "light"].btn}`}
                />
                <ThemedText style={tw`font-bold text-sm`}>
                  Edit profile
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-row gap-4 items-center p-2`}
                onPress={() => router.push("ChangePasswordScreen")}
              >
                <Icon
                  source="lock"
                  size={30}
                  color={`${Colors[colorScheme ?? "light"].btn}`}
                />
                <ThemedText style={tw`font-bold text-sm`}>
                  Change password
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
            {loading ? (
              <LoadingBtn style="mt-4" />
            ) : (
              <ThemedBtn
                style={tw`bg-zinc-800	 py-3 mt-4 ios:mt-10 rounded-md`}
                onPress={handleLogout}
              >
                <Text style={tw`text-white text-center text-base font-bold`}>
                  LOG OUT
                </Text>
              </ThemedBtn>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
