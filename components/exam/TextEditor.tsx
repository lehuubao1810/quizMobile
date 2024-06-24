import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";
import tw from "twrnc";

type Props = {
  html: string;
  setAnswer: (html: string) => void;
};

export default function TextEditor({ html, setAnswer }: Props) {
  const _editor = React.createRef<QuillEditor>();

  return (
    <SafeAreaView
      style={tw`shadow-md bg-white min-h-[300px] mb-4 max-w-full overflow-hidden rounded-lg`}
    >
      <QuillEditor
        style={styles.editor}
        ref={_editor}
        initialHtml={html}
        onHtmlChange={({ html }) => {
          console.log("html changed", html);
          setAnswer(html);
        }}
      />
      <View style={tw``}>
        <QuillToolbar
          editor={_editor}
          options="basic"
          theme={"light"}
          styles={{
            toolbar: {
              root: (props) => [
                {
                  ...props,
                },
                tw`ml-[-1px] left-0 pr-16 border-0`,
              ],
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 10,
  },
  root: {
    backgroundColor: "#fff",
    minHeight: 300,
    overflow: "hidden",
    maxWidth: "100%",
    marginBottom: 20,
    borderRadius: 10,
  },
  editor: {
    padding: 0,
    backgroundColor: "white",
  },
});
