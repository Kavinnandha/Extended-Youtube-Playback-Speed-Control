# Installation Guide

This guide provides detailed installation instructions for the YouTube Speed Extender Chrome extension.

## 📋 Requirements

### System Requirements
- **Chrome Browser**: Version 88 or higher
- **Operating System**: Windows, macOS, or Linux
- **Permissions**: Ability to install extensions (not restricted by enterprise policy)

### Alternative Browsers
- **Microsoft Edge**: Chromium-based versions (Version 88+)
- **Brave Browser**: Version 1.20 or higher
- **Other Chromium browsers**: Most modern Chromium-based browsers

## 🚀 Installation Methods

### Method 1: Chrome Web Store (Recommended)
*Coming soon - extension is currently in development*

1. **Visit** the Browser Web Store
2. **Search** for "YouTube Speed Extender" 
3. **Click** "Add to Browser"
4. **Confirm** by clicking "Add extension"
5. **Pin** the extension to your toolbar (optional)

### Method 2: Manual Installation (Developer Mode)

#### Step 1: Download the Extension
**Option A: Download ZIP**
1. Go to the [GitHub repository](https://github.com/kavinnandha/Youtube-Playback-Speed-Customization)
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a folder

**Option B: Clone Repository**
```bash
git clone https://github.com/yourusername/Youtube-Playback-Speed-Customization.git
cd Youtube-Playback-Speed-Customization
```

#### Step 2: Enable Developer Mode
1. **Open Chrome** and navigate to `/extensions/`
2. **Toggle "Developer mode"** in the top-right corner
3. **Verify** that additional buttons appear (Load unpacked, Pack extension, Update)

#### Step 3: Load the Extension
1. **Click "Load unpacked"** button
2. **Navigate** to the folder containing the extension files
3. **Select** the folder and click "Select Folder" (Windows) or "Open" (macOS/Linux)
4. **Verify** the extension appears in your extensions list

#### Step 4: Verify Installation
1. **Check** that the extension is enabled (toggle should be blue)
2. **Pin** the extension to your toolbar for easy access
3. **Navigate** to YouTube to test functionality

## ⚙️ Configuration

### Initial Setup
1. **Go to YouTube** in your browser
2. **Open any video**
3. **Test keyboard shortcuts**:
   - Press `.` to increase speed
   - Press `,` to decrease speed
4. **Open settings** with `Ctrl+Shift+S`

### Recommended Settings
For first-time users, we recommend:
- **Navigation Mode**: Continue (maintains speed across videos)
- **Keyboard Shortcuts**: Keep defaults (. and ,)
- **Custom Speed**: 1.5x (if using Custom navigation mode)

## 🔧 Advanced Installation

### Enterprise/Managed Environments

If you're in a managed environment (work/school), you may need:

1. **Administrator approval** for extension installation
2. **Policy exceptions** for developer mode
3. **Alternative browsers** if Chrome is locked down

**Contact your IT administrator** if you encounter restrictions.

### Multiple Browser Setup

To install on multiple browsers:

1. **Repeat installation process** for each browser
2. **Note**: Settings are stored per-browser and don't sync
3. **Configure separately** in each browser

### Development Installation

For developers wanting to modify the extension:

```bash
# Clone the repository
git clone https://github.com/yourusername/Youtube-Playback-Speed-Customization.git

# Navigate to the directory
cd Youtube-Playback-Speed-Customization

# Open in your preferred editor
code .  # VS Code
# or
vim .   # Vim
# or
nano .  # Nano
```

## 🛠️ Troubleshooting Installation

### Common Issues

#### "Developer mode is not enabled"
**Solution**: Follow Step 2 above to enable Developer mode

#### "Failed to load extension"
**Possible causes and solutions**:
- **Manifest errors**: Check that `manifest.json` is valid
- **File permissions**: Ensure folder is readable
- **Missing files**: Verify all required files are present

#### "Extension not working on YouTube"
**Solutions**:
1. **Refresh** the YouTube page after installation
2. **Check permissions** in extension details
3. **Disable conflicting extensions** temporarily
4. **Restart browser** and try again

#### "Keyboard shortcuts not working"
**Solutions**:
1. **Check** that you're not in an input field
2. **Verify** extension is enabled
3. **Test** on a fresh YouTube tab
4. **Check** for keyboard shortcut conflicts in Chrome settings

### Verification Checklist

After installation, verify these features work:
- [ ] Extension appears in `/extensions/`
- [ ] Extension icon visible in toolbar (if pinned)
- [ ] Keyboard shortcuts work on YouTube (. and ,)
- [ ] Settings modal opens with `Ctrl+Shift+S`
- [ ] Speed overlay appears when changing speed
- [ ] Speed persists when navigating between videos

### Getting Help

If you continue to have issues:

1. **Check** the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. **Review** existing [GitHub Issues](https://github.com/kavinnandha/Youtube-Playback-Speed-Customization/issues)
3. **Create** a new issue with details about your problem
4. **Include** your Chrome version, OS, and error messages

## 📱 Mobile Installation

### Chrome Mobile (Android)
**Not supported** - Chrome extensions are not available on mobile devices

### Alternative Solutions for Mobile
- Use YouTube Premium's variable speed feature
- Use third-party YouTube apps with speed control
- Use browser-based solutions (limited functionality)

## 🔄 Updating the Extension

### Automatic Updates (Chrome Web Store)
Extensions from the Chrome Web Store update automatically.

### Manual Updates (Developer Mode)
1. **Download** the latest version
2. **Extract** to the same folder (overwrite existing files)
3. **Click** the refresh icon in `/extensions/`
4. **Verify** the new version number

### Checking Your Version
1. Go to `/extensions/`
2. Find "YouTube Speed Extender"
3. Version number is displayed under the extension name

## 🗑️ Uninstallation

### Complete Removal
1. **Go to** `/extensions/`
2. **Find** YouTube Speed Extender
3. **Click** "Remove"
4. **Confirm** removal
5. **Optional**: Clear stored data by going to YouTube and clearing site data

### Removing Stored Data
If you want to completely reset all settings:
1. **Go to** YouTube
2. **Open** Developer Tools (`F12`)
3. **Go to** Application tab → Storage → Local Storage
4. **Delete** entries starting with `youtube-speed-extender-`

## 🔒 Privacy and Permissions

### Required Permissions
- **activeTab**: Allows the extension to interact with the current YouTube tab
- **No network permissions**: Extension works entirely offline

### Data Storage
- **Local only**: All settings stored in browser's local storage
- **No external servers**: No data sent to external services
- **No tracking**: Extension doesn't track usage or personal data

### Security Considerations
- **Open source**: Code is publicly available for review
- **Minimal permissions**: Only requests necessary permissions
- **No external dependencies**: Doesn't load external scripts

---

## 📞 Support

### Documentation
- **Main README**: Overview and basic usage
- **API Documentation**: Technical implementation details
- **Contributing Guide**: For developers wanting to contribute

### Community
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community help

### Contact
- **Email**: kavinnandhakavin@gmail.com
- **GitHub**: [@kavinnandha](https://github.com/kavinnandha)

---

*Installation guide last updated: June 25, 2025*
