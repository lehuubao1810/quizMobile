import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";


type Props = {
  status: string;
};

const statusBgColor: { [key: string]: string } = {
  null: "bg-green-200/75",
  inactive: "bg-red-200/75",
  pending: "bg-yellow-200/75",
  completed: "bg-green-200/75",
  processing: "bg-yellow-200/75",
  // null: "bg-gray-200/75",
};

const statusTextColor: { [key: string]: string } = {
  null: "text-green-600",
  inactive: "text-red-600",
  pending: "text-yellow-600",
  completed: "text-green-600",
  processing: "text-yellow-600",
  // null: "text-gray-600",
};

export const StatusBox = (props: Props) => {
  return (
    <View
      style={tw`${statusBgColor[props.status]} rounded-lg px-4 py-1`}
    >
      <Text style={tw`${statusTextColor[props.status]} text-sm uppercase font-bold`}>
        {props.status === "null" ? "Active" : props.status}
      </Text>
    </View>
  );
};
