# YouTube Speed Extender

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

An advanced Browser extension that provides enhanced playback speed control for YouTube videos with extended speed options, keyboard shortcuts, and intelligent speed persistence.

## ✨ Features

### 🎯 Extended Speed Range
- **10 Speed Options**: 0.5x, 1x, 1.5x, 2x, 2.5x, 3x, 3.5x, 4x, 4.5x, 5x
- **Seamless Integration**: Works with YouTube's native speed controls
- **Real-time Synchronization**: Updates YouTube's settings menu in real-time

### ⌨️ Keyboard Controls
- **Customizable Shortcuts**: Configure your own increase/decrease speed keys
- **Default Keys**: 
  - `.` (period) - Increase speed
  - `,` (comma) - Decrease speed
  - `Ctrl+Shift+S` - Open settings modal
- **Visual Feedback**: On-screen overlay shows current speed when changed
- **Smart Input Detection**: Ignores keypresses in input fields and editable content

### 🧠 Intelligent Speed Management
- **Speed Persistence**: Remembers your preferred speed across videos
- **Navigation Modes**: Three different behaviors for new videos:
  - **Continue**: Maintain current speed when navigating to new videos
  - **Default**: Always start new videos at 1x speed
  - **Custom**: Start new videos at a specific speed of your choice
- **Seeking Compatibility**: Maintains speed after video seeking operations

### 🎛️ Advanced Settings
- **Settings Modal**: Comprehensive settings interface accessible via `Ctrl+Shift+S`
- **Visual Confirmation**: Success notifications when settings are saved
- **Persistent Storage**: All preferences saved locally and persist across browser sessions

## 🚀 Installation

### From Chrome Web Store
*Coming soon - extension is currently in development*

### Manual Installation (Developer Mode)
1. **Download** or clone this repository
2. **Open Browser** and navigate to `//extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

## 📖 Usage Guide

### Basic Speed Control
1. **Navigate** to any YouTube video
2. **Use keyboard shortcuts** to change speed:
   - Press `.` to increase speed
   - Press `,` to decrease speed
3. **Visual feedback** will show the current speed
4. **Speed persists** across video navigation based on your settings

### Accessing Settings
1. **Press `Ctrl+Shift+S`** while on YouTube, or
2. **Use the extension's settings** from the Chrome toolbar
3. **Configure navigation behavior** and custom shortcuts
4. **Save settings** to apply changes

### Navigation Modes

#### Continue Mode (Default)
- Maintains whatever speed you were using on the previous video
- Best for consistent viewing experience

#### Default Mode
- Always starts new videos at 1x (normal) speed
- Useful if you want to manually set speed for each video

#### Custom Mode
- Starts all new videos at a specific speed you choose
- Perfect for users who prefer a consistent non-standard speed

## 🔧 Configuration Options

### Speed Settings
| Option | Description | Default |
|--------|-------------|---------|
| Navigation Mode | How speed behaves on new videos | Continue |
| Custom Speed | Fixed speed for Custom mode | 1x |

### Keyboard Shortcuts
| Action | Default Key | Customizable |
|--------|-------------|--------------|
| Increase Speed | `.` (period) | ✅ |
| Decrease Speed | `,` (comma) | ✅ |
| Open Settings | `Ctrl+Shift+S` | (Fixed) |

## 🏗️ Technical Architecture

### Core Components

#### Speed Management System
- **Speed Options Array**: Predefined speed values (0.5x - 5x)
- **State Management**: Prevents recursive updates and conflicts
- **Storage Integration**: Local storage for persistence

#### Event Handling
- **Keyboard Events**: Custom key mapping with input field detection
- **Video Events**: Rate change and seeking event listeners
- **Navigation Detection**: URL change monitoring for SPA navigation

#### UI Integration
- **Settings Modal**: Feature-rich configuration interface
- **Speed Overlay**: Temporary visual feedback for speed changes
- **Menu Synchronization**: Real-time updates to YouTube's native controls

### Browser Compatibility
- **Chrome**: Full support (Manifest V3)
- **Edge**: Compatible with Chromium-based versions
- **Firefox**: Planned support (Manifest V2 version in development)

## 🗂️ Project Structure

```
Custom-Youtube-Playback-Speed-Control/
├── manifest.json           # Extension manifest (v3)
├── content.js              # Main content script
├── icons/                  # Extension icons
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
├── README.md              # This documentation
├── API.md                 # API documentation
├── CONTRIBUTING.md        # Contribution guidelines
└── docs/                  # Additional documentation
    ├── INSTALLATION.md    # Detailed installation guide
    ├── TROUBLESHOOTING.md # Common issues and solutions
    └── CHANGELOG.md       # Version history
```

## 🐛 Troubleshooting

### Common Issues

#### Extension Not Working
1. **Refresh** the YouTube page
2. **Check** if extension is enabled in `chrome://extensions/`
3. **Restart** Chrome browser
4. **Reinstall** the extension if issues persist

#### Keyboard Shortcuts Not Responding
1. **Ensure** you're not in an input field
2. **Check** custom key settings in the extension settings
3. **Verify** no other extensions are conflicting

#### Speed Not Persisting
1. **Check** your navigation mode settings
2. **Ensure** local storage is enabled in your browser
3. **Try** switching navigation modes and back

### Performance Considerations
- Extension uses minimal resources and doesn't affect video performance
- Settings are stored locally - no external network requests
- Event listeners are optimized to prevent conflicts with YouTube's code

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup
1. **Clone** the repository
2. **Load** in Chrome as unpacked extension
3. **Make changes** to `content.js`
4. **Reload** extension in Chrome to test changes

### Reporting Issues
- Use the GitHub Issues tab
- Provide detailed reproduction steps
- Include Browser version and extension version

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- YouTube for providing a robust video platform
- The Browser Extensions API documentation
- Community feedback and feature requests

## 📞 Support

- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Check the `docs/` folder for detailed guides
- **Email**: kavinnandhakavin@gmail.com

---

**Made with ❤️ for YouTube power users**

*Last updated: June 25, 2025*
