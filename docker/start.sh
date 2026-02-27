#!/bin/sh
set -eu

SYNC_INTERVAL_SECONDS="${SYNC_INTERVAL_SECONDS:-60}"

sync_once() {
  if [ -n "${NOTION_TOKEN:-}" ] && [ -n "${NOTION_DATABASE_ID:-}" ]; then
    echo "[sync] Running Notion sync..."
    node scripts/sync-notion-to-mdx.mjs || echo "[sync] Failed. Will retry on next interval."
  else
    echo "[sync] NOTION_TOKEN or NOTION_DATABASE_ID is missing. Skipping sync."
  fi
}

sync_once

(
  while true; do
    sleep "${SYNC_INTERVAL_SECONDS}"
    sync_once
  done
) &
SYNC_PID=$!

cleanup() {
  kill "${SYNC_PID}" 2>/dev/null || true
}

trap cleanup INT TERM

node server.js
