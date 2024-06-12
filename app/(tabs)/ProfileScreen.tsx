import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { Icon, Text } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/auth/authSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import dayjs from "dayjs";
import { router } from "expo-router";

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

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView style={tw`flex-1 bg-white pt-[45px]`}>
        <Text style={tw`text-center text-xl font-bold`}>Profile</Text>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : require("../../assets/images/avatardefault.png")
          }
          style={tw`w-28 h-28 mx-auto my-2 rounded-full`}
        />
        <Text style={tw`text-center text-lg font-bold mb-2`}>
          {user?.name.first_name
            ? `${user?.name.first_name} ${user?.name.last_name}`
            : "User Name"}
        </Text>
        <View style={tw`p-8 ios:p-10 rounded-t-3xl bg-slate-100 h-full`}>
          <View style={tw`bg-white p-2 rounded-lg`}>
            <View
              style={tw`flex-row justify-between p-2 border-b-2 border-slate-200`}
            >
              <Text style={tw`font-bold `}>Email</Text>
              <Text style={tw`text-gray-400 font-bold`}>{user?.email}</Text>
            </View>
            <View
              style={tw`flex-row justify-between p-2 border-b-2 border-slate-200`}
            >
              <Text style={tw`font-bold `}>Phone</Text>
              <Text style={tw`text-gray-400 font-bold`}>
                {user?.phone_number || ""}
              </Text>
            </View>
            <View
              style={tw`flex-row justify-between p-2 border-b-2 border-slate-200`}
            >
              <Text style={tw`font-bold `}>Birthday</Text>
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
          </View>
          <View style={tw`mt-4 bg-white p-2 rounded-lg`}>
            <TouchableOpacity
              style={tw`flex-row gap-4 border-b-2 border-slate-200 items-center p-1`}
              onPress={() => router.push("EditProfileScreen")}
            >
              <Icon source="pencil-circle" size={30} color="#ff9c6f" />
              <Text style={tw`font-bold`}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-row gap-4 items-center p-1`}
              onPress={() => router.push("ChangePasswordScreen")}
            >
              <Icon source="lock" size={30} color="#ff9c6f" />
              <Text style={tw`font-bold`}>Change password</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <LoadingBtn />
          ) : (
            <TouchableOpacity
              style={tw`bg-zinc-800	 py-3 mt-4 ios:mt-10 rounded-md`}
              onPress={handleLogout}
            >
              <Text style={tw`text-white text-center text-base font-bold`}>
                LOG OUT
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
