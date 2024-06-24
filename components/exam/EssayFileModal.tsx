import { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Icon, IconButton } from "react-native-paper";
import tw from "twrnc";
import { ThemedCard } from "../default/ThemedCard";
import { ThemedText } from "../default/ThemedText";
import { ThemedView } from "../default/ThemedView";
import { Colors } from "@/constants/Colors";

type Props = {
  isShowModal: boolean;
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  contentModal?: string[];
  setContetModal?: React.Dispatch<React.SetStateAction<string>>;
  isUploadFile?: boolean;
};

type OpenURLButtonProps = {
  url: string;
  children: string;
};

export const EssayFileModal: React.FC<Props> = ({
  isShowModal,
  setIsShowModal,
  contentModal,
  setContetModal,
  isUploadFile,
}: Props) => {
  const [files, setFiles] = useState<string[]>(contentModal ?? []);

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

    const colorScheme = useColorScheme();

    return (
      <ThemedCard
        style={tw`flex-row items-center gap-2 p-2 py-3 border border-slate-200 rounded-lg w-full`}
        onPress={() => {
          if (isUploadFile) {
            return;
          } else {
            handlePress();
          }
        }}
      >
        <Icon
          source={"file"}
          size={28}
          color={`${Colors[colorScheme ?? "light"].text}`}
        />
        <ThemedText style={tw`text-lg`} numberOfLines={1}>
          {url}
        </ThemedText>
        {isUploadFile && (
          <View style={tw`absolute right-0`}>
            <IconButton
              icon={"delete"}
              size={20}
              iconColor={`red`}
              onPress={() => {
                if (setContetModal) {
                  setContetModal("");
                  setFiles((prev) => prev.filter((item) => item !== url));
                }
              }}
            />
          </View>
        )}
      </ThemedCard>
    );
  };

  return (
    <View
      style={tw`absolute w-full h-full bg-slate-400/50 items-center justify-center z-50`}
      onTouchStart={() => setIsShowModal(false)}
    >
      <ThemedView
        style={tw`w-80 min-h-40 rounded-lg py-6 px-4 justify-between`}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
      >
        <ThemedText style={tw`text-lg font-bold text-center`}>
          List of files
        </ThemedText>
        {files && files?.length > 0 ? (
          <View style={tw`flex-row gap-4`}>
            {files?.map((item, index) => (
              <OpenURLButton key={index} url={item} children={item} />
            ))}
          </View>
        ) : (
          <ThemedText style={tw`text-center`}>No files</ThemedText>
        )}
      </ThemedView>
    </View>
  );
};
