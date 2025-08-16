````markdown
# AI Meeting Notes Summarizer

An AI-powered full-stack application that summarizes meeting transcripts or documents into well-structured, easy-to-understand summaries. Users can either paste meeting conversation transcripts or upload transcript files (TXT or PDF), and receive detailed summaries highlighting key points, action items, attendance, and topics discussed — all presented in clean Markdown format.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Application Flow](#application-flow)  
- [Backend API Endpoints](#backend-api-endpoints)  
- [Frontend Overview](#frontend-overview)  
- [Setup and Installation](#setup-and-installation)  
- [Usage](#usage)  
- [Testing](#testing)  
- [Future Improvements](#future-improvements)  
- [License](#license)  

---

## Project Overview

This project leverages **Google’s Gemini AI model** to transform lengthy meeting transcripts into concise and structured summaries. The app supports both direct text input and file uploads (`.txt` or `.pdf`), extracting textual content and passing it to the AI backend for summarization.

The backend calls the Gemini API securely, returning AI-generated Markdown summaries that emphasize readability with headings, bullet points, and clear segmentation of information.

The frontend provides a polished, responsive chat-like interface where users can paste transcripts or upload files, view AI-generated summaries in real-time, and easily copy or download results.

---

## Features

- **Dual Input Modes:** Paste transcript text directly or upload a TXT/PDF file.  
- **AI Summarization:** Uses Gemini API to generate detailed, structured summaries.  
- **Markdown Formatting:** Summaries are delivered in Markdown with headings and lists.  
- **Chat Interface:** Interactive chatbot-style UI with conversational message bubbles.  
- **Copy & Download:** Copy summaries to clipboard or download as `.txt`.  
- **Dark/Light Theme:** Toggle between light and dark UI themes.  
- **Error Handling:** User-friendly validation messages for missing/invalid inputs.  
- **Responsive Design:** Works seamlessly across mobile, tablet, and desktop.  

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide React Icons  
- **Backend:** Node.js, Express.js, Multer (file uploads), Axios, pdf-parse (PDF extraction)  
- **AI Service:** Google Gemini API  
- **Deployment:** Vercel, Heroku, Railway, Netlify (any Node.js + React host)  

---

## Application Flow

1. User visits the frontend.  
2. User either pastes a meeting transcript or uploads a `.txt`/`.pdf`.  
3. Frontend sends the text or file to the backend API.  
4. Backend extracts text (if file), constructs a prompt, and calls Gemini API securely.  
5. Gemini API returns a Markdown-formatted summary.  
6. Backend sends the summary back to frontend.  
7. Frontend displays the summary in chat bubbles.  
8. User can copy or download the summary.  

---

## Backend API Endpoints

### `POST /api/summarize`

**Description:**  
Accepts either a JSON body with transcript text or a multipart form with a transcript file. Parses the input, sends it to Gemini AI, and returns a Markdown summary.

**Request Formats:**

- **JSON Body (text input):**
  ```json
  {
    "content": "Full meeting transcript text here..."
  }
````

* **Multipart Form-Data (file upload):**

  * `file`: `.txt` or `.pdf` file

**Response:**

```json
{
  "summary": "Markdown formatted meeting summary string"
}
```

**Error Codes:**

* `400`: Missing or invalid input
* `500`: Internal server error or API failure

---

## Frontend Overview

* React-based chat UI with:

  * Textarea for transcript input
  * File upload (.txt, .pdf) with preview & clear option
  * Dark/light theme toggle
  * Submit button triggering AI summarization
  * Chat bubbles for user inputs & AI responses
  * Copy/download buttons for summaries
  * Auto-scroll for smooth conversation flow

---

## Setup and Installation

### Prerequisites

* Node.js (v16+)
* npm or Yarn
* Google Cloud account with Gemini API key

### Backend Setup

1. Clone repo & navigate to backend:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set Gemini API key as environment variable:

   **Linux/macOS:**

   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

   **Windows (PowerShell):**

   ```powershell
   setx GEMINI_API_KEY "your_api_key_here"
   ```

4. Start backend server:

   ```bash
   npm run dev
   ```

   Server listens on port `4000` by default.

### Frontend Setup

1. Navigate to frontend:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start dev server:

   ```bash
   npm run dev
   ```
4. Open browser at the shown local URL (e.g., `http://localhost:5173`).

---

## Usage

* Paste a transcript or upload `.txt` / `.pdf`.
* Click **Send / Generate Summary**.
* Wait for AI to generate a structured Markdown summary.
* View results in the chat interface.
* Copy or download summary as `.txt`.

---

## Testing

Use this sample transcript:

```
Alice: Good morning everyone, thanks for joining the project kickoff meeting.  
Bob: Morning, Alice. Excited to get started.  
Carol: Hello all!  
David: Hi team!  
Alice: Let's begin by going over the project goals...
```

---

## Future Improvements

* Support `.docx` and more file types.
* Rich text editing for summaries.
* Export summaries as styled PDF.
* User authentication & history saving.
* Real-time collaboration with multi-user input.

---

## License

This project is licensed under the **MIT License**.

---

```
