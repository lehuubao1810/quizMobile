import { RefreshControl, SafeAreaView, View, FlatList } from "react-native";
import tw from "twrnc";
import { Text } from "react-native-paper";

import { ListItem } from "../../components/common/ListItem";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getChartByExamID, getExamDone } from "../../redux/stat/statSlice";
import { LoadingBtn } from "../../components/common/LoadingBtn";
import { FlashList } from "@shopify/flash-list";
import { showToast } from "../../utils/toast";
import { router } from "expo-router";
import Loader from "@/components/common/Loader";
import { ThemedText } from "@/components/default/ThemedText";

export default function StatScreen() {
  const dispatch = useAppDispatch();
  const { exams, loading } = useAppSelector((state) => state.statState);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getExamDone());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    await dispatch(getExamDone())
      .unwrap()
      .then(() => {
        setRefreshing(false);
      })
      .catch((err) => {
        setRefreshing(false);
        showToast("error", err);
      });
  };

  const handleStatExam = (examId: string) => {
    console.log(examId);
    dispatch(getChartByExamID(examId))
      .unwrap()
      .then(() => {
        // navigation.navigate("DetailStatScreen", { examId });
        router.push({
          pathname: "DetailStatScreen",
          params: { examId },
        });
      })
      .catch((err) => {
        showToast("error", err);
      });
  };

  return (
    <>
      <SafeAreaView style={tw`flex-1 pt-[45px]`}>
        <View style={tw`flex-1`}>
          <ThemedText style={tw`text-xl font-bold text-center mb-4`}>
            List Completed Exam
          </ThemedText>

          <FlatList
            style={tw`flex-1`}
            contentContainerStyle={tw`px-6 py-2`}
            data={exams}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <ListItem
                key={item._id}
                item={{
                  _id: item._id,
                  name: item.title,
                  icon: "quiz",
                }}
                action={(id, name) => {
                  handleStatExam(id);
                }}
              />
            )}
          />
        </View>
      </SafeAreaView>
      <Loader isLoading={loading} />
    </>
  );
}
