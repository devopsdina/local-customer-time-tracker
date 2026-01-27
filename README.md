# Time Tracker

A lightweight, local time tracking application built with Tauri, React, and TypeScript. Track time spent on customer engagements with a compact, always-on-top UI.

## Download

[![Download Latest Release](https://img.shields.io/badge/Download-Latest%20Release-blue?style=for-the-badge&logo=github)](https://github.com/devopsdina/local-customer-time-tracker/releases/latest)

**Available formats:**
- **macOS**: `.dmg` (Apple Silicon & Intel)
- **Windows**: `.exe` or `.msi`
- **Linux**: `.deb` or `.AppImage`



## Features

- Track time for multiple customers
- Customer management with engagement types and initial hours
- Visual hours remaining with progress bar
- Time log history with CSV export
- Idle detection with configurable timeout
- Dark/Light mode
- Always-on-top window option
- Auto-save on app close

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Rust](https://www.rust-lang.org/tools/install)
- Platform-specific dependencies:
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev`
  - **Windows**: Microsoft Visual Studio C++ Build Tools

### Install Dependencies

```bash
npm install
```

### Run in Development

```bash
npm run tauri:dev
```

### Build for Production

```bash
npm run tauri:build
```

Built artifacts will be in `src-tauri/target/release/bundle/`:
- **macOS**: `.dmg` and `.app`
- **Windows**: `.msi` and `.exe`
- **Linux**: `.deb` and `.AppImage`

## Data Storage

All data is stored locally in `~/.local-time-tracker/`:
- `customers.json` - Customer information
- `settings.json` - App settings
- `logs/` - Time logs per customer

## CI/CD

The project includes a GitHub Actions workflow that automatically builds release artifacts for macOS (Intel & Apple Silicon), Windows, and Linux when:
- Pushing to `main` branch
- Creating a version tag (e.g., `v1.0.0`)

Draft releases are created automatically with downloadable installers attached.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Zustand
- **Backend**: Rust, Tauri v2
- **UI Components**: shadcn/ui (Radix UI)
