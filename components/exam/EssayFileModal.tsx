import { useCallback } from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";
import tw from "twrnc";

type Props = {
  isShowModal: boolean;
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  contentModal?: string[];
};

type OpenURLButtonProps = {
  url: string;
  children: string;
};

export const EssayFileModal: React.FC<Props> = ({
  isShowModal,
  setIsShowModal,
  contentModal,
}: Props) => {
  const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <TouchableOpacity
        style={tw`flex-row items-center gap-2 p-2 border border-slate-200 rounded-lg w-full`}
        onPress={handlePress}
      >
        <Icon source={"file"} size={28} />
        <Text style={tw`text-lg text-zinc-500`} numberOfLines={1}>
          {url}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={tw`absolute w-full h-full bg-slate-400/50 items-center justify-center z-50`}
      onTouchStart={() => setIsShowModal(false)}
    >
      <View
        style={tw`w-80 min-h-40 bg-white rounded-lg py-6 px-4 justify-between`}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
      >
        <Text style={tw`text-lg font-bold text-center`}>List of files</Text>
        <View style={tw`flex-row gap-4`}>
          {contentModal?.map((item, index) => (
            <OpenURLButton key={index} url={item} children={item} />
          ))}
        </View>
      </View>
    </View>
  );
};
