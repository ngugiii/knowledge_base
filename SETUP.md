# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm installed

## Installation Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Install Playwright browsers (for testing):**
```bash
npx playwright install
```

## Running the Application

### Option 1: Using Two Terminals

**Terminal 1 - Start the mock API:**
```bash
npm run api
```

**Terminal 2 - Start the Next.js app:**
```bash
npm run dev
```

### Option 2: Using a Process Manager (Recommended)

If you have `concurrently` installed globally:
```bash
npm install -g concurrently
concurrently "npm run api" "npm run dev"
```

Or add it to your project:
```bash
npm install -D concurrently
```

Then add this script to `package.json`:
```json
"dev:all": "concurrently \"npm run api\" \"npm run dev\""
```

Then run:
```bash
npm run dev:all
```

## Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

## Testing

Run Playwright tests:
```bash
npm test
```

For interactive testing:
```bash
npm run test:ui
```

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is already in use:
- Change the port in `next.config.ts` for Next.js
- Change the port in `package.json` for json-server (in the `api` script)

### API Connection Issues
- Ensure the API server is running on port 3001
- Check that `data/db.json` exists
- Verify the API URL in browser console

### Playwright Tests Failing
- Ensure both servers are running before tests
- Run `npx playwright install` to install browsers
- Check that the API server is accessible

