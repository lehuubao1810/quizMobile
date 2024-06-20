import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { ThemedText } from "../default/ThemedText";
import { ThemedView } from "../default/ThemedView";
import { ThemedBtn } from "../default/ThemedBtn";


type Props = {
  isShowModal: boolean;
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => void;
  contentModal?: string;
};

export const ModalConfirm: React.FC<Props> = ({
  isShowModal,
  setIsShowModal,
  handleConfirm,
  contentModal,
}: Props) => {
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
        <ThemedText style={tw`text-lg font-bold text-center mb-8`}>
          {contentModal ? contentModal : "Are you sure about this?"}
        </ThemedText>
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            style={tw`bg-red-500 px-10 py-3 rounded-lg`}
            onPress={handleConfirm}
          >
            <Text style={tw`font-bold text-white`}>Yes</Text>
          </TouchableOpacity>
          <ThemedBtn
            style={tw`px-10 py-3 rounded-lg`}
            onPress={() => setIsShowModal(false)}
          >
            <Text style={tw`font-bold text-white`}>No</Text>
          </ThemedBtn>
        </View>
      </ThemedView>
    </View>
  );
};
