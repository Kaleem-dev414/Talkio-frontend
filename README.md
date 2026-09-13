# Talkio Frontend

Professional React + Vite client for Talkio.

## Setup

```powershell
npm install
npm run dev
```

Create `.env` when the backend is not on the same origin:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL` to the deployed backend API URL.

## Build

```powershell
npm run build
```

The production output is created in `dist/`.
