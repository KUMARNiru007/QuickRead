document.getElementById('summarizeBtn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: summarizePage
      });
    });
  });
  
  function summarizePage() {
    alert('Summarizing page content...');
  }
  