import { useMemo } from "react";

const useTextParser = (text) => {
  const parsedContent = useMemo(() => {
    if (!text) return [];

    const lines = text.split("\n");
    const content = [];
    let currentList = null;

    lines.forEach((line) => {
      // Handle headings
      if (line.startsWith("# ")) {
        content.push({ type: "heading1", text: line.substring(2) });
      } else if (line.startsWith("## ")) {
        content.push({ type: "heading2", text: line.substring(3) });
      } else if (line.startsWith("### ")) {
        content.push({ type: "heading3", text: line.substring(4) });
      } else if (line.startsWith("#### ")) {
        content.push({ type: "heading4", text: line.substring(5) });
      } else if (line.startsWith("##### ")) {
        content.push({ type: "heading5", text: line.substring(6) });
      } else if (line.startsWith("###### ")) {
        content.push({ type: "heading6", text: line.substring(7) });
      }
      else if (line.startsWith("- ")) {
        if (!currentList) {
          currentList = [];
          content.push({ type: "list", items: currentList });
        }
        const listItemContent = line.substring(2);
        const boldParsed = listItemContent.split(/(\*\*[^*]+\*\*)/g).map((part) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return { type: "bold", text: part.slice(2, -2) };
          }
          return { type: "text", text: part };
        });
        currentList.push({ type: "paragraph", parts: boldParsed });
      } else if (/###SPACING(\d+)###/.test(line)) {
        const match = line.match(/###SPACING(\d+)###/);
        if (match) {
          const spacingNumber = parseInt(match[1], 10);  
          content.push({ type: "spacing", value: spacingNumber });
        }
      }
      else {
        if (currentList) {
          currentList = null;
        }

        const boldParsed = line.split(/(\*\*[^*]+\*\*)/g).map((part) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return { type: "bold", text: part.slice(2, -2) };
          }
          return { type: "text", text: part };
        });

        content.push({ type: "paragraph", parts: boldParsed });
      }
    });

    return content;
  }, [text]);

  return parsedContent;
};

export default useTextParser;
