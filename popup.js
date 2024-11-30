// DOM Elements
const summarizeButton = document.getElementById('summarizeButton');
const viewSavedBtn = document.getElementById('viewSavedBtn');
const status = document.getElementById("status");
const summaryDiv = document.getElementById('summary'); // The element where the summary will be displayed
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Hugging Face API integration
async function getGeminiSummary(content) {
  const apiKey = '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'; 
  const apiUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn'; // 
  // Requesting the summary from Hugging Face API
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: content }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || !data[0]?.summary_text) {
      throw new Error("Summary not available");
    }

    return data[0].summary_text; // Return the summary from the API response
  } catch (error) {
    console.error("Error fetching summary:", error);
    status.textContent = "An error occurred while fetching the summary.";
    summaryDiv.textContent = 'Failed to fetch summary.';
    throw error; // Re-throw error to handle it in the caller function
  }
}

// Enhanced content extraction for Wikipedia and other pages
function getContentFromPage() {
  let content = '';

  if (window.location.hostname.includes('wikipedia.org')) {
    // Specific extraction logic for Wikipedia
    const articleBody = document.querySelector('div.mw-parser-output');
    if (articleBody) {
      content = articleBody.innerText.trim();
    }
  } else {
    // Fallback: Extracts text from the whole page
    content = document.body.innerText.trim();
  }

  return content;
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
      func: getContentFromPage, // Use the refined content extraction function
    });

    const pageContent = response[0].result;

    // Limit the content length if it’s too large (max 5000 characters)
    const maxLength = 5000; // Limit content length to avoid overloading the API
    const truncatedContent = pageContent.length > maxLength ? pageContent.slice(0, maxLength) : pageContent;

    // Call Hugging Face API to summarize content
    const summary = await getGeminiSummary(truncatedContent);

    // Display the summary in the popup
    summaryDiv.textContent = summary || "Summary not available.";

    // Save summary with a timestamp in localStorage
    const savedSummaries = JSON.parse(localStorage.getItem('summaries')) || [];
    const timestamp = new Date().toLocaleString();
    savedSummaries.push({ summary, timestamp });
    localStorage.setItem('summaries', JSON.stringify(savedSummaries));

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
  const savedSummaries = JSON.parse(localStorage.getItem('summaries')) || [];
  summaryDiv.innerHTML = ''; // Clear previous content

  if (savedSummaries.length > 0) {
    savedSummaries.forEach((entry, index) => {
      const entryDiv = document.createElement('div');
      entryDiv.style.marginBottom = '10px';
      entryDiv.innerHTML = `<strong>Summary ${index + 1}:</strong> <em>${entry.timestamp}</em><br>${entry.summary}`;
      summaryDiv.appendChild(entryDiv);
    });
  } else {
    summaryDiv.textContent = "No saved summaries available.";
  }
});
// Event listener to clear the history of saved content
clearHistoryBtn.addEventListener('click', () => {
  if (window.confirm("Are you sure you want to clear all saved summaries?")) {
    // Clear all saved summaries from localStorage
    localStorage.removeItem('summaries');
    
    // Update the UI to reflect the change
    summaryDiv.innerHTML = 'Saved summaries have been cleared.';
    status.textContent = 'History cleared!';
  }
});
