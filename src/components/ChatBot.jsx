import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatBot = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

const askAI = async () => {
  if (!prompt.trim() || loading) return;

  if (prompt.length > 1000) {
    setResponse("⚠️ Please keep your query under 1000 characters.");
    return;
  }

  const emergencyKeywords = [
    "chest pain",
    "difficulty breathing",
    "can't breathe",
    "stroke",
    "seizure",
    "unconscious",
    "severe bleeding",
    "heart attack",
  ];

  const isEmergency = emergencyKeywords.some((keyword) =>
    prompt.toLowerCase().includes(keyword)
  );

  if (isEmergency) {
    setResponse(`
# 🚨 Emergency Warning

Your symptoms may indicate a medical emergency.

- Seek immediate medical attention.
- Contact emergency services if necessary.
- Do not rely solely on AI guidance.

**This information is for educational purposes and is not a medical diagnosis.**
`);
    return;
  }

  setLoading(true);
  setResponse("");

  try {
    let res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "system",
              content: `
You are Prescripto AI Health Assistant.

Rules:
- Be friendly and professional.
- Keep answers under 120 words.
- Use headings and bullet points.
- Explain possible causes briefly.
- Give practical precautions.
- Mention when the user should see a doctor.
- Never provide a final diagnosis.
- Never prescribe medicines.
- End every response with:
"This information is for educational purposes and is not a medical diagnosis."
              `,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    let data = await res.json();

    if (!res.ok) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b:free",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      data = await res.json();
    }

    if (!res.ok) {
      throw new Error("AI service temporarily unavailable");
    }

    setResponse(
      data?.choices?.[0]?.message?.content ||
      "No response received."
    );
  } catch (err) {
    console.error(err);

    setResponse(`
⚠️ AI service is currently busy.

Please wait a few seconds and try again.
`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-center mb-2">
        🩺 Prescripto AI Health Assistant
      </h2>

      <p className="text-center text-sm text-gray-500 mb-6">
        AI-powered symptom guidance. Not a substitute for
        professional medical advice.
      </p>

      <textarea
        className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="5"
        placeholder="Example: I have fever, headache, and body pain for 2 days. What should I do?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askAI();
          }
        }}
      />

      <div className="text-right text-sm text-gray-500 mt-1">
        {prompt.length}/1000
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={askAI}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Ask AI"}
        </button>

        <button
          onClick={() => {
            setPrompt("");
            setResponse("");
          }}
          className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-lg"
        >
          Clear
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <span className="animate-pulse">🩺</span>
            Analyzing symptoms...
          </div>
        ) : response ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm prose max-w-none overflow-x-auto">
            <ReactMarkdown>{response}</ReactMarkdown>

            <hr className="my-3" />

            <p className="text-xs text-gray-500">
              AI-generated guidance. Consult a healthcare professional for medical advice.
            </p>
          </div>
        ) : (
          <div className="text-gray-400 text-sm mt-2">
            Enter your symptoms above and click "Ask AI".
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;