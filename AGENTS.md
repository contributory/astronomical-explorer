# Cosmic Explorer (Next.js) — Base44 Dev Notes

## What this is
Next.js 14 App Router app ("cosmic-explorer-next") that proxies live space APIs
(NASA APOD/NeoWS/EPIC/DONKI, ISS, Mars Rovers, Spaceflight News, EONET, Launch Library,
le-systeme-solaire.net). The older Streamlit version (`app.py` + `modules/`) is legacy
and not run in the Base44 environment.

## Running
- `docker compose -f docker-compose.base44.yml up -d --build`
- Dev server: `next dev -p 3000 -H 0.0.0.0` (live reload via bind mount)
- Health: `curl localhost:3000/`

## Environment
- `NASA_API_KEY` — optional. Defaults to `DEMO_KEY` (30 req/hr, 50/day). Get a real key
  at https://api.nasa.gov to avoid rate limits on APOD/NeoWS/EPIC/DONKI endpoints.
- All other APIs (ISS, Mars, News, EONET, Launches, Bodies) are keyless.
- `BASE44_PUBLIC_HOST_SUFFIX` is passed into the container and used by
  `allowedDevOrigins` in `next.config.mjs` so the preview origin can access dev assets/HMR.

## Structure
- `app/` — App Router pages (apod, iss, neo, mars, solar, news, earth, launches, bodies, events)
- `app/api/` — API route handlers that proxy external APIs (server-side, hide keys)
- `components/` — Shell, providers, maps
- `lib/` — env, translations, utils, space calculations, fallback data
- `modules/` — legacy Streamlit Python modules (not used by Next.js app)
