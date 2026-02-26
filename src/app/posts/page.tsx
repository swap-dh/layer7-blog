 
import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { evaluate } from "next-mdx-remote-client/rsc";
import { PostFrontmatter } from "@/features/posts/types/post";
import Image from "next/image";
 
const PostsPage = async () => {
  const postFileNames = await fs.readdir(path.join(process.cwd(), "src/data/posts"));
 
  const posts = await Promise.all(
    postFileNames
      .filter((filename) => filename.endsWith(".mdx"))
      .map(async (filename, index) => {
        const content = await fs.readFile(path.join(process.cwd(), "src/data/posts", filename), "utf-8");
        const { frontmatter } = await evaluate<PostFrontmatter>({
          source: content,
          options: {
            parseFrontmatter: true,
          },
        });
        return {
          id: index,
          path: "/posts/" + filename.replace(".mdx", ""),
          ...frontmatter,
        };
      }),
  );
  return (
    <div className="container mx-auto py-8 px-3">
      <h1 className="text-3xl font-bold mb-8">블로그 포스트</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={post.path}>
            <Card className="hover:border-amber-500 h-full flex justify-between flex-col">
              <CardHeader>
                {post.thumbnail && <CardTitle><Image src={post.thumbnail} alt={post.title} width={400} height={200} className="w-full h-48 object-cover" /></CardTitle>}
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
 
};
 
export default PostsPage;
 