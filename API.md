# API Documentation

## YouTube Speed Extender - Internal API Reference

This document provides detailed technical documentation for the internal APIs and functions used in the YouTube Speed Extender extension.

## 📋 Table of Contents

- [Core Functions](#core-functions)
- [Storage Management](#storage-management)
- [Event Handlers](#event-handlers)
- [UI Components](#ui-components)
- [Utility Functions](#utility-functions)
- [Configuration Constants](#configuration-constants)

## 🔧 Core Functions

### `initializeExtension(isNavigation = false)`

Initializes the extension's core functionality and sets up event listeners.

**Parameters:**
- `isNavigation` (boolean): Whether this is called during navigation

**Usage:**
```javascript
initializeExtension(false); // Normal initialization
initializeExtension(true);  // Navigation initialization
```

**Behavior:**
- Sets up speed synchronization
- Applies appropriate speed based on context
- Prevents multiple initializations

---

### `applyPreferredSpeed(isNavigation = false)`

Applies the user's preferred speed to the current video.

**Parameters:**
- `isNavigation` (boolean): Whether this is called during navigation

**Returns:** `void`

**Behavior:**
- Gets target speed based on navigation mode
- Applies speed only if significantly different from current
- Updates UI synchronization

---

### `getNavigationSpeed()`

Determines which speed to use for navigation based on user preferences.

**Returns:** `number` - The speed to apply for navigation

**Logic:**
```javascript
switch (navigationMode) {
  case 'continue': return loadPreferredSpeed();
  case 'default': return 1;
  case 'custom': return loadCustomNavigationSpeed();
}
```

## 💾 Storage Management

### Speed Storage Functions

#### `savePreferredSpeed(speed)`
Saves the user's preferred playback speed to local storage.

**Parameters:**
- `speed` (number): The playback speed to save

**Storage Key:** `youtube-speed-extender-preferred-speed`

---

#### `loadPreferredSpeed()`
Loads the user's preferred playback speed from local storage.

**Returns:** `number` - The saved speed or 1 (default)

**Error Handling:** Returns 1 if storage access fails

---

### Navigation Mode Storage

#### `saveNavigationMode(mode)`
Saves the navigation mode preference.

**Parameters:**
- `mode` (string): One of `'continue'`, `'default'`, or `'custom'`

**Validation:** Only accepts valid navigation modes

---

#### `loadNavigationMode()`
Loads the navigation mode preference.

**Returns:** `string` - The saved mode or `'continue'` as default

---

### Keyboard Shortcut Storage

#### `saveIncreaseSpeedKey(key)` / `saveDecreaseSpeedKey(key)`
Saves custom keyboard shortcuts.

**Parameters:**
- `key` (string): Single character key

**Storage Keys:**
- `youtube-speed-extender-increase-key`
- `youtube-speed-extender-decrease-key`

## 🎛️ Event Handlers

### Keyboard Event Handler

```javascript
document.addEventListener('keydown', (e) => {
  // Input field detection
  if (e.target.tagName.toLowerCase() === 'input' || 
      e.target.tagName.toLowerCase() === 'textarea' ||
      e.target.isContentEditable) return;

  // Settings shortcut
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    showSpeedSettingsModal();
    return;
  }

  // Speed control logic
  // ...
});
```

**Features:**
- Ignores input fields and editable content
- Handles custom increase/decrease keys
- Provides visual feedback via overlay
- Prevents default behavior for handled keys

### Video Event Listeners

#### Rate Change Handler
```javascript
video.addEventListener('ratechange', () => {
  // Deduplication logic
  // Rate change processing
  // Menu synchronization
});
```

#### Seeking Event Handlers
```javascript
video.addEventListener('seeking', () => {
  isSeeking = true;
});

video.addEventListener('seeked', () => {
  isSeeking = false;
  // Reapply preferred speed
});
```

## 🎨 UI Components

### Speed Overlay

#### `showCustomOverlay(rate)`
Displays a temporary overlay showing current playback speed.

**Parameters:**
- `rate` (number): The playback rate to display

**Styling:**
- Position: Absolute, centered
- Auto-hide: 1 second timeout
- Z-index: 999999 (top layer)

**CSS Properties:**
```css
{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  border-radius: 10px;
  font-family: monospace;
}
```

### Settings Modal

#### `showSpeedSettingsModal()`
Creates and displays the comprehensive settings modal.

**Features:**
- Navigation mode selection
- Custom speed configuration
- Keyboard shortcut customization
- Modern YouTube-style UI

**Modal Structure:**
```
Modal Overlay
├── Modal Content
│   ├── Header (with close button)
│   ├── Navigation Behavior Section
│   ├── Keyboard Shortcuts Section
│   └── Action Buttons (Cancel/Save)
```

#### `setupModalEventListeners(modalOverlay)`
Sets up all event listeners for the settings modal.

**Event Types:**
- Close modal (multiple triggers)
- Radio button changes
- Key input capturing
- Save settings processing

## 🔧 Utility Functions

### `getClosestSpeedIndex(currentRate)`
Finds the closest speed index for a given playback rate.

**Parameters:**
- `currentRate` (number): The current video playback rate

**Returns:** `number` - Index of closest speed option

**Algorithm:**
1. Round current rate to handle floating point precision
2. Try exact match first (within 0.05 tolerance)
3. Find closest match using distance calculation

---

### `updateYouTubeSpeedSetting(playbackRate)`
Updates YouTube's native speed settings menu.

**Parameters:**
- `playbackRate` (number): The current playback rate

**Behavior:**
- Updates radio button selections
- Updates speed display text
- Prevents recursive calls

---

### `enhanceSpeedMenu(speedMenu)`
Enhances YouTube's native speed menu with extended options.

**Parameters:**
- `speedMenu` (Element): The speed menu element to enhance

**Enhancement Process:**
1. Clear existing menu items
2. Add custom speed options
3. Set up click handlers
4. Apply YouTube-consistent styling

## 📊 Configuration Constants

### Speed Options
```javascript
const speedOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
```

### Storage Keys
```javascript
const SPEED_STORAGE_KEY = 'youtube-speed-extender-preferred-speed';
const KEYBOARD_SPEED_STORAGE_KEY = 'youtube-speed-extender-keyboard-speed';
const NAVIGATION_MODE_KEY = 'youtube-speed-extender-navigation-mode';
const CUSTOM_NAVIGATION_SPEED_KEY = 'youtube-speed-extender-custom-navigation-speed';
const INCREASE_SPEED_KEY_STORAGE = 'youtube-speed-extender-increase-key';
const DECREASE_SPEED_KEY_STORAGE = 'youtube-speed-extender-decrease-key';
```

### Navigation Modes
```javascript
const NAVIGATION_MODES = {
  CONTINUE: 'continue',    // Continue current speed
  DEFAULT: 'default',     // Always use 1x
  CUSTOM: 'custom'        // Use custom speed
};
```

## 🚦 State Management Variables

### Flag Variables
```javascript
let isUpdatingSpeed = false;           // Prevents recursive speed updates
let isApplyingNavigationSpeed = false; // Prevents preferred speed saving during navigation
let isNavigating = false;              // Tracks navigation state
let menuUpdateTimeout = null;          // Debounce timer for menu updates
let isExtensionInitialized = false;    // Tracks initialization state
```

### Timing Variables
```javascript
let lastRateChangeTime = 0;      // Timestamp for deduplication
let lastRateChangeValue = 1;     // Last rate value for deduplication
let lastSettingsUpdateTime = 0;  // Timestamp for throttling
```

## 🔄 Event Flow

### Extension Initialization
1. Page load detection
2. Video element waiting
3. Speed application
4. Event listener setup
5. Navigation observer setup

### Speed Change Flow
1. Keyboard input detection
2. Speed calculation
3. Video rate update
4. Visual feedback display
5. Storage update
6. Menu synchronization

### Navigation Flow
1. URL change detection
2. Navigation speed determination
3. Speed application
4. State reset
5. Re-initialization

## 🐛 Error Handling

### Storage Errors
All storage functions include try-catch blocks:
```javascript
try {
  localStorage.setItem(key, value);
} catch (error) {
  // Silently handle storage errors
}
```

### DOM Errors
UI update functions handle missing elements gracefully:
```javascript
try {
  // DOM manipulation
} catch (error) {
  // Continue execution without breaking
}
```

### Video Errors
Video operations check for element existence:
```javascript
const video = document.querySelector('video');
if (!video) return; // Early exit if no video
```

## ⚡ Performance Optimizations

### Debouncing
- Menu updates: 500ms throttle
- Rate changes: 100ms deduplication

### Event Optimization
- Minimal DOM queries
- Cached element references where possible
- Efficient selector strategies

### Memory Management
- Timeout cleanup
- Event listener management
- State variable reset

---

*This API documentation is maintained alongside the codebase. Last updated: June 25, 2025*
