```markdown
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

This project leverages Google’s Gemini AI model to transform lengthy meeting transcripts into concise and structured summaries. The app supports both direct text input and file uploads (.txt or .pdf), extracting textual content and passing it to the AI backend for summarization.

The backend calls the Gemini API securely, returning AI-generated markdown summaries that emphasize readability with headings, bullet points, and clear segmentation of information.

The frontend provides a polished, responsive chat-like interface where users can paste transcripts or upload files, view AI-generated summaries in real-time, and easily copy or download results.

---

## Features

- **Dual Input Modes:** Paste transcript text directly or upload a TXT/PDF file.
- **AI Summarization:** Uses Gemini API to generate detailed, structured summaries.
- **Markdown Formatting:** Summaries are delivered in Markdown with headings and lists for maximum clarity.
- **Chat Interface:** Interactive chatbot-style UI with conversational message bubbles.
- **Copy & Download:** Easily copy summaries to clipboard or download as text files.
- **Dark/Light Theme:** Toggle between light and dark UI themes for user comfort.
- **Error Handling:** User-friendly validation messages for missing or invalid inputs.
- **Responsive Design:** Works seamlessly across mobile, tablet, and desktop devices.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide React Icons  
- **Backend:** Node.js, Express.js, Multer (for file uploads), Axios, pdf-parse (for PDF text extraction)  
- **AI Service:** Google Gemini API (Generative Language Model)  
- **Deployment:** Can be deployed to platforms supporting Node.js & React (e.g., Vercel, Heroku, Railway, Netlify)  

---

## Application Flow

1. User visits the frontend interface.
2. User either pastes a meeting transcript or uploads a `.txt` / `.pdf` transcript file.
3. Frontend sends the text content or file to the backend API.
4. Backend extracts text (if file), constructs prompt, and calls Gemini API securely.
5. Gemini API returns a markdown-formatted summary.
6. Backend sends the summary to frontend.
7. Frontend displays the summary in chat bubble format.
8. User can copy or download the summary.

---

## Backend API Endpoints

### POST `/api/summarize`

- **Description:** Accepts either a JSON with transcript text or a multipart form with a transcript file. Parses the input, sends it to Gemini AI, and returns a markdown summary.

- **Request Formats:**

  - **JSON Body (for text input):**  
    ```
    {
      "content": "Full meeting transcript text here..."
    }
    ```

  - **Multipart Form-Data (for file upload):**  
    - `file`: `.txt` or `.pdf` file upload

- **Response:**  
  ```
  {
    "summary": "Markdown formatted meeting summary string"
  }
  ```

- **Error Codes:**
  - 400: Missing or invalid input
  - 500: Internal server error or API failure

---

## Frontend Overview

- React-based chat UI with:
  - Input textarea for transcript text
  - File upload (.txt, .pdf) with preview and clear option
  - Dark/light theme toggle
  - Submit button that triggers AI summarization
  - Chat bubbles for user inputs and AI responses
  - Copy and download buttons on AI messages
  - Auto-scroll behavior for conversation flow

---

## Setup and Installation

### Prerequisites

- Node.js (v16+ recommended)
- NPM or Yarn
- Google Cloud account with access to Gemini API and API key

### Backend Setup

1. Clone the repository and navigate to backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set your Gemini API key as an environment variable:

   - Linux/macOS:
     ```
     export GEMINI_API_KEY="your_api_key_here"
     ```
   - Windows (PowerShell):
     ```
     setx GEMINI_API_KEY "your_api_key_here"
     ```

4. Start the backend server:

   ```
   npm run dev
   ```
   
   Backend listens on port `4000` by default.

### Frontend Setup

1. Navigate to frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start development server:

   ```
   npm run dev
   ```

4. Open your browser and go to the provided local URL (e.g., `http://localhost:5173`).

---

## Usage

- Paste a full meeting transcript in the text input or upload a transcript file (.txt or .pdf).
- Click the "Send" or "Generate Summary" button.
- Wait for the AI to generate a structured summary formatted with bold headings and bullet points.
- View the summary in the chat interface.
- Copy the summary to clipboard or download it as a `.txt` file.

---

## Testing

Use this sample transcript for testing:

> Alice: Good morning everyone, thanks for joining the project kickoff meeting.  
> Bob: Morning, Alice. Excited to get started.  
> Carol: Hello all!  
> David: Hi team!  
> Alice: Let's begin by going over the project goals... (continue your full transcript here)

---

## Future Improvements

- Support for more file types (e.g., DOCX).
- Rich text summary editing within frontend.
- Export summary as PDF with styled formatting.
- User authentication and history saving.
- Real-time collaboration and multiple transcript inputs.

---

## License

This project is licensed under the MIT License.

---

> Created as a comprehensive AI meeting notes summarizer powered by Google Gemini and built with modern frontend and backend technologies.
```