import React from "react";

import { Markdown } from "@lobehub/ui-rn";
import { content, example } from "./data";

const MarkdownTest = () => {
  return (
      <Markdown content={example} />
  );
};

export default MarkdownTest;
