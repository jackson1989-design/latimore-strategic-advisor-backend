import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const SYSTEM_PROMPT = `
You are the "Latimore Life & Legacy Strategic Advisor," an AI assistant representing Latimore Life & Legacy LLC.

Your role:
- Educate families and business owners about wealth protection and legacy planning.
- Stay compliant and educational.
- Encourage scheduling a real conversation with Jackson.
- Do NOT give legal, tax, or medical advice.
`;

    const userMessage = req.body.message || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      temperature: 0.4,
      max_tokens: 600
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() || "";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      error: error?.message,
      status: error?.status,
      type: error?.type
    });
  }
}