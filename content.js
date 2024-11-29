console.log("Content script running on this page.");
// Extract main content (you can refine this based on the webpage structure)
const content = document.body.innerText;  // You could use more targeted selectors depending on the page
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    sendResponse({ content: content });
});
