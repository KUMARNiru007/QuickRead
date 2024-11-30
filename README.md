# QuickRead - Chrome Extension

**QuickRead** is a Chrome extension that allows users to quickly summarize content from any webpage. It leverages the power of AI to provide concise summaries and can save these summaries for later use. Additionally, the extension offers an offline mode where previously saved summaries can be accessed, making it a handy tool for both online and offline use.

This project is being developed for the **Google Chrome Built-in AI Challenge**.

---

## Features

- **Summarize Web Content**: Quickly summarize the content of any webpage with a single click.
- **Save Summaries**: Saved summaries are stored locally and can be accessed later.
- **Offline Mode**: View previously saved summaries even when not connected to the internet.
- **Clear History**: Clear all saved summaries with the "Clear History" button.
- **AI-Powered**: Utilizes Hugging Face’s AI model for generating summaries.

---

## Installation

### 1. Clone this repository

```bash
git clone https://github.com/yourusername/QuickRead.git
```

### 2. Open Chrome Extensions Page

Open Google Chrome and navigate to chrome://extensions/.
Enable Developer Mode by toggling the switch in the top-right corner.
### 3. Load Extension

Click on the Load unpacked button.
Select the QuickRead folder from the cloned repository.
Your extension is now installed and ready to use!

## Usage
Once installed, the extension will add a button to your Chrome toolbar. Here's how to use it:

### **Summarize Web Content**
1. Navigate to any webpage you want to summarize.
2. Click on the **QuickRead** extension icon in the toolbar.
3. Click the **Summarize** button.
4. The extension will summarize the content of the page using AI.

### **View Saved Summaries**
1. Click the **View Saved** button to view all your previously saved summaries.
2. Summaries are displayed with the timestamp of when they were saved.

### **Clear History**
1. Click on the **Clear History** button to remove all saved summaries from local storage.
2. The summaries will be erased from the local history.

---

## Technologies Used

- **Chrome Extensions API**: For building the extension and interacting with the browser.
- **Hugging Face API**: For AI-powered content summarization using the Gemini model.
- **JavaScript**: For handling the logic behind summarizing, saving, and managing data.
- **HTML/CSS**: For building the extension's UI.
- **LocalStorage**: For saving summaries locally, allowing offline access.
