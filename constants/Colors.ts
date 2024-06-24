/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "rgb(39 39 42)";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fafafa",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    card: "#fff",
    btn: "#28292e",
    tabCategory: "#fff",
    input: "#ccc",
    tabBar: "#fff"
  },
  dark: {
    text: "#ECEDEE",
    background: "#25293b",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    card: "#2f3349",
    btn: "#00CFE8",
    tabCategory: "#fff",
    input: "#CBE4DE",
    tabBar: "#1c1f2e"
  },
};
