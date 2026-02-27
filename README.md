This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Notion -> MDX Sync

This project can sync post content from a Notion database into `src/data/posts/*.mdx`.

### 1) Create Notion database properties

Use these property names in your Notion DB:

- `title` (Title)
- `description` (Rich text)
- `slug` (Rich text)
- `date` (Date)
- `tags` (Multi-select)
- `category` (Select)
- `thumbnail` (URL)
- `thumbnailAlt` (Rich text, optional)
- `draft` (Checkbox)
- `published` (Checkbox, optional: only `true` pages are synced)

### 2) Set environment variables

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`
- `NOTION_OUTPUT_DIR` (optional, default: `src/data/posts`)

### 3) Run sync locally

```bash
npm run sync:notion
```

### 4) Enable GitHub auto-sync

Workflow file: `.github/workflows/notion-sync.yml`

Add these repository secrets:

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

Then run the workflow manually or wait for the 15-minute schedule.

## Docker Deploy

### 0) Create `.env`

Create a `.env` file in the project root:

```bash
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SYNC_INTERVAL_SECONDS=60
```

### Build and run locally

```bash
docker compose up -d --build
```

Open `http://localhost:3000`.

The container will:

- start Next.js on port `3000`
- run Notion sync once at startup
- keep syncing every `SYNC_INTERVAL_SECONDS`

### Stop

```bash
docker compose down
```

### Dockploy usage

1. Connect this GitHub repository in Dockploy.
2. Select `docker-compose.yml` as the deployment file.
3. Add environment variables (`NOTION_TOKEN`, `NOTION_DATABASE_ID`, `SYNC_INTERVAL_SECONDS`).
4. Set branch and auto-deploy options as needed.
5. Deploy and map your domain to port `3000`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
