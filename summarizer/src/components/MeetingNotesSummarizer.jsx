// File: src/components/MeetingNotesSummarizer.jsx

// You will also need to add a new CSS file (e.g., globals.css in Next.js) for the custom scrollbar and backdrop filter
// or add the styles directly to your main stylesheet.

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Send,
  Copy,
  Download,
  FileText,
  Loader2,
  X,
  Plus,
  Moon,
  Sun,
  AlertCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MeetingNotesSummarizer = () => {
  // State management
  const [transcriptText, setTranscriptText] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light"); // 'dark' or 'light'
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Messages array to simulate chat messages (for chatbot style UI)
  const [messages, setMessages] = useState([
    {
      id: 0,
      from: "bot",
      type: "text",
      text: "Hello there! I can summarize meeting notes from a text transcript or a document. Paste your transcript below or upload a file to get started.",
    },
  ]);

  // Handle file selection, allowing .txt and .pdf files
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === "text/plain" ||
        selectedFile.type === "application/pdf" ||
        selectedFile.name.endsWith(".txt") ||
        selectedFile.name.endsWith(".pdf")
      ) {
        setFile(selectedFile);
        setTranscriptText(""); // Clear text input when a file is selected
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const errorMsg = {
          id: messages.length + 1,
          from: "bot",
          type: "error",
          text: "Please select a valid .txt or .pdf file.",
        };
        setMessages((prev) => [...prev, errorMsg]);
        e.target.value = "";
      }
    }
  };

  // Handle transcript text change
  const handleTextChange = (e) => {
    setTranscriptText(e.target.value);
    if (e.target.value) {
      setFile(null); // Clear file selection when text is entered
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle Enter key for text area
  const handleKeyDownInput = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle submit (send message)
  // Updated handleSubmit function in frontend (MeetingNotesSummarizer.jsx)

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!transcriptText.trim() && !file) {
      const errorMsg = {
        id: messages.length + 1,
        from: "bot",
        type: "error",
        text: "Please enter a transcript or upload a file to get a summary.",
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    setIsLoading(true);

    let userMsgText = file
      ? `File submitted: ${file.name}`
      : `Transcript submitted:\n${transcriptText.substring(0, 100)}...`;

    setMessages((prev) => [
      ...prev,
      { id: prev.length, from: "user", type: "text", text: userMsgText },
    ]);

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch("http://localhost:4000/api/summarize", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("http://localhost:4000/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: transcriptText }),
        });
      }

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { id: prev.length, from: "bot", type: "text", text: data.summary },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          from: "bot",
          type: "error",
          text: "Sorry, something went wrong while generating the summary. Please try again.",
        },
      ]);
      console.error(err);
    } finally {
      setIsLoading(false);
      setTranscriptText("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Copy summary text to clipboard
  const handleCopy = async (textToCopy) => {
    if (textToCopy && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (e) {
        console.error("Copy failed", e);
      }
    }
  };

  // Download summary as a .txt file
  const handleDownload = (content) => {
    if (!content) return;
    const element = document.createElement("a");
    const fileBlob = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `meeting-summary-${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Scroll chat container to bottom when messages update
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getThemeClasses = () => {
    return {
      bg: theme === "dark" ? "bg-zinc-950" : "bg-gray-50",
      text: theme === "dark" ? "text-gray-100" : "text-gray-900",
      headerBg: theme === "dark" ? "bg-zinc-900/50" : "bg-white/50",
      headerBorder: theme === "dark" ? "border-zinc-800" : "border-gray-200",
      inputBg: theme === "dark" ? "bg-zinc-800/50" : "bg-white/50",
      inputBorder: theme === "dark" ? "border-zinc-700" : "border-gray-300",
      placeholder:
        theme === "dark" ? "placeholder-zinc-500" : "placeholder-gray-400",
      userBubbleBg: theme === "dark" ? "bg-indigo-600" : "bg-indigo-500",
      userBubbleText: "text-white",
      botBubbleBg: theme === "dark" ? "bg-zinc-800" : "bg-white",
      botBubbleText: theme === "dark" ? "text-gray-100" : "text-gray-800",
      botIconBg: theme === "dark" ? "bg-indigo-500" : "bg-indigo-600",
      botIconText: "text-white",
      userIconBg: theme === "dark" ? "bg-zinc-700" : "bg-gray-300",
      userIconText: theme === "dark" ? "text-gray-200" : "text-gray-800",
      actionIcon:
        theme === "dark"
          ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
          : "text-gray-500 hover:bg-gray-200",
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div
      className={`flex flex-col h-screen antialiased font-sans ${themeClasses.bg} ${themeClasses.text}`}
    >
      {/* Chat Header */}
      <header
        className={`flex-none flex items-center justify-between p-4 border-b ${themeClasses.headerBg} ${themeClasses.headerBorder} z-10 backdrop-blur-md`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full ${themeClasses.botIconBg} ${themeClasses.botIconText} flex items-center justify-center shadow-md`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <h1
            className={`text-2xl font-extrabold tracking-tighter ${themeClasses.text}`}
          >
            Saransh
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${themeClasses.actionIcon} transition-colors`}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => {
              setMessages([
                {
                  id: 0,
                  from: "bot",
                  type: "text",
                  text: "Hello there! I can summarize meeting notes from a text transcript or a document. Paste your transcript below or upload a file to get started.",
                },
              ]);
              setTranscriptText("");
              setFile(null);
            }}
            className={`p-2 rounded-full ${themeClasses.actionIcon} transition-colors`}
            title="Start a new chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat messages container */}
      <main
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-4xl mx-auto flex items-start gap-3 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <div
                className={`w-10 h-10 flex-none rounded-full ${themeClasses.botIconBg} ${themeClasses.botIconText} flex items-center justify-center shadow`}
              >
                <FileText className="w-5 h-5" />
              </div>
            )}

            <div
              className={`flex flex-col max-w-[80%] p-4 rounded-2xl shadow-lg ${
                msg.from === "user"
                  ? `${themeClasses.userBubbleBg} ${themeClasses.userBubbleText} rounded-br-md`
                  : msg.type === "error"
                  ? "bg-red-600 text-white rounded-bl-md"
                  : `${themeClasses.botBubbleBg} ${themeClasses.botBubbleText} rounded-bl-md`
              } whitespace-pre-wrap break-words transition-colors duration-300`}
            >
              {/* Render Markdown instead of plain text */}
              {/* Render Markdown instead of plain text */}
              <div className="prose prose-sm sm:prose-base max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>

              {/* Action buttons for bot message */}
              {msg.from === "bot" && msg.type !== "error" && (
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={() => handleCopy(msg.text)}
                    className={`p-1 rounded-md ${themeClasses.actionIcon} transition-colors`}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(msg.text)}
                    className={`p-1 rounded-md ${themeClasses.actionIcon} transition-colors`}
                    title="Download as .txt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start max-w-4xl mx-auto gap-3">
            <div
              className={`w-10 h-10 flex-none rounded-full ${themeClasses.botIconBg} ${themeClasses.botIconText} flex items-center justify-center shadow`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div
              className={`flex flex-col max-w-[80%] p-4 rounded-2xl shadow-lg ${themeClasses.botBubbleBg} ${themeClasses.botBubbleText} rounded-bl-md`}
            >
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-gray-400 italic">
                  Generating summary...
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input Area fixed at bottom */}
      <footer
        className={`flex-none p-4 ${themeClasses.headerBg} ${themeClasses.headerBorder} border-t backdrop-blur-md`}
      >
        <div
          className={`max-w-4xl mx-auto flex items-end gap-3 rounded-3xl ${themeClasses.inputBg} ${themeClasses.inputBorder} border p-2 shadow-lg focus-within:ring-2 focus-within:ring-indigo-500 transition-colors`}
        >
          {/* File upload button */}
          <label
            htmlFor="file-upload"
            className={`flex-none flex items-center justify-center p-2 rounded-xl text-gray-500 ${themeClasses.actionIcon} transition-colors cursor-pointer`}
          >
            <Upload className="h-5 w-5" />
            <input
              id="file-upload"
              type="file"
              accept=".txt,text/plain,application/pdf"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
              disabled={isLoading}
            />
          </label>

          <div className="flex flex-col flex-grow">
            {/* Display selected file name with a remove button */}
            {file && (
              <div className="flex items-center gap-2 p-1 text-sm">
                {/* Gray background only behind icon + file name */}
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-md ${
                    theme === "dark"
                      ? "bg-zinc-700 text-gray-200"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>

                {/* Remove button outside gray box */}
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className={`p-1 rounded-full ${
                    theme === "dark"
                      ? "text-zinc-400 hover:bg-zinc-600"
                      : "text-gray-500 hover:bg-gray-300"
                  }`}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Text input area */}
            <textarea
              ref={textareaRef}
              value={transcriptText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDownInput}
              placeholder="Paste your transcript or upload a file to get started..."
              className={`w-full bg-transparent resize-none outline-none py-2 ${themeClasses.text} ${themeClasses.placeholder} max-h-40 overflow-y-auto font-medium transition-colors`}
              disabled={isLoading || !!file}
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!transcriptText.trim() && !file)}
            className={`flex-none p-3 rounded-full text-white transition-colors disabled:cursor-not-allowed
            ${
              theme === "dark"
                ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 disabled:text-zinc-500"
                : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500"
            }`}
            aria-label="Generate summary"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        {/* Error message */}
        {messages.some((msg) => msg.type === "error") && (
          <div className="mt-2 text-sm text-red-500 flex items-center gap-1 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{messages.find((msg) => msg.type === "error")?.text}</span>
          </div>
        )}
      </footer>
    </div>
  );
};

export default MeetingNotesSummarizer;
