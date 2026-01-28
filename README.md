# Time Tracker

[![Build Status](https://img.shields.io/github/actions/workflow/status/devopsdina/local-customer-time-tracker/release.yml?style=flat-square&label=Build)](https://github.com/devopsdina/local-customer-time-tracker/actions)
[![Latest Release](https://img.shields.io/github/v/release/devopsdina/local-customer-time-tracker?style=flat-square&label=Latest%20Version)](https://github.com/devopsdina/local-customer-time-tracker/releases/latest)
[![License](https://img.shields.io/github/license/devopsdina/local-customer-time-tracker?style=flat-square)](LICENSE)

A lightweight, local time tracking application built with Tauri, React, and TypeScript. Track time spent on customer engagements with a compact, always-on-top UI.


## Installation

### macOS

Since the app is not signed with an Apple Developer certificate, macOS will block it by default. Follow these steps:

1. **Download** the `.dmg` file for your Mac (Apple Silicon or Intel)

    | Platform | Download |
    |----------|----------|
    | **macOS (Apple Silicon)** M1/M2/M3 | [![Download](https://img.shields.io/badge/Download-aarch64.dmg-blue?style=flat-square&logo=apple)](https://github.com/devopsdina/local-customer-time-tracker/releases/latest) |
    | **macOS (Intel)** | [![Download](https://img.shields.io/badge/Download-x64.dmg-blue?style=flat-square&logo=apple)](https://github.com/devopsdina/local-customer-time-tracker/releases/latest) |
2. **Open** the `.dmg` and drag Time Tracker to your **Applications** folder
3. **Run the fix script** (do this BEFORE opening the app for the first time):

    ```bash
    curl -sSL https://raw.githubusercontent.com/devopsdina/local-customer-time-tracker/main/fix-macos.sh | bash
    ```

    Or manually run:
    ```bash
    xattr -cr /Applications/Time\ Tracker.app
    ```

4. **Open** Time Tracker from your Applications folder

### Windows

1. Download and run the `.exe` installer. 

2. Windows may show a SmartScreen warning - click "More info" → "Run anyway".

    | Platform | Download |
    |----------|----------|
    | **Windows** | [![Download](https://img.shields.io/badge/Download-x64--setup.exe-blue?style=flat-square&logo=windows)](https://github.com/devopsdina/local-customer-time-tracker/releases/latest) |

### Linux

1. Download the `.deb` and install:
    ```bash
    sudo dpkg -i Time.Tracker_*.deb
    ```

    Or use the `.AppImage` (make executable first: `chmod +x *.AppImage`)

    | Platform | Download |
    |----------|----------|
    | **Linux (Debian/Ubuntu)** | [![Download](https://img.shields.io/badge/Download-amd64.deb-blue?style=flat-square&logo=linux)](https://github.com/devopsdina/local-customer-time-tracker/releases/latest) |
    | **Linux (Other)** | [![Download](https://img.shields.io/badge/Download-amd64.AppImage-blue?style=flat-square&logo=linux)](https://github.com/devopsdina/local-customer-time-tracker/releases/latest) |

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
