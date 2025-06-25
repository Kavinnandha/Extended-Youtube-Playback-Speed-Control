/**
 * YouTube Speed Extender - Enhanced Playback Speed Control
 * 
 * This extension provides extended playback speed options (0.5x - 5x) with keyboard shortcuts,
 * speed persistence across videos, and seamless integration with YouTube's native controls.
 * 
 * Features:
 * - Extended speed range: 0.5x, 1x, 1.5x, 2x, 2.5x, 3x, 3.5x, 4x, 4.5x, 5x
 * - Keyboard shortcuts: . (increase) and , (decrease)
 * - Speed persistence across page navigation
 * - Settings menu synchronization
 * - Seeking event handling to maintain preferred speed
 */

// Configuration: Available playback speed options
const speedOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

// State management variables
let isUpdatingSpeed = false; // Prevents recursive speed updates
let isApplyingNavigationSpeed = false; // Prevents preferred speed saving during navigation
let isNavigating = false; // Tracks when we're in the middle of navigation
let menuUpdateTimeout = null; // Debounce timer for menu updates
let lastRateChangeTime = 0; // Timestamp of last rate change for deduplication
let lastRateChangeValue = 1; // Last rate change value for deduplication
let lastSettingsUpdateTime = 0; // Timestamp of last settings update for throttling
let isExtensionInitialized = false; // Tracks extension initialization state

// Storage configuration
const SPEED_STORAGE_KEY = 'youtube-speed-extender-preferred-speed';
const KEYBOARD_SPEED_STORAGE_KEY = 'youtube-speed-extender-keyboard-speed';
const NAVIGATION_MODE_KEY = 'youtube-speed-extender-navigation-mode';
const CUSTOM_NAVIGATION_SPEED_KEY = 'youtube-speed-extender-custom-navigation-speed';
const INCREASE_SPEED_KEY_STORAGE = 'youtube-speed-extender-increase-key';
const DECREASE_SPEED_KEY_STORAGE = 'youtube-speed-extender-decrease-key';

// Navigation mode options
const NAVIGATION_MODES = {
  CONTINUE: 'continue',    // Continue current speed to next video
  DEFAULT: 'default',     // Always use 1x (normal) for new videos
  CUSTOM: 'custom'        // Use custom speed for new videos
};

/**
 * Saves the user's preferred playback speed to local storage
 * @param {number} speed - The playback speed to save
 */
function savePreferredSpeed(speed) {
  try {
    localStorage.setItem(SPEED_STORAGE_KEY, speed.toString());
  } catch (error) {
    // Silently handle storage errors
  }
}

/**
 * Loads the user's preferred playback speed from local storage
 * @returns {number} The saved speed or 1 (normal) as default
 */
function loadPreferredSpeed() {
  try {
    const savedSpeed = localStorage.getItem(SPEED_STORAGE_KEY);
    if (savedSpeed) {
      const speed = parseFloat(savedSpeed);
      if (speedOptions.includes(speed)) {
        return speed;
      }
    }
  } catch (error) {
    // Silently handle storage errors
  }
  return 1; // Default to normal speed
}

/**
 * Saves the navigation mode preference
 * @param {string} mode - The navigation mode ('continue', 'default', or 'custom')
 */
function saveNavigationMode(mode) {
  try {
    if (Object.values(NAVIGATION_MODES).includes(mode)) {
      localStorage.setItem(NAVIGATION_MODE_KEY, mode);
    }
  } catch (error) {
    // Silently handle storage errors
  }
}

/**
 * Loads the navigation mode preference
 * @returns {string} The saved mode or 'continue' as default
 */
function loadNavigationMode() {
  try {
    const savedMode = localStorage.getItem(NAVIGATION_MODE_KEY);
    if (savedMode && Object.values(NAVIGATION_MODES).includes(savedMode)) {
      return savedMode;
    }
  } catch (error) {
    // Silently handle storage errors
  }
  return NAVIGATION_MODES.CONTINUE; // Default to continue mode
}

/**
 * Saves the custom navigation speed
 * @param {number} speed - The custom speed for new videos
 */
function saveCustomNavigationSpeed(speed) {
  try {
    if (speedOptions.includes(speed)) {
      localStorage.setItem(CUSTOM_NAVIGATION_SPEED_KEY, speed.toString());
    }
  } catch (error) {
    // Silently handle storage errors
  }
}

/**
 * Loads the custom navigation speed
 * @returns {number} The saved custom speed or 1 (normal) as default
 */
function loadCustomNavigationSpeed() {
  try {
    const savedSpeed = localStorage.getItem(CUSTOM_NAVIGATION_SPEED_KEY);
    if (savedSpeed) {
      const speed = parseFloat(savedSpeed);
      if (speedOptions.includes(speed)) {
        return speed;
      }
    }
  } catch (error) {
    // Silently handle storage errors
  }
  return 1; // Default to normal speed
}

/**
 * Gets the appropriate speed for navigation based on user preferences
 * @returns {number} The speed to use for new videos
 */
/**
 * Determines which speed to use for navigation based on user preferences
 * @returns {number} The speed to apply for navigation
 */
function getNavigationSpeed() {
  const navigationMode = loadNavigationMode();
  
  switch (navigationMode) {
    case NAVIGATION_MODES.CONTINUE:
      // Continue current speed (use preferred speed which tracks current video speed)
      return loadPreferredSpeed();
    
    case NAVIGATION_MODES.DEFAULT:
      // Always use default speed (1x)
      return 1;
    
    case NAVIGATION_MODES.CUSTOM:
      // Use custom navigation speed
      return loadCustomNavigationSpeed();
    
    default:
      // Fallback to continue mode
      return loadPreferredSpeed();
  }
}

