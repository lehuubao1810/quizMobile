import {useCallback, useMemo, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
  Text,
} from 'react-native';
import {useTheme, Icon, IconButton} from 'react-native-paper';
import {MD3Colors} from 'react-native-paper/lib/typescript/types';
import {CustomText} from '../common/CustomText';
import tw from "twrnc";

interface Props {
  error?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  icon: string;
  placeholder?: string;
  iconSize?: number;
  keyboardType?: KeyboardTypeOptions;
  isCanSecureText?: boolean;
  style?: StyleProp<ViewStyle>;
  type?:string;
}

export default function InputSection({
  error,
  value,
  onChangeText,
  style,
  icon,
  placeholder,
  keyboardType,
  isCanSecureText = false,
  iconSize = 22,
  type
}: Props) {
  const [secureText, setSecureText] = useState(isCanSecureText);
  
  const colors = useTheme().colors;

  const onChangeMode = useCallback(() => {
    setSecureText(!secureText);
  }, [secureText]);

  const iconView = useMemo(
    () => (
      <View style={tw``}>
        <Icon source={icon} size={iconSize} color={colors.onBackground} />
      </View>
    ),
    [icon, iconSize, colors],
  );

  return (
    <View style={style}>
      <View style={tw`flex-row items-center gap-4 rounded-lg border-2 border-gray-300 p-3`}>
        {iconView}
        <View style={tw`flex-row items-center justify-between w-full flex-1`}>
          <TextInput
            style={tw`flex-1`}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            secureTextEntry={secureText}
            numberOfLines={1}
            
          />
          <View style={tw`absolute right-0`}>
            {isCanSecureText && (
              <IconButton
                icon={!secureText ? 'eye-off' : 'eye'}
                size={iconSize}
                iconColor={colors.onBackground}
                onPress={onChangeMode}
              />
            )}
          </View>
        </View>
      </View>
      <Text style={tw`text-red-400 font-bold text-sm`}>
        {error}
      </Text>
    </View>
  );
}

