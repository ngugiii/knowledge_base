# Manufacturing Technicians Knowledge Base

A knowledge capture interface for manufacturing technicians. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Create, read, update, and delete knowledge entries
- Image upload with preview and validation
- Responsive design that works on mobile and desktop
- Dark mode support
- Toast notifications for user feedback
- Form validation with error messages
- End-to-end tests with Playwright

## Getting Started

### Prerequisites

You'll need Node.js 18 or higher and npm installed.

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd manufacturing_technicians_frontend
npm install
```

### Running the Application

This project uses json-server as a mock API. You need to run two servers:

1. Start the API server (runs on port 3001):
```bash
npm run api
```

2. In a separate terminal, start the Next.js dev server (runs on port 3000):
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

The API server uses `data/db.json` as the database file.

### Building for Production

```bash
npm run build
npm start
```

## Testing

Run the Playwright tests:

```bash
npm test

npm run test:ui

npm run test:headed
```

The test suite covers:
- Adding new entries
- Editing existing entries
- Deleting entries
- Form validation
- Empty state handling

## Project Structure

```
app/                    # Next.js app directory
  page.tsx              # Main dashboard
  layout.tsx            # Root layout
  globals.css           # Global styles and theme variables

components/             # React components
  KnowledgeEntryCard.tsx
  KnowledgeEntryForm.tsx
  Modal.tsx
  Toast.tsx
  SkeletonLoader.tsx
  ThemeToggle.tsx
  ConfirmationModal.tsx

hooks/                  # Custom hooks
  useKnowledgeEntries.ts

lib/                    # Utilities
  api.ts                # API client
  utils.ts              # Helper functions

types/                  # TypeScript definitions
  index.ts

data/                   # Mock data
  db.json               # JSON server database

tests/                  # E2E tests
  knowledge-entries.spec.ts
```

## API Endpoints

The mock API runs on http://localhost:3001

- `GET /knowledge-entries` - Get all entries
- `GET /knowledge-entries/:id` - Get a single entry
- `POST /knowledge-entries` - Create a new entry
- `PATCH /knowledge-entries/:id` - Update an entry
- `DELETE /knowledge-entries/:id` - Delete an entry

Request body for POST/PATCH:
```json
{
  "title": "string",
  "description": "string",
  "image": "string (base64, optional)"
}
```

## Technology Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- JSON Server (mock API)
- Playwright (testing)
- Lucide React (icons)

## Design Notes

The interface is built mobile-first with touch-friendly interactions. It includes:

- Skeleton loaders for loading states
- Smooth animations and transitions
- Dark mode with theme switching
- Responsive grid layouts
- Optimized image loading with Next.js Image component
- Keyboard navigation support (Escape to close modals)
- Accessible markup with ARIA labels

## Development Notes

The project uses a theme system with CSS variables defined in `globals.css`. Colors automatically adapt between light and dark modes. All components use semantic color tokens (background, foreground, card, primary, secondary, etc.) instead of hardcoded colors.

The API layer is abstracted in `lib/api.ts`, making it easy to swap out json-server for a real backend later.