/**
 * Finds the closest speed index for a given playback rate
 * @param {number} currentRate - The current video playback rate
 * @returns {number} Index of the closest speed option
 */
function getClosestSpeedIndex(currentRate) {
  // Round the current rate to handle floating point precision issues
  const roundedRate = Math.round(currentRate * 10) / 10;
  
  // First try to find an exact match
  for (let i = 0; i < speedOptions.length; i++) {
    if (Math.abs(speedOptions[i] - roundedRate) < 0.05) {
      return i;
    }
  }
  
  // If no exact match, find the closest one
  return speedOptions.reduce((prevIdx, curr, idx) =>
    Math.abs(curr - roundedRate) < Math.abs(speedOptions[prevIdx] - roundedRate) ? idx : prevIdx, 0
  );
}

/**
 * Updates YouTube's native speed settings menu to reflect current playback rate
 * @param {number} playbackRate - The current playback rate to display
 */
function updateYouTubeSpeedSetting(playbackRate) {
  if (isUpdatingSpeed) return; // Prevent recursive calls
  
  try {
    isUpdatingSpeed = true;
    
    // Update speed menu radio buttons if they exist
    const speedButtons = document.querySelectorAll('.ytp-menuitem[role="menuitemradio"]');
    speedButtons.forEach(button => {
      const label = button.querySelector('.ytp-menuitem-label');
      if (label) {
        const text = label.textContent?.trim();
        if (text && (text.includes('x') || text === 'Normal')) {
          let speedValue = text === 'Normal' ? 1 : parseFloat(text.replace('x', ''));
          if (Math.abs(speedValue - playbackRate) < 0.01) {
            button.setAttribute('aria-checked', 'true');
          } else {
            button.setAttribute('aria-checked', 'false');
          }
        }
      }
    });
    
    // Update the main settings button display
    const settingsMenuItems = document.querySelectorAll('.ytp-menuitem');
    settingsMenuItems.forEach(item => {
      const label = item.querySelector('.ytp-menuitem-label');
      if (label && (label.textContent?.includes('Playback speed') || label.textContent?.includes('Speed'))) {
        const contentDiv = item.querySelector('.ytp-menuitem-content');
        if (contentDiv) {
          const newValue = playbackRate === 1 ? 'Normal' : `${playbackRate}`;
          if (contentDiv.textContent !== newValue) {
            contentDiv.textContent = newValue;
          }
        }
      }
    });
  } catch (error) {
    // Silently handle any update errors
  } finally {
    isUpdatingSpeed = false;
  }
}

/**
 * Applies the user's preferred speed to the current video
 * @param {boolean} isNavigation - Whether this is called during navigation
 */
function applyPreferredSpeed(isNavigation = false) {
  const video = document.querySelector('video');
  if (!video) return;
  
  const targetSpeed = isNavigation ? getNavigationSpeed() : loadPreferredSpeed();
  const currentSpeed = video.playbackRate;
  
  // Apply speed if there's a significant difference (avoid minor floating point differences)
  if (Math.abs(currentSpeed - targetSpeed) > 0.05) {
    isUpdatingSpeed = true;
    if (isNavigation) {
      isApplyingNavigationSpeed = true;
    }
    
    video.playbackRate = targetSpeed;
    
    setTimeout(() => {
      isUpdatingSpeed = false;
      if (isNavigation) {
        isApplyingNavigationSpeed = false;
        
        // For "Continue Current Speed" mode, ensure the applied navigation speed 
        // is saved as the preferred speed for future navigations
        const navigationMode = loadNavigationMode();
        if (navigationMode === NAVIGATION_MODES.CONTINUE) {
          // Force save the navigation speed to ensure persistence
          setTimeout(() => {
            savePreferredSpeed(targetSpeed);
          }, 50);
        }
      }
      updateYouTubeSpeedSetting(targetSpeed);
    }, 100);
  } else if (isNavigation) {
    // Even if speed doesn't change, save it for continue mode to ensure persistence
    const navigationMode = loadNavigationMode();
    if (navigationMode === NAVIGATION_MODES.CONTINUE) {
      setTimeout(() => {
        savePreferredSpeed(targetSpeed);
      }, 50);
    }
  }
}

/**
 * Legacy function for initial video state checking
 * @deprecated Maintained for compatibility
 */
function checkInitialVideoState() {
  const video = document.querySelector('video');
  if (video) {
    applyPreferredSpeed();
    forceUpdateSettingsMenu();
  }
}

/**
 * Displays a temporary overlay showing the current playback speed
 * @param {number} rate - The playback rate to display
 */
function showCustomOverlay(rate) {
  const video = document.querySelector('video');
  if (!video) return;

  let overlay = document.getElementById('yt-speed-ext');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'yt-speed-ext';

    // Apply styling for the speed overlay
    Object.assign(overlay.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, 50%)',
      padding: '12px 24px',
      fontSize: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: '#fff',
      borderRadius: '10px',
      zIndex: 999999,
      fontFamily: 'monospace',
      pointerEvents: 'none',
      transition: 'opacity 0.2s ease-in-out',
    });

    // Ensure proper positioning context
    const container = video.parentElement;
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    container.appendChild(overlay);
  }

  // Update overlay content and show it
  overlay.textContent = `${rate}x`;
  overlay.style.opacity = '1';

  // Auto-hide after 1 second
  clearTimeout(overlay.timer);
  overlay.timer = setTimeout(() => {
    overlay.style.opacity = '0';
  }, 1000);
}

