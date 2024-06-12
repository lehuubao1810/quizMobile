import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import tw from "twrnc";
import { IconButton } from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getData } from "../../utils/asyncStoreage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { changeAvatar, fetchUserByToken } from "../../redux/auth/authSlice";

type Props = {
  selectImage: (useLibrary: boolean) => Promise<void>
};

export const EditAvatar: React.FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.authReducer);


  return (
    <View>
      <Image
        source={
          user?.avatar 
            ? { uri: user.avatar }
            : require("../../assets/images/avatardefault.png")
        }
        style={tw`w-28 h-28 mx-auto mt-2 mb-6 rounded-full`}
      />
      <IconButton
        icon="pencil"
        size={20}
        style={tw`absolute right-0 bottom-6 bg-slate-600 rounded-full`}
        iconColor="white"
        onPress={() => props.selectImage(true)}
      />
    </View>
  );
};
