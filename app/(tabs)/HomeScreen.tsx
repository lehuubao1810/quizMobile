import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import tw from "twrnc";
import { Icon, Text } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { getData } from "../../utils/asyncStoreage";
import {
  changeCategory,
  fetchCourses,
  getDetailCourse,
} from "../../redux/course/courseSlice";
import { useCallback, useEffect, useState } from "react";
import { TabCategoryItem } from "../../components/home/TabCategoryItem";
import { ListItem } from "../../components/common/ListItem";
import { Course } from "../../types/Course/Course";
import { FlashList } from "@shopify/flash-list";
import { router, useNavigation } from "expo-router";

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  const { courses, categoryCurrentId } = useAppSelector(
    (state) => state.coursesState
  );
  const { user } = useAppSelector((state) => state.authReducer);

  const { categories } = useAppSelector((state) => state.categoriesState);

  const [searchCourse, setSearchCourse] = useState("");

  const [coursesFilter, setCoursesFilter] = useState<Course[]>(courses);

  useEffect(() => {
    setCoursesFilter(courses);
    console.log("set list");
  }, [courses]);

  // useEffect(() => {
  //   setSearchCourse("");
  //   // dispatch(changeCategory(""));
  // }, [categoryCurrentId]);

  const onHandleCourse = async (courseId: string, courseName: string) => {
    const accessToken = await getData<string>("@accessToken");
    dispatch(
      getDetailCourse({ courseId, accessToken: accessToken ?? "" })
    ).then(() => {
      // navigation.navigate("DetailCourseScreen", { courseName, courseId });
      router.push({
        pathname: "DetailCourseScreen",
        params: { courseName, courseId },
      });
    });
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const accessToken = await getData<string>("@accessToken");

    await dispatch(fetchCourses(accessToken ?? ""));
    await handleFilter(categoryCurrentId).then(() => {
      setRefreshing(false);
    });
  }, [categoryCurrentId]);

  const handleSearchCourse = async (text: string) => {
    setSearchCourse(text);
    const textTrim = text.trim();
    // search and filter
    const subCourses = [...courses];
    const filterCourses = subCourses.filter((course) => {
      return course.name.toLowerCase().includes(textTrim.toLowerCase());
    });
    dispatch(changeCategory(""));
    setCoursesFilter(filterCourses);
    console.log("filterCourses", filterCourses);
  };

  const handleFilter = async (id: string) => {
    dispatch(changeCategory(id));
    const subCourses = [...courses];
    if (id === "") {
      setCoursesFilter(subCourses);
    } else {
      const filterCourses = subCourses.filter((course) => {
        return course.category_id === id;
      });
      setCoursesFilter(filterCourses);
    }
  };

  // Navigation
  const navigation = useNavigation();

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        const data = e.data.action.payload as {
          name: string;
          params: {
            screen: string;
          };
        };
        console.log("prevent back", data?.params.screen === "LoginScreen");
        console.log("prevent back 2", e);

        if (data?.params.screen === "LoginScreen") {
          return;
        }
        // Prevent default
        e.preventDefault();
      }),
    [navigation]
  );

  return (
    <View style={tw`flex-1 bg-white android:pb-[${340}px] pt-[45px]`}>
      <View style={tw``}>
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate("TabNavigator", { screen: "ProfileScreen" });
            router.push("ProfileScreen");
          }}
          style={tw`pl-6 pb-4 flex-row gap-2 items-center w-2/4`}
        >
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("../../assets/images/avatardefault.png")
            }
            style={tw`w-10 h-10 rounded-full`}
          />
          <Text style={tw`text-center text-base font-bold`}>
            Hi,{" "}
            {user?.name.first_name
              ? `${user?.name.first_name} ${user?.name.last_name}`
              : "User Name"}
          </Text>
        </TouchableOpacity>
        <View style={tw`pb-2 w-full px-6`}>
          {/* input search course */}
          <View
            style={tw`flex-row items-center gap-4 rounded-lg border-2 border-gray-300 p-3`}
          >
            <View style={tw``}>
              <Icon
                source={"book-search-outline"}
                size={28}
                color={"#27272a"}
              />
            </View>
            <View style={tw`flex-row items-center justify-between w-full `}>
              <TextInput
                style={tw``}
                value={searchCourse}
                onChangeText={handleSearchCourse}
                placeholder={"Search course..."}
                numberOfLines={1}
              />
              {/* Delete Icon*/}
              {searchCourse !== "" && (
                <TouchableOpacity
                  style={tw`absolute right-10 p-2 bg-slate-200 rounded-full`}
                  onPress={() => {
                    handleSearchCourse("");
                  }}
                >
                  <Icon source={"close"} size={18} color={"#27272a"} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {searchCourse.trim() === "" && (
          <View style={tw`pl-6 py-2`}>
            <FlatList
              horizontal={true}
              keyExtractor={(item) => item._id}
              data={categories}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TabCategoryItem
                  title={item.name}
                  active={categoryCurrentId === item._id}
                  onPress={() => handleFilter(item._id)}
                />
              )}
            />
          </View>
        )}
        <View style={tw`ios:pb-36 min-h-full`}>
          <FlashList
            contentContainerStyle={tw`pt-2 px-6 pb-4`}
            estimatedItemSize={200}
            data={coursesFilter}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <ListItem
                item={{
                  ...item,
                  isCourse: true,
                }}
                action={onHandleCourse}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
