import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import tw from "twrnc";

import { StatusBox } from "../common/StatusBox";
import { ThemedBtn } from "../default/ThemedBtn";
import { ThemedText } from "../default/ThemedText";
import { ThemedCard } from "../default/ThemedCard";

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
    <ThemedCard
      style={tw`mr-6 rounded-lg p-3 shadow-md`}
      // activeOpacity={0.6}
      // underlayColor="#f8fafc"
      onPress={() => action(item._id)}
    >
      <View style={tw`items-center`}>
        <Image
          source={require("../../assets/images/quiz.png")}
          style={tw`w-42 h-42 rounded-lg`}
        />
        <View style={tw`w-full pl-1 py-2 gap-2`}>
          <ThemedText style={tw`font-bold text-base`}>{item.title}</ThemedText>
          {item.course_name && (
            <ThemedText style={tw`text-gray-500`}>{item.course_name}</ThemedText>
          )}
          {/* {item.status && (
            <View style={tw`flex-row`}>
              <StatusBox status={item.status} />
            </View>
          )} */}
          <ThemedText style={tw`text-sm`}>End: {time}</ThemedText>
        </View>
      </View>
    </ThemedCard>
  );
};
