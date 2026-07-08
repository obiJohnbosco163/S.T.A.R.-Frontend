import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve assets directory statically for background music and visual assets
app.use("/assets", express.static(path.join(process.cwd(), "public/assets")));

// Lazy-loaded Gemini Client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured on the server. Please add your Gemini API key in the AI Studio Settings / Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Route for Running the Agent
app.post("/api/run-agent", async (req, res) => {
  try {
    const { inputOne, inputTwo } = req.body;

    // Validate inputs
    if (!inputOne || !inputOne.trim()) {
      return res.status(400).json({ error: "Agent Directive is required." });
    }
    if (!inputTwo || !inputTwo.trim()) {
      return res.status(400).json({ error: "Source Context / Input Data is required." });
    }

    // Get the authenticated Gemini client (handles missing key gracefully)
    const ai = getGeminiClient();

    // Call Gemini to act as S.T.A.R.
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `CONTEXT / INPUT DATA:
---------------------------------------------
${inputTwo.trim()}
---------------------------------------------

Please execute the following directive precisely based on the provided context:
"${inputOne.trim()}"`,
      config: {
        systemInstruction: "You are S.T.A.R. (Sleek Tactical Agent Runner), a state-of-the-art elite AI agent processor. Execute the directive with maximum precision, absolute analytical clarity, and meticulous detail. Provide a beautifully formatted, structured, and comprehensive response. Use markdown table formats, bullet points, or sections if helpful.",
      },
    });

    const outputText = response.text;
    
    if (!outputText) {
      throw new Error("The agent completed the operation but returned an empty response.");
    }

    res.json({ result: outputText });
  } catch (error: any) {
    console.error("S.T.A.R. Agent execution failed:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during agent execution." });
  }
});

// Configure Vite middleware or serve static files
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[S.T.A.R. Server] Running on http://0.0.0.0:${PORT} [Mode: ${process.env.NODE_ENV || "development"}]`);
  });
}

// Only start the server if we're running this file directly (not inside Vercel serverless environment)
if (process.env.VERCEL !== "1") {
  setupServer();
}

export default app;
