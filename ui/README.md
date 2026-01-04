# Avatar-DB Web UI

A modern, local-first interface for the `avatar-db` parametric prompt system.

## Features
- **Module Editor**: Visual JSON editing with built-in linting.
- **Prompt Builder**: Compose prompts via dropdowns and preview merged results.
- **Batch Processing**: Run presets and view generated manifests.
- **System Audit**: Run global linting across the entire database.

## Setup & Development

### Prerequisites
- Node.js 18+
- Python 3.11+ (reachable via `python3`)

### Installation
1. Navigate to the UI directory:
   ```bash
   cd ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Architecture
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Components**: Lucide icons, Monaco Editor
- **Backend**: Next.js API routes calling Python CLI via `execSync`
- **Data**: Local filesystem (no database)
