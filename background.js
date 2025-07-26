let activeTabId = null;
let startTime = null;

const siteCategories = {
  "www.google.com": "productive",
  "www.stackoverflow.com": "productive",
  "www.youtube.com": "unproductive",
  "www.facebook.com": "unproductive",
};

chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Background worker installed.");
});

chrome.tabs.onActivated.addListener(activeInfo => {
  if (activeTabId !== null && startTime !== null) {
    chrome.tabs.get(activeTabId, tab => {
      console.log("🟡 Activated Tab Info:", tab);
      if (tab && tab.url) {
        const site = new URL(tab.url).hostname;
        const duration = Date.now() - startTime;
        console.log(`⏱️ Saving time for: ${site}, duration: ${duration}`);
        saveTime(site, duration);
      } else {
        console.warn("⚠️ tab.url is undefined. Skipping save.");
      }
    });
  }

  activeTabId = activeInfo.tabId;
  startTime = Date.now();
  console.log("📌 Tab switched:", activeTabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab && tab.active && changeInfo.status === "complete") {
    if (activeTabId !== null && startTime !== null) {
      if (tab.url) {
        const site = new URL(tab.url).hostname;
        const duration = Date.now() - startTime;
        console.log(`🔄 Page Load Save: ${site}, time: ${duration}`);
        saveTime(site, duration);
      } else {
        console.warn("⚠️ tab.url is undefined. Skipping save.");
      }
    }

    activeTabId = tabId;
    startTime = Date.now();
  }
});

function saveTime(site, time) {
  const category = siteCategories[site] || "uncategorized";

  chrome.storage.local.get(["trackingData"], result => {
    const trackingData = result.trackingData || {};

    if (!trackingData[site]) {
      trackingData[site] = { time: 0, category };
    }

    trackingData[site].time += time;

    console.log(`✅ Data stored for ${site}:`, trackingData[site]);

    chrome.storage.local.set({ trackingData });
  });
}
