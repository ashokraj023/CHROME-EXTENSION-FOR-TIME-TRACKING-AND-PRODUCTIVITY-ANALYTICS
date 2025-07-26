document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["trackingData"], result => {
    const trackingData = result.trackingData || {};

    let productiveTime = 0;
    let unproductiveTime = 0;
    let uncategorizedTime = 0;

    const siteDetailDiv = document.getElementById("siteDetail");

    for (const site in trackingData) {
      const { time, category } = trackingData[site];
      const minutes = Math.floor(time / 60000);

      // Sum category time
      if (category === "productive") productiveTime += time;
      else if (category === "unproductive") unproductiveTime += time;
      else uncategorizedTime += time;

      // Add to Site-wise Detail
      const div = document.createElement("div");
      div.textContent = `${site} → ${minutes} min`;
      siteDetailDiv.appendChild(div);
    }

    // Update DOM
    document.getElementById("productive").textContent = (productiveTime / 60000).toFixed(2);
    document.getElementById("unproductive").textContent = (unproductiveTime / 60000).toFixed(2);
    document.getElementById("uncategorized").textContent = (uncategorizedTime / 60000).toFixed(2);
  });
});
