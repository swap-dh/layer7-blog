 
import Pre from "@/features/posts/components/pre";
import type { MDXComponents } from "next-mdx-remote-client/rsc";
 
export const mdxComponents: MDXComponents = {
  pre: (props) => <Pre {...props} />,
};
 
 