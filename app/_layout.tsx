import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

// Import your global CSS file

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { StatusBar } from "expo-status-bar";
import { getData, saveObject } from "@/utils/asyncStoreage";
import Toast from "react-native-toast-message";
import { DarkTheme, DefaultTheme } from "@/constants/Themes";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(course)" options={{ headerShown: false }} />
          <Stack.Screen name="(essay)" options={{ headerShown: false }} />
          <Stack.Screen name="(profile)" options={{ headerShown: false }} />
          <Stack.Screen name="(quiz)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(quizRealTime)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(stat)" options={{ headerShown: false }} />

          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar
        backgroundColor={`${Colors[colorScheme ?? "light"].background}`}
        style={`${colorScheme === "dark" ? "light" : "dark"}`}
      />
        <Toast />
      </ThemeProvider>
    </Provider>
  );
}
