# YouTube Playback Speed Extender

A Chrome extension that extends YouTube's playback speed options beyond the default range and provides keyboard shortcuts for quick speed adjustments.

## Features

- **Extended Speed Options**: Access playback speeds from 0.5x to 5x (0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
- **Keyboard Shortcuts**: 
  - Press `.` (period) to increase speed
  - Press `,` (comma) to decrease speed
- **Custom Overlay**: Shows current playback speed when changed via keyboard
- **Complete Menu Integration**: Synchronizes with and enhances YouTube's built-in speed menu
- **Real-time Menu Updates**: Keeps all player menus updated with current speed
- **Bidirectional Sync**: Changes made via any method update all interfaces
- **Smart Navigation**: Automatically reinjects functionality when navigating between YouTube videos

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension will now be active on YouTube

## Usage

### Keyboard Shortcuts
- Navigate to any YouTube video
- Use `.` to increase playback speed
- Use `,` to decrease playback speed
- The current speed will be displayed in a custom overlay

### Menu Interface
- Click on the settings gear icon in the YouTube player
- Select "Playback speed" to see the enhanced speed options (0.5x to 5x)
- Click any speed to apply it instantly
- Changes made via the menu will also update the keyboard shortcut state
- Changes made via keyboard shortcuts will update the menu selection

## Technical Details

- **Manifest Version**: 3
- **Permissions**: `activeTab` only
- **Content Script**: Runs on all YouTube pages
- **No Background Scripts**: Minimal resource usage

## Compatibility

- Works on all YouTube pages (`*.youtube.com/*`)
- Compatible with Chrome's Manifest V3
- Handles YouTube's single-page application navigation
- Respects user input fields (won't interfere with typing)

## Files

- `manifest.json`: Extension configuration
- `content.js`: Main functionality and YouTube integration
- `icons/`: Directory containing extension icons (16px, 48px, 128px)
- `README.md`: This documentation

## Privacy

This extension:
- Only runs on YouTube pages
- Does not collect any user data
- Does not make external network requests
- Uses minimal permissions (`activeTab` only)

## Troubleshooting

If the extension stops working:
1. Refresh the YouTube page
2. Check if the extension is enabled in Chrome extensions
3. Try disabling and re-enabling the extension

## Version History

- **v1.3**: Improved menu synchronization with settings panel updates
- **v1.2**: Added native YouTube speed menu synchronization and enhancement
- **v1.1**: Improved error handling, better overlay positioning, enhanced navigation support
- **v1.0**: Initial release with basic functionality
