# Plan of the Day — Lineman Foreman App

A mobile-first Progressive Web App (PWA) for lineman foremen to create, save, and print daily construction plans.

## Features

- **All fields for daily planning**: Date, Weather, Project #/Name, Location, Safety Talk Topic, Work Performed (previous day), Work Planned (today), Equipment, Crew, Out of Scope Work, Notes
- **Works on iOS, Android, and Desktop** — any modern browser
- **Installable as a PWA** — add to home screen for app-like experience
- **Works offline** — service worker caches the app after first load
- **Save & load plans** — plans stored locally on the device
- **Copy to New Plan** — clone a previous day's plan and update for today
- **Print / Save as PDF** — clean print layout with no buttons or controls

## Setup

```bash
npm install
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
```

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3
- vite-plugin-pwa (Workbox)
- No backend — all data stored in browser localStorage