/**
 * Initializes the extension's core functionality
 * Sets up event listeners and synchronization features
 * @param {boolean} isNavigation - Whether this is called during navigation
 */
function initializeExtension(isNavigation = false) {
  if (isExtensionInitialized) return;
  
  isExtensionInitialized = true;
  
  // Apply appropriate speed based on context
  if (isNavigation) {
    applyPreferredSpeed(true);
  } else {
    applyPreferredSpeed();
  }
  
  // Set up speed synchronization and event listeners
  setupSpeedSynchronization();
  
  // Note: Navigation observer is set up globally, not per initialization
}

/**
 * Main keyboard event handler for speed control
 * Listens for custom increase/decrease speed key presses
 * Also handles 'Ctrl+Shift+S' for opening speed settings
 */
document.addEventListener('keydown', (e) => {
  // Ignore keypresses in input fields and editable content
  if (e.target.tagName.toLowerCase() === 'input' || 
      e.target.tagName.toLowerCase() === 'textarea' ||
      e.target.isContentEditable) return;
  // Handle settings shortcut (Ctrl+Shift+S)
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    e.preventDefault();
    showSpeedSettingsModal();
    return;
  }

  // Get custom keys
  const increaseKey = loadIncreaseSpeedKey();
  const decreaseKey = loadDecreaseSpeedKey();

  // Only handle the configured speed control keys
  if (e.key !== increaseKey && e.key !== decreaseKey) return;
  
  const video = document.querySelector('video');
  if (!video) return;

  const current = video.playbackRate;
  const currentIndex = getClosestSpeedIndex(current);
  
  // Calculate new speed index based on key press
  let newIndex = currentIndex;
  if (e.key === increaseKey) {
    newIndex = Math.min(currentIndex + 1, speedOptions.length - 1);
  } else if (e.key === decreaseKey) {
    newIndex = Math.max(currentIndex - 1, 0);
  }

  const newRate = speedOptions[newIndex];
    // Always show overlay, even if speed doesn't change (at min/max)
  showCustomOverlay(newRate);
  
  // Only change playback rate if speed actually changes
  if (newIndex !== currentIndex) {
    isUpdatingSpeed = true; // Prevent recursive calls
    video.playbackRate = newRate;
      // Save the new keyboard-set speed for navigation
    saveKeyboardSpeed(newRate);
    
    // Update native settings with debounce to prevent recursion
    setTimeout(() => {
      updateYouTubeSpeedSetting(newRate);
      immediateUpdateSettingsMenu(newRate);
    }, 0);
  }
  e.preventDefault();
});

/**
 * Sets up comprehensive speed synchronization and event handling
 * Handles seeking events, rate changes, and settings menu integration
 */
function setupSpeedSynchronization() {
  const video = document.querySelector('video');
  if (!video) return;
  
  let isSeeking = false;
  
  // Handle video seeking events to maintain preferred speed
  video.addEventListener('seeking', () => {
    isSeeking = true;
  });
  
  video.addEventListener('seeked', () => {
    isSeeking = false;
    
    // Reapply preferred speed after seeking if YouTube reset it
    setTimeout(() => {
      const preferredSpeed = loadPreferredSpeed();
      const currentSpeed = video.playbackRate;
      
      if (preferredSpeed !== 1 && Math.abs(currentSpeed - preferredSpeed) > 0.05) {
        isUpdatingSpeed = true;
        video.playbackRate = preferredSpeed;
        setTimeout(() => {
          isUpdatingSpeed = false;
          updateYouTubeSpeedSetting(preferredSpeed);
        }, 100);
      }
    }, 100);
  });    // Handle playback rate changes from YouTube's native controls
  video.addEventListener('ratechange', () => {
    if (isUpdatingSpeed) return; // Prevent recursive calls
    
    const currentRate = video.playbackRate;
    const currentTime = Date.now();
    
    // Prevent duplicate processing within 100ms
    if (currentTime - lastRateChangeTime < 100 && Math.abs(currentRate - lastRateChangeValue) < 0.01) {
      return;
    }
    
    lastRateChangeTime = currentTime;
    lastRateChangeValue = currentRate;
      // Only save user-initiated speed changes (not seeking resets or navigation speed applications)
    if (!isSeeking && !isApplyingNavigationSpeed && speedOptions.includes(currentRate)) {
      // Additional check: In "Continue Current Speed" mode, don't override with 1x during navigation
      const navigationMode = loadNavigationMode();
      const savedSpeed = loadPreferredSpeed();
      
      // If in continue mode and the current rate is 1x but we have a saved speed > 1x,
      // and we're navigating, this might be YouTube resetting during navigation - don't save it
      if (navigationMode === NAVIGATION_MODES.CONTINUE && currentRate === 1 && savedSpeed > 1 && isNavigating) {
        // This is likely a navigation reset, restore the saved speed instead
        setTimeout(() => {
          if (video.playbackRate === 1) {
            isUpdatingSpeed = true;
            video.playbackRate = savedSpeed;
            setTimeout(() => {
              isUpdatingSpeed = false;
              updateYouTubeSpeedSetting(savedSpeed);
            }, 100);
          }
        }, 500);
      } else if (!isNavigating || currentRate !== 1) {
        // Normal user-initiated speed change, save it (but not during navigation if it's 1x)
        savePreferredSpeed(currentRate);
      }
      showCustomOverlay(currentRate);
    } else if (!isSeeking && !isApplyingNavigationSpeed) {
      showCustomOverlay(currentRate);
    }
    
    // Always update menu items
    updateYouTubeSpeedSetting(currentRate);
  });// Set up mutation observers for settings menu integration
  const settingsObserver = new MutationObserver((mutations) => {
    let shouldUpdateSettings = false;
    let shouldUpdateSpeedMenu = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Check if speed menu was opened
        const speedMenu = document.querySelector('.ytp-speed-menu');
        if (speedMenu && !speedMenu.querySelector('.yt-speed-ext-enhanced')) {
          shouldUpdateSpeedMenu = true;
        }
        
        // Check if main settings menu was opened
        const settingsMenu = document.querySelector('.ytp-settings-menu');
        if (settingsMenu && settingsMenu.style.display !== 'none') {
          shouldUpdateSettings = true;
        }
      } else if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        // Check for style changes indicating menu visibility
        if (mutation.target.classList.contains('ytp-settings-menu') && 
            mutation.target.style.display !== 'none') {
          shouldUpdateSettings = true;
        } else if (mutation.target.classList.contains('ytp-speed-menu') &&
                   !mutation.target.querySelector('.yt-speed-ext-enhanced')) {
          shouldUpdateSpeedMenu = true;
        }
      }
    });
    
    // Execute updates once per batch of mutations
    if (shouldUpdateSpeedMenu) {
      const speedMenu = document.querySelector('.ytp-speed-menu');
      if (speedMenu) {
        enhanceSpeedMenu(speedMenu);
      }
    }
    
    if (shouldUpdateSettings) {
      if (menuUpdateTimeout) {
        clearTimeout(menuUpdateTimeout);
      }
      menuUpdateTimeout = setTimeout(() => {
        updateSettingsMenuSpeedValue(video.playbackRate);
        directUpdateSettingsMenu(video.playbackRate);
        menuUpdateTimeout = null;
      }, 250);
    }
  });
  
  // Start observing the player container for settings menu changes
  const playerContainer = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
  if (playerContainer) {
    settingsObserver.observe(playerContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
  
  // Listen for settings button clicks
  const settingsButton = document.querySelector('.ytp-settings-button');
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      if (menuUpdateTimeout) {
        clearTimeout(menuUpdateTimeout);
      }
      menuUpdateTimeout = setTimeout(() => {
        updateSettingsMenuSpeedValue(video.playbackRate);
        directUpdateSettingsMenu(video.playbackRate);
        menuUpdateTimeout = null;
      }, 250);
    });
  }
  
  // Additional observer for settings panel
  const settingsPanel = document.querySelector('.ytp-settings-menu');
  if (settingsPanel) {
    const panelObserver = new MutationObserver(() => {
      if (menuUpdateTimeout) {
        clearTimeout(menuUpdateTimeout);
      }
      menuUpdateTimeout = setTimeout(() => {
        updateSettingsMenuSpeedValue(video.playbackRate);
        directUpdateSettingsMenu(video.playbackRate);
        menuUpdateTimeout = null;
      }, 100);
    });
    
    panelObserver.observe(settingsPanel, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }
}

