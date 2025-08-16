// File: server/index.js

import express from "express";
import multer from "multer";
import axios from "axios";
import cors from "cors";
import pdfParse from "pdf-parse/lib/pdf-parse.js";


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable not set. Exiting.");
  process.exit(1);
}

const upload = multer({ storage: multer.memoryStorage() });

const buildPrompt = (text) => `
Summarize the following meeting transcript as a single, structured summary in Markdown format. 

**Rules:**

- Use clear Markdown headings (e.g., ## Summary, ## Action Items, ## Attendance, ## Topics Covered).
- Highlight key points (main headings) with double asterisks (**bold**), or use Markdown headers.
- For lists (like action items or attendees), use bullet points (-) or numbered lists.
- Group all sections into one markdown-formatted response.
- Do NOT output code blocks or JSON. Do NOT use triple backticks.
- Do NOT include any AI explanation or disclaimer.
- If any field is missing, omit that section.

**Sections to include if present:**
- Summary: concise summary of key points and decisions
- Action Items: list with assignee and deadline if available (e.g., "- Draft creative concepts — Alice (by April 20)")
- Attendance: list of attendees
- Topics Covered: main topics discussed

Transcript:
${text}
`;

app.post(
  "/api/summarize",
  upload.single("file"),
  async (req, res) => {
    try {
      let transcriptText = "";

      if (req.file) {
        const file = req.file;
        if (
          file.mimetype === "application/pdf" ||
          file.originalname.toLowerCase().endsWith(".pdf")
        ) {
          const pdfData = await pdfParse(file.buffer);
          transcriptText = pdfData.text || "";
        } else if (
          file.mimetype === "text/plain" ||
          file.originalname.toLowerCase().endsWith(".txt")
        ) {
          transcriptText = file.buffer.toString("utf-8");
        } else {
          return res
            .status(400)
            .json({ error: "Unsupported file type. Only .txt and .pdf allowed." });
        }
      } else if (req.body.content) {
        transcriptText = req.body.content;
      } else {
        return res.status(400).json({ error: "No transcript text or file uploaded." });
      }

      if (!transcriptText.trim()) {
        return res.status(400).json({ error: "Empty transcript content." });
      }

      const prompt = buildPrompt(transcriptText);

      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const summary =
        geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return res.json({ summary });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Failed to generate summary." });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
