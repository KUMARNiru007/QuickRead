// DOM Elements
const simplifyBtn = document.getElementById("simplifyBtn");
const viewSavedBtn = document.getElementById("viewSavedBtn");
const status = document.getElementById("status");
const contentDiv = document.getElementById("content");

// Summarization API URL (Replace with the actual API endpoint)
const API_URL = "https://api.example.com/summarize"; // Placeholder

// Simplify Content
simplifyBtn.addEventListener("click", async () => {
  try {
    status.textContent = "Fetching content...";
    contentDiv.textContent = "";

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Fetch visible content from the page
    const response = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText // Extract all visible text
    });

    const pageContent = response[0].result;

    // Call Summarization API
    const apiResponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY" // Replace with actual API key if required
      },
      body: JSON.stringify({ content: pageContent })
    });

    if (!apiResponse.ok) throw new Error("API call failed");

    const summary = await apiResponse.json();

    // Display summary
    contentDiv.textContent = summary.text || "Summary not available."; // Update key based on API response

    // Save summary locally
    chrome.storage.local.set({ savedContent: summary.text }, () => {
      status.textContent = "Content saved for offline use!";
    });
  } catch (error) {
    status.textContent = "An error occurred while fetching the summary.";
    console.error(error);
  }
});

// View Saved Content
viewSavedBtn.addEventListener("click", () => {
  chrome.storage.local.get("savedContent", (data) => {
    if (data.savedContent) {
      contentDiv.textContent = data.savedContent;
    } else {
      contentDiv.textContent = "No saved content available.";
    }
  });
});
// Function to call Gemini API and get the summary
async function getGeminiSummary(content) {
  const apiKey = 'your_gemini_api_key_here';  // Replace this with your actual API key
  const apiUrl = 'https://api.gemini.google.com/v1/summarize';  // Placeholder URL, replace it with the real one

  // Requesting the summary from Gemini API
  const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: content }),  // Send content to be summarized
  });

  // Parse the response to get the summary
  const data = await response.json();
  return data.summary;  // The summary should be in the 'summary' field of the response
}
// Button click event to get summary
document.getElementById('summarizeButton').addEventListener('click', async () => {
  // Assume that you fetch content from the current tab (web page)
  const content = 'The content you want to summarize';  // You’ll fetch this content dynamically from the page

  try {
      // Call the Gemini API to get the summary
      const summary = await getGeminiSummary(content);

      // Display the summary in the popup
      document.getElementById('summary').innerText = summary;
      
      // Save the summary to localStorage for offline use
      localStorage.setItem('summary', summary);
  } catch (error) {
      console.error("Error fetching summary:", error);
      document.getElementById('summary').innerText = 'Failed to fetch summary.';
  }
});
// Get content from the current page using chrome extension messaging
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'getContent' }, function(response) {
      const content = response.content;
      // Now use this content in the getGeminiSummary function
      const summary = await getGeminiSummary(content);
      document.getElementById('summary').innerText = summary;
  });
});
