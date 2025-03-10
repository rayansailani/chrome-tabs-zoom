chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      const { applyZoom, zoomPercentage } = await chrome.storage.sync.get(["applyZoom", "zoomPercentage"]);
  
      if (applyZoom && zoomPercentage) {
        chrome.tabs.setZoom(tabId, zoomPercentage / 100);
      }
    }
  });
  