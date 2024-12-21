const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Google Generative AI setup
const apiKey = "AIzaSyD1_sKgu6RcpT6D0ekCAAi6k1pKnIZfSa8";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to analyze the priority
async function analyzePriority(taskDescription) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: `Analyze the priority of this task: Respond with "high", "medium", or "low". "${taskDescription}"` }
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(taskDescription);
  return result.response.text();
}

// API endpoint
app.post("/get-priority", async (req, res) => {
  const { taskDescription } = req.body;

  if (!taskDescription) {
    return res.status(400).json({ error: "Task description is required" });
  }

  try {
    const priority = await analyzePriority(taskDescription);
    res.json({ priority });
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze priority" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
