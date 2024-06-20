import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";
import { ThemedText } from "../default/ThemedText";

type Props = {
  data: { label: string; value: number }[];
  myScore: number;
};

export const Chart: React.FC<Props> = (props: Props) => {
  console.log("data", props);

  const labels = ["0", ...props.data.map((item) => item.label)];
  const maxValue = Math.max(...props.data.map((item) => item.value));

  const bgColorMyScore = (value: string) => {
    if (!props.myScore) {
      return "";
    }
    if (parseInt(value) === Math.ceil(props.myScore)) {
      return "bg-[#00CFE8]";
    } else {
      return "bg-white";
    }
  };

  return (
    <View style={tw`w-full px-2`}>
      <View
        style={tw`flex-row justify-center border-b-2 border-slate-500 items-end h-80`}
      >
        {props.data.map((item, index) => {
          return (
            <View style={tw``} key={index}>
              <ThemedText style={tw`text-xs font-bold text-center`}>
                {item.value === 0 ? "" : item.value}
              </ThemedText>
              <View
                style={tw`w-7 h-[${Math.floor(
                  (item.value / maxValue) * 100 // calculate height of bar
                )}%] rounded-t-lg border border-slate-300 border-b-0
                    ${bgColorMyScore(item.label)}
                  `}
              ></View>
            </View>
          );
        })}
      </View>
      <View style={tw`flex-row`}>
        {labels.map((item, index) => {
          return (
            <ThemedText
              key={index}
              style={tw`w-6.8 text-xs font-bold text-center`}
            >
              {item}
            </ThemedText>
          );
        })}
      </View>
    </View>
  );
};
