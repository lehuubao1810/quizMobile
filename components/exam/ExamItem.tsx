import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";

import { StatusBox } from "../common/StatusBox";

type Props = {
  item: {
    _id: string;
    title: string;
    course_name: string;
    // time_end: string;
    status?: string;
  };
  action: (id: string) => void;
  time: string;
};

export const ExamItem: React.FC<Props> = ({ item, action, time }: Props) => {
  return (
    <TouchableOpacity
      style={tw`bg-slate-100 mr-6 rounded-lg p-3`}
      onPress={() => action(item._id)}
    >
      <View style={tw`items-center`}>
        <Image
          source={require("../../assets/images/quiz.png")}
          style={tw`w-42 h-42 rounded-lg`}
        />
        <View style={tw`w-full pl-1 py-2 gap-2`}>
          <Text style={tw`font-bold text-base`}>{item.title}</Text>
          {item.course_name && (
            <Text style={tw`text-gray-500`}>{item.course_name}</Text>
          )}
          {item.status && (
            <View style={tw`flex-row`}>
              <StatusBox status={item.status} />
            </View>
          )}
          <Text>End: {time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
