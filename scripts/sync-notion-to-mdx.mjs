import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const REQUIRED_ENV = ["NOTION_TOKEN", "NOTION_DATABASE_ID"];

function assertEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeYamlString(value) {
  return value.replaceAll('"', '\\"');
}

function stringifyFrontmatter(data) {
  const lines = [];
  lines.push("---");
  lines.push(`title: "${escapeYamlString(data.title)}"`);
  lines.push(`description: "${escapeYamlString(data.description)}"`);
  lines.push(`date: "${data.date}"`);
  lines.push(`updated: "${data.updated}"`);
  lines.push(`slug: "${data.slug}"`);
  if (data.thumbnail) {
    lines.push(`thumbnail: "${escapeYamlString(data.thumbnail)}"`);
  }
  if (data.thumbnailAlt) {
    lines.push(`thumbnailAlt: "${escapeYamlString(data.thumbnailAlt)}"`);
  }
  lines.push(`tags: [${data.tags.map((tag) => `"${escapeYamlString(tag)}"`).join(", ")}]`);
  lines.push(`category: "${escapeYamlString(data.category)}"`);
  lines.push(`draft: ${data.draft ? "true" : "false"}`);
  lines.push("---");
  return lines.join("\n");
}

function getPlainText(prop) {
  if (!prop) return "";

  if (prop.type === "title") {
    return prop.title.map((item) => item.plain_text).join("").trim();
  }
  if (prop.type === "rich_text") {
    return prop.rich_text.map((item) => item.plain_text).join("").trim();
  }
  if (prop.type === "url") {
    return (prop.url ?? "").trim();
  }
  if (prop.type === "select") {
    return (prop.select?.name ?? "").trim();
  }
  if (prop.type === "date") {
    return (prop.date?.start ?? "").trim();
  }
  if (prop.type === "checkbox") {
    return prop.checkbox ? "true" : "false";
  }
  return "";
}

function getPropertyByNameOrType(props, propertyName, propertyType) {
  if (props[propertyName]) {
    return props[propertyName];
  }
  return Object.values(props).find((prop) => prop?.type === propertyType);
}

function getTags(prop) {
  if (!prop) return [];
  if (prop.type === "multi_select") {
    return prop.multi_select.map((item) => item.name).filter(Boolean);
  }
  return [];
}

function getCheckbox(prop, fallback = false) {
  if (!prop || prop.type !== "checkbox") return fallback;
  return Boolean(prop.checkbox);
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function normalizeMarkdownBody(markdown) {
  const body = (markdown ?? "").trim();
  return body.length > 0 ? `${body}\n` : "";
}

async function fetchDatabasePages(notion, databaseId) {
  let hasMore = true;
  let cursor = undefined;
  const pages = [];
  let queryMode = "data_source";
  let dataSourceId = "";

  try {
    const database = await notion.databases.retrieve({ database_id: databaseId });
    dataSourceId = database?.data_sources?.[0]?.id ?? "";
  } catch (error) {
    console.warn(`Failed to retrieve database metadata: ${error?.message ?? error}`);
  }

  if (!dataSourceId && notion?.databases?.query) {
    queryMode = "database";
  } else if (!dataSourceId) {
    throw new Error("Could not find a data source ID for this database.");
  }

  while (hasMore) {
    const response =
      queryMode === "data_source"
        ? await notion.dataSources.query({
            data_source_id: dataSourceId,
            start_cursor: cursor,
            page_size: 100,
          })
        : await notion.databases.query({
            database_id: databaseId,
            start_cursor: cursor,
            page_size: 100,
          });

    for (const result of response.results) {
      if ("properties" in result) {
        pages.push(result);
      }
    }

    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  return pages;
}

async function main() {
  assertEnv();

  const outputDir = path.resolve(process.cwd(), process.env.NOTION_OUTPUT_DIR || "src/data/posts");
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const databaseId = process.env.NOTION_DATABASE_ID;

  await ensureDirectory(outputDir);
  const pages = await fetchDatabasePages(notion, databaseId);

  let writtenCount = 0;
  let skippedCount = 0;

  for (const page of pages) {
    if (page.archived) {
      skippedCount += 1;
      continue;
    }

    const props = page.properties;
    const publishedProp = props.published;
    if (publishedProp && !getCheckbox(publishedProp, true)) {
      skippedCount += 1;
      continue;
    }

    const titleProp = getPropertyByNameOrType(props, "title", "title");
    const title = getPlainText(titleProp);
    const description = getPlainText(props.description);
    const slug = getPlainText(props.slug) || slugify(title);
    const category = getPlainText(props.category) || "general";
    const thumbnail = getPlainText(props.thumbnail);
    const thumbnailAlt = getPlainText(props.thumbnailAlt);
    const tags = getTags(props.tags);
    const draft = getCheckbox(props.draft, false);
    const date = getPlainText(props.date) || new Date(page.created_time).toISOString().slice(0, 10);
    const updated = new Date(page.last_edited_time).toISOString().slice(0, 10);

    if (!title || !slug) {
      console.warn(`Skipping page ${page.id}: missing title or slug`);
      skippedCount += 1;
      continue;
    }

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdResult = n2m.toMarkdownString(mdBlocks);
    const mdString =
      typeof mdResult === "string"
        ? mdResult
        : (mdResult?.parent ?? "");
    const frontmatter = stringifyFrontmatter({
      title,
      description,
      date,
      updated,
      slug,
      thumbnail,
      thumbnailAlt,
      tags,
      category,
      draft,
    });
    const body = normalizeMarkdownBody(mdString);
    const content = `${frontmatter}\n\n${body}`;
    const filePath = path.join(outputDir, `${slug}.mdx`);

    let shouldWrite = true;
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      const parsed = matter(existing);
      const nextParsed = matter(content);
      shouldWrite = parsed.content !== nextParsed.content || JSON.stringify(parsed.data) !== JSON.stringify(nextParsed.data);
    } catch {
      shouldWrite = true;
    }

    if (shouldWrite) {
      await fs.writeFile(filePath, content, "utf-8");
      writtenCount += 1;
      console.log(`Wrote: ${path.relative(process.cwd(), filePath)}`);
    }
  }

  console.log(`Notion sync done. Written: ${writtenCount}, Skipped: ${skippedCount}, Total: ${pages.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
