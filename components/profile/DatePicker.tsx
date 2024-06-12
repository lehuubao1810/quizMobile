import { Button, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import tw from "twrnc";
import { Icon } from "react-native-paper";
import dayjs from "dayjs";

type Props = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DatePicker = ({ date, setDate }: Props) => {
  const [show, setShow] = useState(false);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShow(false);
    if (currentDate) setDate(currentDate);
  };

  const showPicker = () => {
    setShow(true);
  };

  return (
    <View style={tw`w-full`}>
      <TouchableOpacity
        onPress={showPicker}
        style={tw`flex-row items-center gap-4 rounded-lg border-2 border-gray-300 p-4 w-full`}
      >
        <Icon source="calendar" size={22} color={"#000"} />
        <Text>{dayjs(date).format("DD/MM/YYYY")}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(date)}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </View>
  );
};
