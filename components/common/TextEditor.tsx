import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

const TextEditor = ({
  editorRef,
  onChange,
  initialContentHTML,
}: {
  editorRef: React.RefObject<any>;
  onChange: (body: string) => void;
  initialContentHTML: string;
}) => {
  const onPick = async (isPick: boolean) => {};

  return (
    <View
      style={{
        minHeight: 285,
      }}
    >
      {/* Placeholder for the text editor component */}
      <RichToolbar
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.code,
          actions.line,
          actions.alignCenter,
          actions.alignLeft,
          actions.alignRight,
          actions.blockquote,
          actions.removeFormat,
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading4]: ({ tintColor }: any) => (
            <Text style={{ color: tintColor }}>H4</Text>
          ),
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        editor={editorRef}
        disabled={false}
        selectedIconTint={theme.colors.primaryDark}
      />

      <RichEditor
        ref={editorRef}
        containerStyle={styles.richEditor}
        editorStyle={styles.containerStyle}
        placeholder="Whats on your mind ?"
        onChange={onChange}
        initialContentHTML={initialContentHTML}
      />
    </View>
  );
};

export default TextEditor;

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  richEditor: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    padding: 5,
  },
  containerStyle: {
    color: theme.colors.text,
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  addImageText: {},
  mediaIcons: {},
});
