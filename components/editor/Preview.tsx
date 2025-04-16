import React from "react";
import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

const Preview = ({ content}: { content: string }) => {
  // const formattedContent = content.replace(/\\/g, "").replace(/&#20;/g, "");
  const formattedContent = content
  // Hilangkan backslash yang tidak perlu
  .replace(/\\/g, "")
  // Ganti simbol unicode HTML (termasuk spasi)
  .replace(/&#20;|&nbsp;/g, " ")
  // Hilangkan tag <br> atau ubah jadi newline
  .replace(/<br\s*\/?>/gi, "\n")
  // Hilangkan <hr> atau pengganggu lainnya
  .replace(/<hr\s*\/?>/gi, "\n---\n")
  // Hilangkan karakter aneh atau garis horizontal diawal file
  .replace(/^\s*---\s*$/gm, "")
  // Trim whitespace di awal dan akhir
  .toString()
  .trim();


  return (
    <section className="markdown prose grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
};

export default Preview;