/**
 * Enhances YouTube's native speed menu with extended speed options
 * @param {Element} speedMenu - The speed menu element to enhance
 */
function enhanceSpeedMenu(speedMenu) {
  try {
    const existingItems = speedMenu.querySelectorAll('.ytp-menuitem');
    
    // Check if we've already enhanced this menu
    if (speedMenu.querySelector('.yt-speed-ext-enhanced')) {
      updateSpeedMenuSelection(speedMenu);
      return;
    }
    
    // Mark this menu as enhanced
    speedMenu.classList.add('yt-speed-ext-enhanced');
    
    // Remove existing speed options
    existingItems.forEach(item => {
      const label = item.querySelector('.ytp-menuitem-label');
      if (label && label.textContent.includes('x')) {
        item.remove();
      }
    });
    
    // Add our extended speed options
    const video = document.querySelector('video');
    const currentRate = video ? video.playbackRate : 1;
    
    speedOptions.forEach(speed => {
      const menuItem = document.createElement('div');
      menuItem.className = 'ytp-menuitem';
      menuItem.setAttribute('role', 'menuitemradio');
      menuItem.setAttribute('aria-checked', Math.abs(speed - currentRate) < 0.01 ? 'true' : 'false');
      menuItem.setAttribute('tabindex', '0');
      
      const content = document.createElement('div');
      content.className = 'ytp-menuitem-content';
      
      const label = document.createElement('div');
      label.className = 'ytp-menuitem-label';
      label.textContent = speed === 1 ? 'Normal' : `${speed}`;
      
      content.appendChild(label);
      menuItem.appendChild(content);
      
      // Add click handler for speed selection
      menuItem.addEventListener('click', () => {
        if (video) {
          isUpdatingSpeed = true;      video.playbackRate = speed;
      showCustomOverlay(speed);
      savePreferredSpeed(speed);
          
          setTimeout(() => {
            updateYouTubeSpeedSetting(speed);
          }, 0);
        }
      });
      
      speedMenu.appendChild(menuItem);
    });
  } catch (error) {
    // Silently handle enhancement errors
  }
}

/**
 * Updates the speed value display in the main settings menu
 * @param {number} playbackRate - The current playback rate
 */
function updateSettingsMenuSpeedValue(playbackRate) {
  if (isUpdatingSpeed) return;
  
  const currentTime = Date.now();
  // Throttle updates to once per 500ms
  if (currentTime - lastSettingsUpdateTime < 500) {
    return;
  }
  
  try {
    lastSettingsUpdateTime = currentTime;
    
    // Find the playback speed menu item in the main settings menu
    const settingsItems = document.querySelectorAll('.ytp-menuitem');
    let updated = false;
    
    settingsItems.forEach(item => {
      const label = item.querySelector('.ytp-menuitem-label');
      if (label && (label.textContent.includes('Playback speed') || label.textContent.includes('Speed'))) {
        // Found the playback speed menu item - update the content
        const contentDiv = item.querySelector('.ytp-menuitem-content');
        if (contentDiv) {
          const newValue = playbackRate === 1 ? 'Normal' : `${playbackRate}`;
          // Only update if the value has changed
          if (contentDiv.textContent !== newValue) {
            contentDiv.textContent = newValue;
            updated = true;
          }
        }
      }
    });
  } catch (error) {
    // Silently handle update errors
  }
}

