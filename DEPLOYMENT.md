# Deployment (Client) — Better Auth

The client **proxies `/api/*` to the API server** (see `vercel.json`). This makes the
Better Auth session cookie **first-party** to the client domain, so users stay logged in
after a reload and Google sign-in works cross-domain. This is the fix for the
"private routes must remain logged in after reload" requirement.

## How it works

```
Browser ──> https://<client>.vercel.app/api/auth/*  ──(Vercel rewrite)──> https://<server>.vercel.app/api/auth/*
```

Because the browser only ever talks to the client domain, the session cookie is
first-party. No third-party-cookie problems.

## Vercel env vars (client project)

| Var | Value |
|---|---|
| `VITE_API_URL` | **leave empty / unset** → the app calls relative `/api`, which the rewrite proxies |
| `VITE_STRIPE_PUBLISHABLE_KEY` | your Stripe publishable key |
| `VITE_IMGBB_API_KEY` | your ImgBB key |

> Local dev keeps `VITE_API_URL=http://localhost:5000` in `.env.local` (no proxy locally —
> `localhost:5173` and `localhost:5000` are same-site, so cookies already work).

## After changing the server URL

If your server deploys to a different URL, update the `destination` in `vercel.json`.
