export const sendMessageToGemini = async (
  message: string,
  tasks: any[]
) => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const apiUrl = process.env.EXPO_PUBLIC_GEMINI_API_URL;

  const prompt = `
You are a helpful AI assistant inside a TODO app.

User tasks:
${JSON.stringify(tasks)}

User message:
${message}

Respond in a helpful and short way.
`;

  try {
    const response = await fetch(
      `${apiUrl}?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  } catch (error) {
    console.error(error);
    return "Error talking to AI";
  }
};