/**
 * Updates the selected speed in an enhanced speed menu
 * @param {Element} speedMenu - The speed menu to update
 */
function updateSpeedMenuSelection(speedMenu) {
  if (!speedMenu) return;
  
  try {
    const video = document.querySelector('video');
    if (!video) return;
    
    const currentRate = video.playbackRate;
    
    // Update all menu items' selection state
    const menuItems = speedMenu.querySelectorAll('.ytp-menuitem[role="menuitemradio"]');
    menuItems.forEach(item => {
      const label = item.querySelector('.ytp-menuitem-label');
      if (label) {
        const text = label.textContent?.trim();
        if (text) {
          const speedValue = text === 'Normal' ? 1 : parseFloat(text.replace('x', ''));
          if (Math.abs(speedValue - currentRate) < 0.01) {
            item.setAttribute('aria-checked', 'true');
          } else {
            item.setAttribute('aria-checked', 'false');
          }
        }
      }
    });
  } catch (error) {
    // Silently handle selection update errors
  }
}

/**
 * Forces an update of the settings menu when it becomes visible
 */
function forceUpdateSettingsMenu() {
  const video = document.querySelector('video');
  if (!video) return;
  
  // Wait for menu to render, then update
  setTimeout(() => {
    const settingsMenu = document.querySelector('.ytp-settings-menu');
    if (settingsMenu && getComputedStyle(settingsMenu).display !== 'none') {
      updateSettingsMenuSpeedValue(video.playbackRate);
      directUpdateSettingsMenu(video.playbackRate);
    }
  }, 100);
}

/**
 * Immediately updates the settings menu using specific selectors
 * @param {number} playbackRate - The playback rate to display
 */
function immediateUpdateSettingsMenu(playbackRate) {
  try {
    const selectors = [
      '.ytp-menuitem .ytp-menuitem-content',
      'div[aria-haspopup="true"] .ytp-menuitem-content',
      '.ytp-settings-menu .ytp-menuitem-content'
    ];
    
    let updated = false;
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const parentItem = element.closest('.ytp-menuitem');
        if (parentItem) {
          const label = parentItem.querySelector('.ytp-menuitem-label');
          if (label && (label.textContent.includes('Playback speed') || label.textContent.includes('Speed'))) {
            const newValue = playbackRate === 1 ? 'Normal' : `${playbackRate}`;
            if (element.textContent !== newValue) {
              element.textContent = newValue;
              updated = true;
            }
          }
        }
      });
    });
  } catch (error) {
    // Silently handle immediate update errors
  }
}

/**
 * Updates settings menu using multiple selector strategies
 * @param {number} playbackRate - The playback rate to display
 * @returns {boolean} Whether the update was successful
 */
function directUpdateSettingsMenu(playbackRate) {
  try {
    const selectors = [
      '.ytp-menuitem .ytp-menuitem-content',
      'div[aria-haspopup="true"] .ytp-menuitem-content',
      '.ytp-settings-menu .ytp-menuitem-content'
    ];
    
    let updated = false;
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const parentItem = element.closest('.ytp-menuitem');
        if (parentItem) {
          const label = parentItem.querySelector('.ytp-menuitem-label');
          if (label && (label.textContent.includes('Playback speed') || label.textContent.includes('Speed'))) {
            const newValue = playbackRate === 1 ? 'Normal' : `${playbackRate}`;
            if (element.textContent !== newValue) {
              element.textContent = newValue;
              updated = true;
            }
          }
        }
      });
    });
    
    return updated;
  } catch (error) {
    return false;
  }
}

// ========================================
// INITIALIZATION AND STARTUP
// ========================================

/**
 * Applies the user's preferred speed on page load
 * @param {boolean} isNavigation - Whether this is called during navigation
 */
function autoApplyPreferredSpeed(isNavigation = false) {
  const video = document.querySelector('video');
  if (!video) return;
  
  const targetSpeed = isNavigation ? getNavigationSpeed() : loadPreferredSpeed();
  const currentSpeed = video.playbackRate;
  
  // Apply target speed if it differs from current speed (including 1x for default mode)
  if (Math.abs(currentSpeed - targetSpeed) > 0.05) {
    if (isNavigation) {
      isApplyingNavigationSpeed = true;
    }
    
    video.playbackRate = targetSpeed;
    
    // Update settings menu to reflect the new speed
    setTimeout(() => {
      if (isNavigation) {
        isApplyingNavigationSpeed = false;
        
        // For "Continue Current Speed" mode, ensure the applied navigation speed 
        // is saved as the preferred speed for future navigations
        const navigationMode = loadNavigationMode();
        if (navigationMode === NAVIGATION_MODES.CONTINUE) {
          // Force save the navigation speed to ensure persistence
          setTimeout(() => {
            savePreferredSpeed(targetSpeed);
          }, 50);
        }
      }
      updateYouTubeSpeedSetting(targetSpeed);
    }, 200);
  } else if (targetSpeed !== 1) {
    // Ensure settings menu is updated even if speed matches (but not for 1x)
    setTimeout(() => {
      updateYouTubeSpeedSetting(targetSpeed);
    }, 200);
    
    // For continue mode, save even if speed didn't change to ensure persistence
    if (isNavigation) {
      const navigationMode = loadNavigationMode();
      if (navigationMode === NAVIGATION_MODES.CONTINUE) {
        setTimeout(() => {
          savePreferredSpeed(targetSpeed);
        }, 50);
      }
    }
  }
}

