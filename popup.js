// DOM Elements
const simplifyBtn = document.getElementById("simplifyBtn");
const viewSavedBtn = document.getElementById("viewSavedBtn");
const status = document.getElementById("status");
const contentDiv = document.getElementById("content");
const summarizeButton = document.getElementById('summarizeButton'); // Correct button ID from HTML
const summaryDiv = document.getElementById('summary'); // Correct summary display element

// Hugging Face API integration for summarization
const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn'; // Hugging Face API URL
const API_KEY = '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'; // Replace with your actual Hugging Face API key

// Function to get summary from Hugging Face
async function getSummaryFromHuggingFace(content) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: content }), // Send content to be summarized
  });

  if (!response.ok) {
    throw new Error("Failed to fetch summary from Hugging Face.");
  }

  const data = await response.json();
  return data[0].summary_text; // Assuming the response contains 'summary_text' as the field
}

// Summarize Button (trigger Hugging Face API)
summarizeButton.addEventListener('click', async () => {
  try {
    status.textContent = "Fetching content..."; // Show fetching status

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Fetch visible content from the page
    const response = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText, // Extract all visible text from the page
    });

    const pageContent = response[0].result; // Content of the active page

    // Call Hugging Face API to summarize content
    const summary = await getSummaryFromHuggingFace(pageContent);

    // Display the summary in the popup
    summaryDiv.textContent = summary || "Summary not available.";

    // Save summary to localStorage for offline use
    localStorage.setItem('summary', summary);

    // Update status
    status.textContent = "Content summarized and saved!";
  } catch (error) {
    console.error("Error fetching summary:", error);
    status.textContent = "An error occurred while fetching the summary.";
    summaryDiv.textContent = 'Failed to fetch summary.';
  }
});

// View Saved Content (retrieve from localStorage)
viewSavedBtn.addEventListener('click', () => {
  const savedSummary = localStorage.getItem('summary');
  if (savedSummary) {
    contentDiv.textContent = savedSummary;
  } else {
    contentDiv.textContent = "No saved content available.";
  }
});
