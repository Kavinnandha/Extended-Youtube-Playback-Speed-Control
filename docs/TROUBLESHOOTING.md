# Troubleshooting Guide

This guide helps you resolve common issues with the YouTube Speed Extender extension.

## 🚨 Quick Solutions

### Try These First
1. **Refresh the YouTube page** (`F5` or `Ctrl+R`)
2. **Restart your browser** completely
3. **Check extension is enabled** in `/extensions/`
4. **Test on a different YouTube video**

## 🔧 Common Issues

### Extension Not Working

#### Symptoms
- Keyboard shortcuts don't respond
- Speed doesn't change when pressing keys
- Settings modal doesn't open

#### Solutions

**Check Extension Status**
1. Go to `/extensions/`
2. Find "YouTube Speed Extender"
3. Ensure the toggle is **enabled** (blue)
4. If disabled, click to enable

**Reload Extension**
1. In `/extensions/`
2. Click the **refresh icon** on the extension card
3. Go back to YouTube and test

**Check for Conflicts**
1. **Disable other extensions** temporarily
2. Test if YouTube Speed Extender works
3. Re-enable extensions one by one to identify conflicts

**Common Conflicting Extensions:**
- Other YouTube speed controllers
- Keyboard shortcut managers
- Video enhancement extensions
- Ad blockers (rarely, but possible)

### Keyboard Shortcuts Not Working

#### Symptoms
- Pressing `.` or `,` doesn't change speed
- No speed overlay appears
- Settings shortcut (`Ctrl+Shift+S`) doesn't work

#### Diagnostic Steps

**Check Current Focus**
- Are you typing in a search box, comment field, or other input?
- Click elsewhere on the page (but not on YouTube controls)
- Try the shortcuts again

**Verify Keys**
1. Open settings with `Ctrl+Shift+S`
2. Check what keys are configured
3. Try using the configured keys

**Test Different Scenarios**
- Try on different YouTube videos
- Try in different browser tabs
- Try with video paused vs playing

#### Solutions

**Input Field Detection**
- Click somewhere neutral on the page (video area, but not on controls)
- Wait a moment, then try shortcuts
- Avoid clicking in comment sections or search boxes

**Keyboard Shortcut Conflicts**
1. Check Chrome's keyboard shortcuts: `/extensions/shortcuts`
2. Look for conflicts with other extensions
3. Change conflicting shortcuts or disable conflicting extensions

**Reset Shortcuts**
1. Open extension settings (`Ctrl+Shift+S`)
2. Set increase key back to `.`
3. Set decrease key back to `,`
4. Save and test

### Speed Not Persisting

#### Symptoms
- Speed resets to 1x when navigating between videos
- Speed doesn't save across browser sessions
- Custom navigation settings not working

#### Check Navigation Mode
1. Open settings (`Ctrl+Shift+S`)
2. Check which navigation mode is selected:
   - **Continue**: Should maintain current speed
   - **Default**: Always starts at 1x (normal behavior)
   - **Custom**: Should use your custom speed
3. Change mode if needed and save

#### Storage Issues
**Check Local Storage**
1. Go to YouTube
2. Open Developer Tools (`F12`)
3. Go to Application tab → Storage → Local Storage
4. Look for entries starting with `youtube-speed-`
5. If missing, settings aren't being saved

**Clear and Reset Storage**
1. Delete all `youtube-speed-` entries
2. Reload the page
3. Reconfigure settings

### Settings Modal Issues

#### Symptoms
- Settings modal doesn't open with `Ctrl+Shift+S`
- Settings don't save
- Modal appears corrupted or missing elements

#### Solutions

**Modal Not Opening**
1. Make sure you're on a YouTube page
2. Try clicking elsewhere first, then the shortcut
3. Check console for JavaScript errors (`F12` → Console)

**Settings Not Saving**
1. Check if local storage is enabled in browser
2. Ensure you're clicking "Save Settings" not "Cancel"
3. Look for confirmation message (green notification)

**Visual Issues**
1. Check if other extensions are interfering with CSS
2. Try disabling ad blockers temporarily
3. Zoom browser to 100% (extensions may have layout issues at other zoom levels)

### YouTube Integration Issues

#### Symptoms
- Extension works but YouTube's native speed menu shows wrong values
- Speed overlay shows different value than YouTube controls
- Extension conflicts with YouTube's built-in features

#### Solutions

**Menu Synchronization**
1. Open YouTube's speed settings (gear icon → Playback speed)
2. Change speed using YouTube's controls
3. Check if extension recognizes the change
4. Try changing speed with extension shortcuts

**Force Menu Update**
1. Change speed with extension shortcuts
2. Open YouTube's settings menu
3. Close and reopen the menu
4. Values should synchronize

**Clear YouTube Cache**
1. Go to `/settings/content/all`
2. Search for "youtube.com"
3. Click on YouTube entry
4. Clear storage data
5. Reload YouTube

### Performance Issues

#### Symptoms
- YouTube becomes slow or unresponsive
- High CPU usage when extension is active
- Video playback stutters

#### Solutions

**Disable Debug Features**
- No user-configurable debug features, but you can:
1. Check browser console for excessive logging
2. Report performance issues on GitHub