/**
 * Waits for video to be ready and fully initializes the extension
 * @param {boolean} isNavigation - Whether this is called during navigation
 */
function waitForVideoAndFullyInitialize(isNavigation = false) {
  const video = document.querySelector('video');  if (video && video.readyState >= 1) {
    // Fully initialize the extension (which includes applying appropriate speed)
    initializeExtension(isNavigation);
    
    // Update settings menu after UI is ready
    setTimeout(() => {
      const targetSpeed = isNavigation ? getNavigationSpeed() : loadPreferredSpeed();
      if (targetSpeed !== 1) {
        updateYouTubeSpeedSetting(targetSpeed);
      }
    }, 2000);
  } else {
    // Wait for video to load
    setTimeout(() => waitForVideoAndFullyInitialize(isNavigation), 500);
  }
}

// Initialize extension when page loads
setTimeout(waitForVideoAndFullyInitialize, 1000);

// Set up navigation observer for YouTube's single-page app
let currentUrl = location.href;
const autoApplyObserver = new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    
    // Set navigation flag to prevent speed reset interference
    isNavigating = true;
    
    // Reset initialization flag for new page
    isExtensionInitialized = false;
      // Fully initialize for new video after navigation
    setTimeout(() => {
      waitForVideoAndFullyInitialize(true);
        // Update settings menu after navigation
      setTimeout(() => {
        const navigationSpeed = getNavigationSpeed();
        updateYouTubeSpeedSetting(navigationSpeed);
        
        // Clear navigation flag after initialization is complete
        setTimeout(() => {
          isNavigating = false;
        }, 1000);
      }, 2000);
    }, 1000);
  }
});

autoApplyObserver.observe(document.body, { childList: true, subtree: true });

/**
 * Creates and displays the speed settings modal
 * Allows users to configure navigation behavior and custom speeds
 */
