import { useAppSelector } from "@/redux/hooks";
import { getData, saveObject } from "@/utils/asyncStoreage";
import { Redirect, router } from "expo-router";
import { useEffect, useLayoutEffect } from "react";
import { Button, Text, View } from "react-native";
import tw from "twrnc";

export default function Index() {

  const {user} = useAppSelector((state) => state.authReducer);

  

  return (
    // <View style={tw`flex-1 justify-center items-center bg-white`}>
    //   <Button
    //     title="Go to Auth"
    //     onPress={() => {
    //       console.log("Go to Auth");
    //       router.replace("/LoginScreen");
    //     }}
    //   />
    // </View>
    <Redirect href="/LoginScreen" />
  );
}
