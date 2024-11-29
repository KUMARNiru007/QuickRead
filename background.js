chrome.runtime.onInstalled.addListener((details) => {
  console.log("QuickRead extension installed.");
  
  if (details.reason === "install") {
      console.log("First-time installation.");
      // Perform first-time installation tasks, like setting default settings
  } else if (details.reason === "update") {
      console.log("Extension updated.");
      // Perform tasks that should happen on update (e.g., database migration)
  }
});