function showSpeedSettingsModal() {
  // Remove existing modal if present
  const existingModal = document.getElementById('youtube-speed-settings-modal');
  if (existingModal) {
    existingModal.remove();
    return; // Toggle behavior - if modal is open, close it
  }

  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'youtube-speed-settings-modal';
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto', 'Arial', sans-serif;
  `;

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: #1f1f1f;
    border-radius: 12px;
    padding: 24px;
    max-width: 480px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    color: #ffffff;
    border: 1px solid #333;
  `;  // Get current settings
  const currentMode = loadNavigationMode();
  const currentCustomSpeed = loadCustomNavigationSpeed();
  const currentKeyboardSpeed = loadKeyboardSpeed();
  const currentIncreaseKey = loadIncreaseSpeedKey();
  const currentDecreaseKey = loadDecreaseSpeedKey();

  // Create modal HTML
  modalContent.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #fff; font-size: 20px; font-weight: 500;">YouTube Speed Extender Settings</h2>
      <button id="close-settings-modal" style="
        background: none; 
        border: none; 
        color: #aaa; 
        font-size: 24px; 
        cursor: pointer; 
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
      " onmouseover="this.style.background='#333'; this.style.color='#fff';" onmouseout="this.style.background='none'; this.style.color='#aaa';">×</button>
    </div>
    
    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: #fff; font-size: 16px; font-weight: 500;">Navigation Behavior</h3>
      <p style="margin: 0 0 16px 0; color: #aaa; font-size: 14px; line-height: 1.4;">
        Choose how playback speed should behave when you navigate to a new video:
      </p>
      
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <label style="display: flex; align-items: flex-start; cursor: pointer; padding: 12px; border-radius: 8px; border: 1px solid #333; transition: all 0.2s ease;" 
               onmouseover="this.style.background='#2a2a2a';" onmouseout="this.style.background='transparent';">
          <input type="radio" name="navigation-mode" value="continue" ${currentMode === NAVIGATION_MODES.CONTINUE ? 'checked' : ''} 
                 style="margin-right: 12px; margin-top: 2px; accent-color: #ff0000;">
          <div>
            <div style="color: #fff; font-weight: 500; margin-bottom: 4px;">Continue Current Speed</div>
            <div style="color: #aaa; font-size: 13px; line-height: 1.3;">Keep using whatever speed you were watching the previous video at</div>
          </div>
        </label>
        
        <label style="display: flex; align-items: flex-start; cursor: pointer; padding: 12px; border-radius: 8px; border: 1px solid #333; transition: all 0.2s ease;" 
               onmouseover="this.style.background='#2a2a2a';" onmouseout="this.style.background='transparent';">
          <input type="radio" name="navigation-mode" value="default" ${currentMode === NAVIGATION_MODES.DEFAULT ? 'checked' : ''} 
                 style="margin-right: 12px; margin-top: 2px; accent-color: #ff0000;">
          <div>
            <div style="color: #fff; font-weight: 500; margin-bottom: 4px;">Use Default Speed</div>
            <div style="color: #aaa; font-size: 13px; line-height: 1.3;">Always start new videos at normal speed (1x)</div>
          </div>
        </label>
        
        <label style="display: flex; align-items: flex-start; cursor: pointer; padding: 12px; border-radius: 8px; border: 1px solid #333; transition: all 0.2s ease;" 
               onmouseover="this.style.background='#2a2a2a';" onmouseout="this.style.background='transparent';">
          <input type="radio" name="navigation-mode" value="custom" ${currentMode === NAVIGATION_MODES.CUSTOM ? 'checked' : ''} 
                 style="margin-right: 12px; margin-top: 2px; accent-color: #ff0000;">
          <div style="flex: 1;">
            <div style="color: #fff; font-weight: 500; margin-bottom: 4px;">Use Custom Speed</div>
            <div style="color: #aaa; font-size: 13px; line-height: 1.3; margin-bottom: 8px;">Always start new videos at a specific speed</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <select id="custom-speed-select" style="
                background: #333; 
                color: #fff; 
                border: 1px solid #555; 
                border-radius: 4px; 
                padding: 6px 8px; 
                font-size: 14px;
                min-width: 80px;
              ">
                ${speedOptions.map(speed => 
                  `<option value="${speed}" ${speed === currentCustomSpeed ? 'selected' : ''}>${speed}x</option>`
                ).join('')}
              </select>
              <span style="color: #aaa; font-size: 13px;">playback speed</span>
            </div>
          </div>
        </label>      </div>    </div>
    
    <div style="margin-bottom: 24px; padding: 16px; background: #2a2a2a; border-radius: 8px; border-left: 3px solid #ff0000;">
      <h4 style="margin: 0 0 12px 0; color: #fff; font-size: 14px; font-weight: 500;">Keyboard Shortcuts</h4>
      
      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">        <div style="display: flex; align-items: center; gap: 12px;">
          <label style="color: #fff; font-size: 13px; min-width: 120px;">Increase Speed:</label>
          <input type="text" id="increase-key-input" value="${currentIncreaseKey}" maxlength="1" style="
            background: #333; 
            color: #fff; 
            border: 1px solid #555; 
            border-radius: 4px; 
            padding: 6px 8px; 
            font-size: 14px;
            width: 50px;
            text-align: center;
            font-family: monospace;
          " placeholder="." readonly>
          <span style="color: #aaa; font-size: 12px;">Click and press any key</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 12px;">
          <label style="color: #fff; font-size: 13px; min-width: 120px;">Decrease Speed:</label>
          <input type="text" id="decrease-key-input" value="${currentDecreaseKey}" maxlength="1" style="
            background: #333; 
            color: #fff; 
            border: 1px solid #555; 
            border-radius: 4px; 
            padding: 6px 8px; 
            font-size: 14px;
            width: 50px;
            text-align: center;
            font-family: monospace;
          " placeholder="," readonly>
          <span style="color: #aaa; font-size: 12px;">Click and press any key</span>
        </div>
      </div>
      
      <div style="color: #aaa; font-size: 12px; line-height: 1.4; padding-top: 12px; border-top: 1px solid #444;">
        Fixed shortcut: <strong style="color: #fff;">Ctrl+Shift+S</strong> - Open settings (this modal)
      </div>
    </div><div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="cancel-settings" style="
        background: #333; 
        color: #fff; 
        border: 1px solid #555; 
        padding: 10px 20px; 
        border-radius: 6px; 
        cursor: pointer; 
        font-size: 14px;
        transition: all 0.2s ease;
      " onmouseover="this.style.background='#444';" onmouseout="this.style.background='#333';">Close</button>
      <button id="save-settings" style="
        background: #ff0000; 
        color: #fff; 
        border: none; 
        padding: 10px 20px; 
        border-radius: 6px; 
        cursor: pointer; 
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      " onmouseover="this.style.background='#cc0000';" onmouseout="this.style.background='#ff0000';">Save Settings</button>
    </div>
  `;

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Add event listeners
  setupModalEventListeners(modalOverlay);
}

/**
 * Sets up event listeners for the settings modal
 * @param {HTMLElement} modalOverlay - The modal overlay element
 */
function setupModalEventListeners(modalOverlay) {
  const closeButton = modalOverlay.querySelector('#close-settings-modal');
  const cancelButton = modalOverlay.querySelector('#cancel-settings');
  const saveButton = modalOverlay.querySelector('#save-settings');
  const customSpeedSelect = modalOverlay.querySelector('#custom-speed-select');
  const radioButtons = modalOverlay.querySelectorAll('input[name="navigation-mode"]');
  const increaseKeyInput = modalOverlay.querySelector('#increase-key-input');
  const decreaseKeyInput = modalOverlay.querySelector('#decrease-key-input');

  // Close modal handlers
  const closeModal = () => modalOverlay.remove();
  
  closeButton.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);
  
  // Close on overlay click (but not on modal content click)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Enable custom speed select when custom mode is selected
  const updateCustomSpeedState = () => {
    const customModeSelected = modalOverlay.querySelector('input[value="custom"]').checked;
    customSpeedSelect.disabled = !customModeSelected;
    customSpeedSelect.style.opacity = customModeSelected ? '1' : '0.5';
  };

  // Update custom speed state on radio button change
  radioButtons.forEach(radio => {
    radio.addEventListener('change', updateCustomSpeedState);
  });

  // Initialize custom speed state
  updateCustomSpeedState();
  // Auto-select custom mode when custom speed is changed
  customSpeedSelect.addEventListener('change', () => {
    modalOverlay.querySelector('input[value="custom"]').checked = true;
    updateCustomSpeedState();
  });
  // Setup key input handlers
  const setupKeyInput = (input, otherInput) => {
    // Handle focus to prepare for key capture
    input.addEventListener('focus', () => {
      input.style.borderColor = '#ff0000';
      input.style.backgroundColor = '#2a2a2a';
    });
    
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Don't allow certain keys
      if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter' || 
          e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
        input.blur();
        return;
      }
      
      // Don't allow same key for both inputs
      if (e.key === otherInput.value) {
        // Briefly highlight the conflict
        input.style.borderColor = '#ff4444';
        input.style.backgroundColor = '#443333';
        setTimeout(() => {
          input.style.borderColor = '#555';
          input.style.backgroundColor = '#333';
        }, 1000);
        return;
      }
      
      // Set the key
      input.value = e.key;
      input.style.borderColor = '#00aa00';
      input.style.backgroundColor = '#333';
      setTimeout(() => {
        input.style.borderColor = '#555';
        input.blur();
      }, 500);
    });
    
    // Prevent typing in the input
    input.addEventListener('input', (e) => {
      e.preventDefault();
    });
    
    // Clear focus styles on blur
    input.addEventListener('blur', () => {
      input.style.borderColor = '#555';
      input.style.backgroundColor = '#333';
    });
  };

  setupKeyInput(increaseKeyInput, decreaseKeyInput);
  setupKeyInput(decreaseKeyInput, increaseKeyInput);
  // Save settings handler
  saveButton.addEventListener('click', () => {
    // Save the selected navigation mode
    const selectedMode = modalOverlay.querySelector('input[name="navigation-mode"]:checked').value;
    saveNavigationMode(selectedMode);
    
    // Save custom speed if custom mode is selected
    if (selectedMode === 'custom') {
      const customSpeed = parseFloat(customSpeedSelect.value);
      saveCustomNavigationSpeed(customSpeed);
    }
    
    // Save custom keyboard shortcuts
    const increaseKey = increaseKeyInput.value || '.';
    const decreaseKey = decreaseKeyInput.value || ',';
    
    // Validate that keys are different
    if (increaseKey === decreaseKey) {
      // Show error and don't save
      increaseKeyInput.style.borderColor = '#ff4444';
      decreaseKeyInput.style.borderColor = '#ff4444';
      setTimeout(() => {
        increaseKeyInput.style.borderColor = '#555';
        decreaseKeyInput.style.borderColor = '#555';
      }, 2000);
      return;
    }
    
    saveIncreaseSpeedKey(increaseKey);
    saveDecreaseSpeedKey(decreaseKey);
    
    // Show confirmation
    showSettingsConfirmation();
    
    // Close modal
    closeModal();
  });
}

/**
 * Shows a brief confirmation that settings were saved
 */
function showSettingsConfirmation() {
  // Remove existing confirmation if present
  const existingConfirmation = document.getElementById('youtube-speed-settings-confirmation');
  if (existingConfirmation) {
    existingConfirmation.remove();
  }

  // Create confirmation overlay
  const confirmation = document.createElement('div');
  confirmation.id = 'youtube-speed-settings-confirmation';
  confirmation.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #00aa00;
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: 'Roboto', 'Arial', sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 10001;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  confirmation.textContent = 'Settings saved successfully!';

  document.body.appendChild(confirmation);

  // Animate in
  setTimeout(() => {
    confirmation.style.opacity = '1';
    confirmation.style.transform = 'translateX(0)';
  }, 100);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    confirmation.style.opacity = '0';
    confirmation.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (confirmation.parentNode) {
        confirmation.remove();
      }
    }, 300);
  }, 3000);
}

/**
 * Saves the keyboard-set preferred playback speed to local storage
 * @param {number} speed - The playback speed set via keyboard
 */
function saveKeyboardSpeed(speed) {
  try {
    localStorage.setItem(KEYBOARD_SPEED_STORAGE_KEY, speed.toString());
    // Also save as regular preferred speed for backward compatibility
    localStorage.setItem(SPEED_STORAGE_KEY, speed.toString());
  } catch (error) {
    // Silently handle storage errors
  }
}

/**
 * Loads the keyboard-set preferred playback speed from local storage
 * @returns {number} The saved keyboard speed or 1 (normal) as default
 */
function loadKeyboardSpeed() {
  try {
    const savedSpeed = localStorage.getItem(KEYBOARD_SPEED_STORAGE_KEY);
    if (savedSpeed) {
      const speed = parseFloat(savedSpeed);
      if (speedOptions.includes(speed)) {
        return speed;
      }
    }
    // Fallback to regular preferred speed if keyboard speed not found
    return loadPreferredSpeed();
  } catch (error) {
    // Silently handle storage errors
  }
  return 1; // Default to normal speed
}

/**
 * Saves the custom increase speed key
 * @param {string} key - The key for increasing speed
 */
function saveIncreaseSpeedKey(key) {
  try {
    localStorage.setItem(INCREASE_SPEED_KEY_STORAGE, key);
  } catch (error) {
    // Silently handle storage errors
  }
}

/**
 * Loads the custom increase speed key
 * @returns {string} The saved key or '.' as default
 */
function loadIncreaseSpeedKey() {
  try {
    const savedKey = localStorage.getItem(INCREASE_SPEED_KEY_STORAGE);
    return savedKey || '.';
  } catch (error) {
    // Silently handle storage errors
  }
  return '.'; // Default to period
}

/**
 * Saves the custom decrease speed key
 * @param {string} key - The key for decreasing speed
 */
function saveDecreaseSpeedKey(key) {
  try {
    localStorage.setItem(DECREASE_SPEED_KEY_STORAGE, key);
  } catch (error) {
    // Silently handle storage errors
  }
}

/**
 * Loads the custom decrease speed key
 * @returns {string} The saved key or ',' as default
 */
function loadDecreaseSpeedKey() {
  try {
    const savedKey = localStorage.getItem(DECREASE_SPEED_KEY_STORAGE);
    return savedKey || ',';
  } catch (error) {
    // Silently handle storage errors
  }
  return ','; // Default to comma
}
