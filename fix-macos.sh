#!/bin/bash

# Fix for macOS "damaged app" warning
# Run this AFTER installing Time Tracker to Applications, but BEFORE opening it

echo "🔧 Fixing Time Tracker for macOS..."

APP_PATH="/Applications/Time Tracker.app"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Error: Time Tracker not found in /Applications"
    echo "   Please drag Time Tracker.app to your Applications folder first."
    exit 1
fi

echo "📍 Found Time Tracker at: $APP_PATH"
echo "🔓 Removing quarantine flag..."

xattr -cr "$APP_PATH"

if [ $? -eq 0 ]; then
    echo "✅ Success! You can now open Time Tracker from your Applications folder."
else
    echo "❌ Failed to remove quarantine. Try running with sudo:"
    echo "   sudo xattr -cr \"$APP_PATH\""
    exit 1
fi
