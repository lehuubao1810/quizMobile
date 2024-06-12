import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Text, View } from "react-native";


type Props = {
    title: string;
    active: boolean;
    onPress: () => void;
}

export const TabCategoryItem = (props: Props) => {
    return (
        <TouchableOpacity
            style={tw`flex-1 items-center py-2 px-6 ${props.active ? 'bg-zinc-800' : ''} rounded-3xl`}
            onPress={props.onPress}
        >
            <Text style={tw`text-base font-bold ${props.active ? 'text-white' : 'text-zinc-800'}`}>{props.title}</Text>
        </TouchableOpacity>
    );
}