import { Typography } from "@mui/material";
import useTextParser from "../../hooks/useTextParser";

const Heading1 = ({ children }) => <Typography variant="h1" sx={{ mb: 4 }}>{children}</Typography>;
const Heading2 = ({ children }) => <Typography variant="h2" sx={{ mb: 3.5 }}>{children}</Typography>;
const Heading3 = ({ children }) => <Typography variant="h3" sx={{ mb: 3.4 }}>{children}</Typography>;
const Heading4 = ({ children }) => <Typography variant="h4" sx={{ mb: 2.9 }}>{children}</Typography>;
const Heading5 = ({ children }) => <Typography variant="h5" sx={{ mb: 2.4 }}>{children}</Typography>;
const Heading6 = ({ children }) => <Typography variant="h6" sx={{ mb: 2 }}>{children}</Typography>;
const List = ({ items }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>
        <Typography>
          {item.parts.map((part, partIndex) =>
            part.type === "bold" ? <b key={partIndex}>{part.text}</b> : part.text
          )}
        </Typography>
      </li>
    ))}
  </ul>
);
const Paragraph = ({ parts }) => (
  <Typography>
    {parts.map((part, index) =>
      part.type === "bold" ? <b key={index}>{part.text}</b> : part.text
    )}
  </Typography>
);


const Spacing = ({ value }) => {
  const spacingValue = value >= 0 ? `${value * 16}px` : "0px";

  return <div style={{ margin: spacingValue }}></div>;
};



export const TextParser = ({ text }) => {
  const parsedContent = useTextParser(text);

  return (
    <div>
      {parsedContent.map((block, index) => {
        switch (block.type) {
          case "heading1":
            return <Heading1 key={index}>{block.text}</Heading1>;
          case "heading2":
            return <Heading2 key={index}>{block.text}</Heading2>;
          case "heading3":
            return <Heading3 key={index}>{block.text}</Heading3>;
          case "heading4":
            return <Heading4 key={index}>{block.text}</Heading4>;
          case "heading5":
            return <Heading5 key={index}>{block.text}</Heading5>;
          case "heading6":
            return <Heading6 key={index}>{block.text}</Heading6>;
          case "list":
            return <List key={index} items={block.items} />;
          case "paragraph":
            return <Paragraph key={index} parts={block.parts} />;
          case "spacing":
            return <Spacing key={index} value={block.value} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
