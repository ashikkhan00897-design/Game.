# Animo — Anime Stream (Lite)
Single-page streaming template (Crunchyroll-style UI) with vanilla JS + HLS.js.
**Legal**: ships with free sample videos (Blender Foundation / Google sample bucket). Stream only content you have rights to.

Features:
- Home, My List, Admin (add custom stream URLs — saved locally)
- Player with HLS (.m3u8 via hls.js) + MP4 fallback
- Subtitles (.vtt) loader + sample EN track
- Continue Watching (per episode progress via localStorage)
- Watchlist, Comments (local only)
- Search by title/episode
- PWA scaffold (manifest + service worker; needs HTTPS/localhost)

Run:
- Open `index.html` directly, or
- `python3 -m http.server 8080` then open http://localhost:8080
