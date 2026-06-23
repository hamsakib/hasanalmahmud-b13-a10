# 🔄 ReSell Hub — Client

**ReSell Hub** is a modern, full-stack online marketplace where users can safely buy and sell pre-owned products. This repository contains the **client (frontend)** application built with React + Vite.

## 🌐 Live URL & Links

- **Live Site:** https://hasanalmahmud-b13-a10.vercel.app
- **API Server:** https://hasanalmahmud-b13-a10-server.vercel.app
- **Client Repo:** https://github.com/hamsakib/hasanalmahmud-b13-a10
- **Server Repo:** https://github.com/hamsakib/hasanalmahmud-b13-a10-server

## 🎯 Project Purpose

Many people own products that are still usable but no longer needed. ReSell Hub helps:
- ♻️ Reduce waste & promote sustainable consumption
- 💰 Let users earn money from unused items
- 🛍️ Help buyers find quality products at affordable prices

## ✨ Key Features

- **Role-based system** — Buyer, Seller, and Admin dashboards, each with dedicated features and permissions.
- **Authentication** — Email/password + Google sign-in via Firebase, with JWT-protected private routes & APIs.
- **Product marketplace** — Browse, search by name/category, filter by condition & price range, sort by price, and paginate.
- **Product details** — Image gallery, seller info, verified-seller badge, reviews, wishlist & report buttons.
- **Seller tools** — Add/edit/delete products (CRUD), manage incoming orders with status flow (Pending → Accepted → Processing → Shipped → Delivered), and a sales analytics page with charts.
- **Admin tools** — Manage users (role, block/unblock, verify, delete), moderate products (approve/reject/delete), monitor all orders, and view platform analytics.
- **Buyer tools** — Track orders, cancel before shipment, wishlist, and full payment history.
- **Stripe payments** — Secure checkout, order summary, payment intent, success page with transaction details.
- **Animations** — Framer Motion on hero, product cards, and statistics sections.
- **UX** — Skeleton loaders, professional spinner, custom 404 page, fully responsive (mobile/tablet/desktop).

### 🌟 Optional Features Implemented
1. **Product Comparison** — Compare up to 4 products side-by-side (price, condition, category, seller rating).
2. **Recently Viewed Products** — Tracked via localStorage on the product details page.
3. **Seller Verification Badge** — Verified sellers show a badge on cards, details, and trusted-sellers section.
4. **Product Reporting System** — Users report listings; admin sees report counts in the moderation panel.
5. **Advanced Product Filtering** — Price range, condition, category filters on the All Products page.

## 🧰 NPM Packages Used

| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Server state / data fetching & caching |
| `axios` | HTTP client (public + secure interceptor instances) |
| `firebase` | Authentication (email/password + Google) |
| `@stripe/react-stripe-js` / `@stripe/stripe-js` | Stripe payment integration |
| `recharts` | Dashboard charts & analytics |
| `framer-motion` | Animations |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icon set |
| `react-helmet-async` | Dynamic page titles |
| `tailwindcss` / `@tailwindcss/vite` | Styling |

## 🚀 Getting Started

```bash
npm install
# create .env.local and fill in your keys (see below)
npm run dev
```

### Environment Variables (`.env.local`)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_IMGBB_API_KEY=
```

## 📁 Tech Stack
React 19 · Vite · Tailwind CSS v4 · Firebase Auth · TanStack Query · Stripe · Recharts · Framer Motion