**Reduce Extension Load**
- Extension is lightweight, but try:
1. Using fewer speed changes per video
2. Closing other browser tabs
3. Disabling other extensions temporarily

## 🛠️ Advanced Troubleshooting

### Developer Tools Debugging

#### Check Console Errors
1. Open YouTube
2. Press `F12` to open Developer Tools
3. Go to Console tab
4. Try using extension features
5. Look for red error messages

**Common Error Types:**
- `Permission denied`: Browser security issue
- `Cannot read property of null`: Element not found
- `Storage quota exceeded`: Local storage full

#### Network Tab Analysis
1. Open Developer Tools → Network tab
2. Use extension features
3. Look for failed requests (red entries)
4. Extension should not make network requests

#### Application Tab Storage
1. Developer Tools → Application tab
2. Expand Local Storage → youtube.com
3. Look for extension keys starting with `youtube-speed`
4. Check if values are being saved/updated

### Manifest and Permission Issues

#### Check Extension Details
1. Go to `/extensions/`
2. Click "Details" on YouTube Speed Extender
3. Check permissions granted
4. Verify "Allow access to file URLs" if needed

#### Permission Problems
- Extension only needs `activeTab` permission
- If permission requests appear, review carefully
- Genuine extension won't ask for broad permissions

### Browser-Specific Issues

#### Chrome Issues
- **Incognito mode**: Extension may be disabled by default
- **Enterprise managed**: May be blocked by policy
- **Beta/Dev channels**: May have compatibility issues

#### Edge Issues
- **Extension compatibility**: Should work like Chrome
- **Security features**: May block some functionality

#### Brave Browser Issues
- **Shield settings**: May interfere with extension
- **Privacy features**: Could block localStorage

### Extension Conflicts

#### Common Conflicting Extensions
- **Video Speed Controller**: Direct functionality overlap
- **Enhancer for YouTube**: May modify same DOM elements
- **uBlock Origin**: Rarely blocks extension scripts
- **Grammarly**: Can interfere with keyboard events

#### Identifying Conflicts
1. Disable all other extensions
2. Test YouTube Speed Extender alone
3. Re-enable extensions one by one
4. Note when problem returns

#### Resolving Conflicts
- **Use only one speed control extension**
- **Configure conflicting extensions to exclude YouTube**
- **Adjust keyboard shortcuts to avoid conflicts**

## 📊 System Information for Bug Reports

When reporting issues, include:

### Browser Information
```
Chrome Version: [Get from chrome://version/]
Operating System: [Windows 10, macOS Big Sur, Ubuntu 20.04, etc.]
Extension Version: [From chrome://extensions/]
```

### Error Information
```
Console Errors: [Copy from F12 Console]
Steps to Reproduce: [Detailed steps]
Expected vs Actual: [What should happen vs what does happen]
```

### Environment Details
```
Other Extensions: [List other installed extensions]
YouTube URL: [Specific video that causes issues, if any]
Date/Time: [When the issue occurred]
```

## 🔄 Reset and Recovery

### Complete Extension Reset
1. **Disable extension** in `/extensions/`
2. **Clear YouTube data**:
   - Go to `/settings/content/all`
   - Search for "youtube.com"
   - Clear all data
3. **Re-enable extension**
4. **Reload YouTube**
5. **Reconfigure settings**

### Factory Reset Steps
1. **Uninstall extension** completely
2. **Clear browser cache** (`Ctrl+Shift+Delete`)
3. **Restart browser**
4. **Reinstall extension**
5. **Test with default settings**

### Backup Settings (Manual)
Settings can't be exported, but you can note:
- Navigation mode preference
- Custom speed setting
- Keyboard shortcut preferences
- Then manually reconfigure after reset

## 📞 Getting Additional Help

### Before Contacting Support
1. **Try all solutions** in this guide
2. **Check existing GitHub issues**
3. **Test on different YouTube videos**
4. **Gather system information** listed above

### How to Report Issues
1. **Go to GitHub Issues**: [Repository Issues Page]
2. **Search existing issues** first
3. **Use issue templates** if available
4. **Provide detailed information** from this guide

### Community Support
- **GitHub Discussions**: General questions and community help
- **Stack Overflow**: Technical programming questions (tag with relevant keywords)

### Professional Support
Currently, this is an open-source project without paid support. Community support through GitHub is the primary support channel.

## 📚 Related Documentation

- **[Installation Guide](INSTALLATION.md)**: Detailed installation instructions
- **[Main README](../README.md)**: Overview and basic usage
- **[API Documentation](../API.md)**: Technical implementation details
- **[Contributing Guide](../CONTRIBUTING.md)**: For developers

---

## 💡 Prevention Tips

### Best Practices
- **Keep extension updated** to latest version
- **Use standard Chrome/Edge** (stable channel)
- **Avoid conflicting extensions**
- **Test after browser updates**

### Regular Maintenance
- **Periodically check** extension status
- **Clear browser cache** monthly
- **Review extension permissions** occasionally
- **Backup important settings** by noting them down

---

*Troubleshooting guide last updated: June 25, 2025*

If this guide doesn't resolve your issue, please [create a new issue](https://github.com/kavinnandha/Youtube-Playback-Speed-Customization/issues) with detailed information about your problem.
