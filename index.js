import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// API route
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  console.log("Incoming message:", userMessage);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_Darling}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json(); // IMPORTANT: Must await this before using `data`
    console.log("API response:", JSON.stringify(data, null, 2));

    const reply = data.choices?.[0]?.message?.content;
    res.json({ reply });

  } catch (err) {
    console.error("Error from API:", err);
    res.status(500).json({ error: err.toString() });
  }
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
