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
let menuUpdateTimeout = null; // Debounce timer for menu updates
let lastRateChangeTime = 0; // Timestamp of last rate change for deduplication
let lastRateChangeValue = 1; // Last rate change value for deduplication
let lastSettingsUpdateTime = 0; // Timestamp of last settings update for throttling
let isExtensionInitialized = false; // Tracks extension initialization state

// Storage configuration
const SPEED_STORAGE_KEY = 'youtube-speed-extender-preferred-speed';

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
 */
function applyPreferredSpeed() {
  const video = document.querySelector('video');
  if (!video) return;
  
  const preferredSpeed = loadPreferredSpeed();
  const currentSpeed = video.playbackRate;
  
  // Only apply if there's a significant difference (avoid minor floating point differences)
  if (Math.abs(currentSpeed - preferredSpeed) > 0.05) {
    isUpdatingSpeed = true;
    video.playbackRate = preferredSpeed;
    setTimeout(() => {
      isUpdatingSpeed = false;
      updateYouTubeSpeedSetting(preferredSpeed);
    }, 100);
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
 */
function initializeExtension() {
  if (isExtensionInitialized) return;
  
  isExtensionInitialized = true;
  
  // Apply preferred speed to current video
  applyPreferredSpeed();
  
  // Set up speed synchronization and event listeners
  setupSpeedSynchronization();
  
  // Set up navigation observer for page changes
  setupNavigationObserver();
}

/**
 * Main keyboard event handler for speed control
 * Listens for '.' (increase speed) and ',' (decrease speed) key presses
 */
document.addEventListener('keydown', (e) => {
  // Ignore keypresses in input fields and editable content
  if (e.target.tagName.toLowerCase() === 'input' || 
      e.target.tagName.toLowerCase() === 'textarea' ||
      e.target.isContentEditable) return;

  // Only handle period and comma keys
  if (e.key !== '.' && e.key !== ',') return;
  
  const video = document.querySelector('video');
  if (!video) return;

  const current = video.playbackRate;
  const currentIndex = getClosestSpeedIndex(current);
  
  // Calculate new speed index based on key press
  let newIndex = currentIndex;
  if (e.key === '.') {
    newIndex = Math.min(currentIndex + 1, speedOptions.length - 1);
  } else if (e.key === ',') {
    newIndex = Math.max(currentIndex - 1, 0);
  }

  const newRate = speedOptions[newIndex];
  
  // Always show overlay, even if speed doesn't change (at min/max)
  showCustomOverlay(newRate);
  
  // Only change playback rate if speed actually changes
  if (newIndex !== currentIndex) {
    isUpdatingSpeed = true; // Prevent recursive calls
    video.playbackRate = newRate;
    
    // Save the new preferred speed
    savePreferredSpeed(newRate);
    
    // Update native settings with debounce to prevent recursion
    setTimeout(() => {
      updateYouTubeSpeedSetting(newRate);
      immediateUpdateSettingsMenu(newRate);
    }, 0);
  }

  e.preventDefault();
});

/**
 * Sets up navigation observer to handle URL changes in YouTube's SPA
 * Re-initializes extension functionality when navigating between videos
 */
function setupNavigationObserver() {
  let currentUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      
      // Apply preferred speed to new video after navigation
      setTimeout(() => {
        applyPreferredSpeed();
      }, 1000);
    }
  });

  urlObserver.observe(document.body, { childList: true, subtree: true });
}

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
  });
  
  // Handle playback rate changes from YouTube's native controls
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
    
    // Only save user-initiated speed changes (not seeking resets)
    if (!isSeeking && speedOptions.includes(currentRate)) {
      savePreferredSpeed(currentRate);
      showCustomOverlay(currentRate);
    } else if (!isSeeking) {
      showCustomOverlay(currentRate);
    }
    
    // Always update menu items
    updateYouTubeSpeedSetting(currentRate);
  });  // Set up mutation observers for settings menu integration
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
          isUpdatingSpeed = true;
          video.playbackRate = speed;
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
 */
function autoApplyPreferredSpeed() {
  const video = document.querySelector('video');
  if (!video) return;
  
  const preferredSpeed = loadPreferredSpeed();
  const currentSpeed = video.playbackRate;
  
  // Apply preferred speed if it differs from current speed
  if (preferredSpeed !== 1 && Math.abs(currentSpeed - preferredSpeed) > 0.05) {
    video.playbackRate = preferredSpeed;
    
    // Update settings menu to reflect the new speed
    setTimeout(() => {
      updateYouTubeSpeedSetting(preferredSpeed);
    }, 200);
  } else if (preferredSpeed !== 1) {
    // Ensure settings menu is updated even if speed matches
    setTimeout(() => {
      updateYouTubeSpeedSetting(preferredSpeed);
    }, 200);
  }
}

/**
 * Waits for video to be ready and fully initializes the extension
 */
function waitForVideoAndFullyInitialize() {
  const video = document.querySelector('video');
  if (video && video.readyState >= 1) {
    // Fully initialize the extension
    initializeExtension();
    
    // Apply preferred speed
    autoApplyPreferredSpeed();
    
    // Update settings menu after UI is ready
    setTimeout(() => {
      const preferredSpeed = loadPreferredSpeed();
      if (preferredSpeed !== 1) {
        updateYouTubeSpeedSetting(preferredSpeed);
      }
    }, 2000);
  } else {
    // Wait for video to load
    setTimeout(waitForVideoAndFullyInitialize, 500);
  }
}

// Initialize extension when page loads
setTimeout(waitForVideoAndFullyInitialize, 1000);

// Set up navigation observer for YouTube's single-page app
let currentUrl = location.href;
const autoApplyObserver = new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    
    // Reset initialization flag for new page
    isExtensionInitialized = false;
    
    // Fully initialize for new video after navigation
    setTimeout(() => {
      waitForVideoAndFullyInitialize();
      
      // Update settings menu after navigation
      setTimeout(() => {
        const preferredSpeed = loadPreferredSpeed();
        if (preferredSpeed !== 1) {
          updateYouTubeSpeedSetting(preferredSpeed);
        }
      }, 2000);
    }, 1000);
  }
});

autoApplyObserver.observe(document.body, { childList: true, subtree: true });
