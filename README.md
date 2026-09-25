# Project 111 - Restaurant Admin Panel

## Offline Demo

This branch runs entirely against an in-memory diner dataset: 14 products, a
categorized menu, eight tables, sample orders, sessions, and bills. Authentication
is bypassed with a fixed manager/staff identity; HTTP requests and SignalR
connections do not reach a backend. Do not deploy this authentication bypass to
production.

Edits and order/status changes last until the page is refreshed. Refresh to reset
the demo. Device pairing returns a sample PIN only and does not pair a real device.
The dashboard receives two simulated orders: the first after six seconds and the
second ten seconds later. Leaving the dashboard cancels the pending timer;
returning restarts that delay without replaying orders already delivered. Refresh
the page to replay the demonstration.
Run `node scripts/demo-smoke.mjs` to check the offline service and store workflows.

## Quick Start

### First Time Setup
```bash
npm i
npm run dev
```

The app will run in development mode using Vite. Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

The page will reload if you make edits, and lint errors will appear in the console.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production (optimized & minified) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview the production build locally |

## Branch Management & Git Workflow

> ⚠️ **Important:** Always push changes to the **dev branch** first
- **main branch** = latest stable release (used for pipelines)
- **dev branch** = active development
- Merge dev → main only after rigorous testing in a controlled manner