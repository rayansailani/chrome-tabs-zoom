document.addEventListener("DOMContentLoaded", async () => {
    const zoomInput = document.getElementById("zoom-percentage");
    const applyButton = document.getElementById("apply-zoom");
    const toggleCheckbox = document.getElementById("toggle-zoom");
  
    // Load stored settings
    const { zoomPercentage, applyZoom } = await chrome.storage.sync.get(["zoomPercentage", "applyZoom"]);
  
    if (zoomPercentage) zoomInput.value = zoomPercentage;
    toggleCheckbox.checked = !!applyZoom;
  
    // Apply zoom on button click
    applyButton.addEventListener("click", async () => {
      const zoomValue = parseInt(zoomInput.value, 10);
      if (zoomValue >= 25 && zoomValue <= 500) {
        await chrome.storage.sync.set({ zoomPercentage: zoomValue });
  
        // If zoom is enabled, apply to all tabs
        if (toggleCheckbox.checked) {
          applyZoomToAllTabs(zoomValue);
        }
      } else {
        alert("Enter a valid zoom percentage (25-500).");
      }
    });
  
    // Toggle zoom on all tabs
    toggleCheckbox.addEventListener("change", async (e) => {
      const enabled = e.target.checked;
      await chrome.storage.sync.set({ applyZoom: enabled });
  
      if (enabled) {
        const { zoomPercentage } = await chrome.storage.sync.get("zoomPercentage");
        if (zoomPercentage) {
          applyZoomToAllTabs(zoomPercentage);
        }
      } else {
        applyZoomToAllTabs(100); // Reset all tabs to 100% when disabled
      }
    });
  
    // Apply zoom to all open tabs
    async function applyZoomToAllTabs(zoom) {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.setZoom(tab.id, zoom / 100);
        }
      }
    }
  });