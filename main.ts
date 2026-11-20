// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry itself is the X post: a GTA 6 meme whose picture shows make.fun's
// ghost, posted from a public account with make.fun and this account's play
// code in its text. This program does the one mechanical job the hand-in
// needs: it copies POST.json — the file at the repository root naming the
// post's address on X — into /output, where the gate reads it. Nothing this
// program writes is judged; the house reads the post itself from X.
//
// POST.json still holds the starter's placeholder address until the post is
// made and its real URL is written in. With the placeholder in place the
// gate refuses the entry, by design: a starter that passed would need no
// post at all.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
  // A placeholder URL means the post has not been made yet: say so plainly
  // instead of silently handing in a file the gate will refuse.
  const posted = JSON.parse(readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf-8')) as { url?: string };
  if (!posted.url || posted.url.includes('<handle>') || posted.url.includes('<id>')) {
    console.error('POST.json still holds the starter placeholder — post the meme on X and put its real URL in POST.json first.');
    process.exit(1);
  }
} catch (err) {
  console.error(`Could not copy POST.json out of ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
