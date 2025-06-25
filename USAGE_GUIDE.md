# Usage Guide - YouTube Speed Extender

## Quick Start

1. **Install the Extension**
   - Load the unpacked extension in Chrome
   - Navigate to any YouTube video

2. **Basic Speed Control**
   - Press `.` (period) to increase speed
   - Press `,` (comma) to decrease speed
   - See the current speed in the custom overlay

3. **Navigation Behavior**
   - **Automatic**: The extension always remembers the last speed you set with keyboard shortcuts
   - **Persistent**: When you navigate to new videos, they start at your keyboard-set speed
   - Press `Ctrl+Shift+S` to view current settings and test behavior

## How It Works

### Keyboard Speed Persistence
- **What it does**: The extension automatically saves whatever speed you set using the `.` and `,` keyboard shortcuts
- **Navigation**: When you navigate to any new video, it will start at the last speed you set with the keyboard
- **Example**: Set speed to 1.5x using `.` key → Navigate to new video → New video starts at 1.5x
- **Always Active**: This behavior is always enabled - no configuration needed

### Speed Sources
- **Keyboard Speed** (`.` and `,` keys): ✅ **Saved for navigation** - becomes the default for new videos
- **YouTube Menu Speed**: Used for current video only - doesn't affect navigation
- **Extension Menu Speed**: Used for current video only - doesn't affect navigation

## Tips and Tricks

### Keyboard Shortcuts
- **Speed Control**: Use `.` and `,` keys for quick adjustments
- **Settings**: Use `Ctrl+Shift+S` to quickly access settings
- **YouTube Native**: You can still use YouTube's built-in speed controls - they all sync together

### Settings Modal Features
- **Current Speed Display**: Shows your current keyboard-set speed that will be used for navigation
- **Test Navigation**: Click "Test Navigation Speed" to immediately apply your keyboard-set speed to the current video
- **Information**: View details about how keyboard speed persistence works
- **Toggle Behavior**: Press `Ctrl+Shift+S` again to close the modal, or click outside it

### Speed Range
- **Available Speeds**: 0.5x, 1x, 1.25x, 1.5x, 1.75x, 2x, 2.25x, 2.5x, 2.75x, 3x, 3.25x, 3.5x, 3.75x, 4x, 4.25x, 4.5x, 4.75x, 5x
- **Beyond YouTube Default**: YouTube normally only goes up to 2x - this extension extends it to 5x
- **Precision Control**: More speed options than YouTube's default settings

### Persistence
- **Keyboard Speed Saved**: Your keyboard-set speed (using . and , keys) is automatically saved and used for all navigation
- **Cross-Session**: Your keyboard speed persists across browser sessions
- **Per-Browser**: Settings are stored per browser profile

## Troubleshooting

### Modal Not Appearing
- Make sure you're on a YouTube page
- Check that you're pressing `Ctrl+Shift+S` (not just `Ctrl+S`)
- Try refreshing the page if the extension just loaded

### Speed Not Changing
- Ensure you're focused on the main page (not in a comment box or search field)
- Make sure there's a video player on the page
- Try clicking on the video first to ensure it's focused

### Settings Not Saving
- Make sure to click "Save Settings" in the modal
- Check for any browser popup blockers that might interfere
- Settings are stored in localStorage, so clearing browser data will reset them

### Navigation Settings Not Working
- **Test First**: Use the "Test Navigation Speed" button in settings to see your current keyboard-set speed
- **Check Debug Info**: When speed changes, the overlay will show the source (e.g., "keyboard", "saved", "test")
- **Set Keyboard Speed**: Use `.` or `,` keys to set your preferred speed, then navigate to test
- **Multiple Navigation Test**: Test by navigating between 2-3 videos to ensure consistent behavior

### Keyboard Speed Not Saving
- **Use Keyboard Shortcuts**: Only speeds set with `.` and `,` keys are saved for navigation
- **Check Overlay**: Look for "keyboard (saved)" overlay when changing speed with keys
- **Menu vs Keyboard**: Speeds set via YouTube menu or extension menu don't affect navigation
- **Test Navigation**: Use the test button in settings to verify your current keyboard speed

## Advanced Usage

### Combining with YouTube Features
- **Playlists**: Your navigation settings work with autoplay and playlists
- **Suggestions**: Settings apply when clicking on suggested videos
- **Search Results**: Navigation behavior applies to videos opened from search

### Browser Compatibility
- **Chrome**: Full support (primary target)
- **Edge**: Should work with Chromium-based Edge
- **Other Browsers**: May work with browsers that support Chrome extensions

### Performance
- **Lightweight**: Minimal resource usage
- **No Background Scripts**: Only runs when on YouTube
- **Efficient**: Uses modern web APIs for optimal performance
