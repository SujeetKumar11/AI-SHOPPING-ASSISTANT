const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Required for making API requests
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS Configuration (Allow only your frontend)
app.use(cors({
    origin: "https://67b7b0149c941b83d6f6c3aa--cozy-peony-2d6608.netlify.app/", // Your frontend URL
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));

app.use(express.json());
app.use(express.static("public")); // Serve frontend files

app.post("/api/gemini", async (req, res) => {
    try {
        const query = req.body.query;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!query) {
            return res.status(400).json({ response: "error", error: "Query is required!" });
        }

        if (!apiKey) {
            return res.status(500).json({ response: "error", error: "API Key is missing! Check your .env file." });
        }

        console.log("Sending request to Gemini API...");

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }]
            })
        });

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            return res.json({ response: "error", error: "No valid response from AI" });
        }

        res.json({ response: data.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error("Error fetching AI response:", error);
        res.status(500).json({ response: "error", error: error.message || "Internal server error" });
    }
});

// ✅ Start Server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
