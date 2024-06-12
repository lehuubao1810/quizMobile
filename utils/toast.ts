// Foo.jsx
import Toast from "react-native-toast-message";

export const showToast = (
  type: "success" | "error" | "info",
  text2: string
) => {
  const text1 =
    type === "success" ? "Success" : type === "error" ? "Error" : "Info";

  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
  });
};
