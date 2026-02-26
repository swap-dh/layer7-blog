 
import { promises as fs } from "fs";
import { evaluate, EvaluateOptions } from "next-mdx-remote-client/rsc";
import path from "path";
import { mdxComponents } from "@/features/posts/components/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import { PostFrontmatter } from "@/features/posts/types/post";
import { PostHeader } from "@/features/posts/components/post-header";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkFlexibleToc, { type TocItem } from "remark-flexible-toc";
import RemarkFlexibleToc from "remark-flexible-toc";
import { TableOfContents } from "@/features/posts/components/table-of-contents";
type Scope = {
  toc?: TocItem[];
};
 
const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const source = await fs.readFile(path.join(process.cwd(), "src/data/posts", `${slug}.mdx`), "utf-8");
  const options: EvaluateOptions = {
    mdxOptions: {
      remarkPlugins: [RemarkFlexibleToc],
      rehypePlugins: [rehypePrettyCode, rehypeSlug, [rehypeAutolinkHeadings, {behavior : "wrap", properties: {className: ["heading-link"], ariaLabel:"Link to this heading"}}]]  
    },
    parseFrontmatter: true,
    vfileDataIntoScope: "toc",
  };
  const { content , frontmatter, scope } = await evaluate<PostFrontmatter, Scope>({
    source,
    options,
    components: mdxComponents,
  });
 
  return (
    <main className="flex min-h-full w-full">
      <article className="container mx-auto flex px-3">
        <div className="prose dark:prose-invert max-w-none overflow-x-auto flex-1 border-x p-6">
          <PostHeader frontmatter={frontmatter} />
          {content}
        </div>
        <aside className="z-40 hidden w-56 flex-shrink-0 lg:block">
          <div className="fixed top-16 w-56 h-full overflow-auto p-3">{scope?.toc && <TableOfContents toc={scope.toc} />}</div>
        </aside>
      </article>
    </main>
  );
};
export default PostPage;
 