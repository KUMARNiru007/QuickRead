console.log("Content script running on this page.");

// Extract main content more selectively (optional, refine as per the page structure)
let content = document.body.innerText; // Default fallback

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Send the content back to the popup
    sendResponse({ content: content });
});
