# AniPro — Professional Anime Streaming Template
**Legal-first**: Use only content you have rights to stream.
## Stack
- Next.js 14 (App Router), TailwindCSS
- Prisma + SQLite
- HLS.js Player with quality picker
- Admin CMS (Titles/Seasons/Episodes)
- Upload + FFmpeg -> HLS
## Run
```bash
npm i
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```
Open http://localhost:3000
## Transcode
Install FFmpeg. Upload a video in Admin → Upload. HLS will be written to `/public/hls/<episodeId>/index.m3u8` and added as a Source. MP4 fallback is also saved in `/public/uploads/<episodeId>.mp4`.
