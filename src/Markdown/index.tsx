import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "antd-style";

import Markdown, {MarkdownIt} from "react-native-markdown-display";
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';


import {Highlighter} from "@lobehub/ui-rn";
import markdownItMathjax3 from "markdown-it-mathjax3";


const md = MarkdownIt().use(markdownItMathjax3);

interface MarkdownRenderProps {
  content: string;
  dark?: boolean;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({
  content,
  dark = false,
}) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const [imageHeights, setImageHeights] = useState<Record<string, number>>({});

  const fontSize = 16;
  const headerMultiple = 1;
  const marginMultiple = 1.5;
  const lineHeight = 1.8;
  const borderRadius = 8;
  const borderColor = dark ? theme.colorBorder : `rgba(${theme.colorBorder}, 0.5)`;

  const markdownStyles = StyleSheet.create({
    body: {
      width: "100%",
      maxWidth: "100%",
      fontSize,
      color: theme.colorText,
    },
    heading1: {
      marginVertical: fontSize * marginMultiple * 0.4,
      fontSize: fontSize * (1 + 1.5 * headerMultiple),
      fontWeight: "bold",
      lineHeight: 1.25 * fontSize * (1 + 1.5 * headerMultiple),
      color: theme.colorText,
    },
    heading2: {
      marginVertical: fontSize * marginMultiple * 0.4,
      fontSize: fontSize * (1 + headerMultiple),
      fontWeight: "bold",
      lineHeight: 1.25 * fontSize * (1 + headerMultiple),
      color: theme.colorText,
    },
    heading3: {
      marginVertical: fontSize * marginMultiple * 0.4,
      fontSize: fontSize * (1 + 0.5 * headerMultiple),
      fontWeight: "bold",
      lineHeight: 1.25 * fontSize * (1 + 0.5 * headerMultiple),
      color: theme.colorText,
    },
    heading4: {
      marginVertical: fontSize * marginMultiple * 0.4,
      fontSize: fontSize * (1 + 0.25 * headerMultiple),
      fontWeight: "bold",
      lineHeight: 1.25 * fontSize * (1 + 0.25 * headerMultiple),
      color: theme.colorText,
    },
    heading5: {
      marginVertical: fontSize * marginMultiple * 0.4,
      fontSize: fontSize,
      fontWeight: "bold",
      lineHeight: 1.25 * fontSize,
      color: theme.colorText,
    },
    heading6: {
      marginVertical: fontSize * marginMultiple * 0.4,
      fontSize: fontSize,
      fontWeight: "bold",
      lineHeight: 1.25 * fontSize,
      color: theme.colorText,
    },
    link: {
      color: theme.colorPrimary,
      textDecorationLine: "none",
    },
    blockquote: {
      marginVertical: fontSize * marginMultiple,
      paddingLeft: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.colorBorder,
      color: theme.colorText,
    },
    code_inline: {
      marginHorizontal: 4,
      paddingVertical: 2,
      paddingHorizontal: 6,
      backgroundColor: theme.colorBgBase,
      borderWidth: 1,
      borderColor,
      borderRadius: 4,
      fontFamily: "monospace",
      fontSize: fontSize * 0.875,
    },
    code_block: {
      marginVertical: fontSize * marginMultiple,
      padding: 0,
      backgroundColor: theme.colorBgBase,
      borderWidth: 1,
      borderColor,
      borderRadius: borderRadius,
      fontFamily: "monospace",
      fontSize: fontSize * 0.875,
      overflow: "hidden",
    },
    image: {
      width: width - 32,
      marginVertical: fontSize * marginMultiple,
      borderRadius,
      borderWidth: 1,
      borderColor,
    },
    table: {
      unicodeBidi: "isolate",
      backgroundColor: theme.colorBgBase,
      marginVertical: fontSize * marginMultiple,
      borderWidth: 1,
      borderColor,
      borderRadius: borderRadius,
      overflow: "hidden",
    },
    thead: {
      backgroundColor: theme.colorBgBase,
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: borderColor,
    },

    th: {
      minWidth: 120,
      padding: 12,
    },
    td: {
      minWidth: 120,
      padding: 12,
    },
    hr: {
      marginVertical: fontSize * marginMultiple * 1.5,
      borderBottomWidth: 1,
      borderStyle: "dashed",
      borderColor: theme.colorBorder,
    },
    bullet_list: {
      marginVertical: fontSize * marginMultiple * 0.33,
    },
    ordered_list: {
      marginVertical: fontSize * marginMultiple * 0.33,
    },
    list_item: {
      marginVertical: fontSize * marginMultiple * 0.33,
    },
    paragraph: {
      marginVertical: fontSize * marginMultiple,
      lineHeight: lineHeight * fontSize,
      letterSpacing: 0.2,
    },
    strong: {
      fontWeight: "600",
    },
  });

  const calculateImageHeight = (
    uri: string,
    callback: (height: number) => void
  ) => {
    if (imageHeights[uri]) {
      callback(imageHeights[uri]);
      return;
    }

    Image.getSize(
      uri,
      (w, h) => {
        const scaledHeight = (h / w) * (width - 32);
        setImageHeights((prev) => ({ ...prev, [uri]: scaledHeight }));
        callback(scaledHeight);
      },
      () => {
        // Error fallback
        callback(200);
      }
    );
  };

  const renderImage = (node: any) => {
    const { src } = node.attributes;
    const [height, setHeight] = useState(200);

    React.useEffect(() => {
      calculateImageHeight(src, setHeight);
    }, [src]);

    return (
      <Image
        key={node.key}
        style={[markdownStyles.image, { height }]}
        source={{ uri: src }}
        resizeMode="contain"
      />
    );
  };

  // const renderVideo = (node: any) => {
  //   const { src, poster } = node.attributes;

  //   return (
  //     <Video
  //       key={node.key}
  //       style={[markdownStyles.image, { height: 200 }]}
  //       source={{ uri: src }}
  //       useNativeControls
  //       resizeMode={ResizeMode.CONTAIN}
  //       posterSource={{ uri: poster }}
  //       isLooping={false}
  //     />
  //   );
  // };

  const renderCodeBlock = (node: any) => {
    const { content, sourceInfo } = node;

    const language = sourceInfo.trim();

    return (
      <Highlighter code={content} lang={language}  />
    );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Markdown
        debugPrintTree
        style={markdownStyles}
        rules={{
          image: renderImage,
          code_block: renderCodeBlock,
          fence: renderCodeBlock,
          math_inline: (node, children, parent, styles) => (
            <MathJaxSvg
              fontSize={16}
              fontCache={true}
            >
              {`$$${node.content}$$`}
            </MathJaxSvg>
          ),
          math_block: (node, children, parent, styles) => {
            return (
              <MathJaxSvg
                fontSize={16}
                fontCache={true}
              >
               {`$$${node.content}$$`}
               </MathJaxSvg>
              );
          },
        }}
        markdownit={md}
      >
        {content}
      </Markdown>
    </ScrollView>
  );
};

export default MarkdownRender;
