import { ActivityIndicator } from "react-native-paper";
import tw from "twrnc";

type Props = {
  //
};

export const LoadingBtn = (props: Props) => {
  return (
    <ActivityIndicator animating={true} color="#27272a" style={tw`top-3`} />
  );
};
