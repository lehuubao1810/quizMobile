import { ImageBackground, TouchableHighlight } from "react-native";
import tw from "twrnc";
import { Text, View, Image } from "react-native";

import { StatusBox } from "./StatusBox";

type Props = {
  item: {
    _id: string;
    name: string;
    icon: string;
    subline?: string;
    time?: string;
    status?: string;
    isCourse?: boolean;
  };
  action: (id: string, name: string) => void;
};

export const ListItem = ({ item, action }: Props) => {
  return (
    <ImageBackground resizeMode="contain">
      <TouchableHighlight
        style={tw`mb-4 rounded-xl bg-slate-100 p-4`}
        activeOpacity={0.6}
        underlayColor="#ccc"
        onPress={() => {
          action(item._id, item.name);
        }}
      >
        <>
          <View style={tw`flex-row w-full gap-6`}>
            <Image
              source={require("../../assets/images/quiz.png")}
              style={tw`w-16 h-16 rounded-full`}
            />
            <View style={tw`justify-center`}>
              <Text style={tw`font-bold text-lg`}>{item.name}</Text>
              {item.subline && (
                <Text style={tw`text-gray-500`}>{item.subline}</Text>
              )}
              {item.time && <Text style={tw`text-gray-500`}>{item.time}</Text>}
            </View>
          </View>
          {item.status && !item.isCourse ? (
            <View style={tw`flex-row justify-end mt-2`}>
              <StatusBox status={item.status} />
            </View>
          ) : null}
        </>
      </TouchableHighlight>
    </ImageBackground>
  );
};
