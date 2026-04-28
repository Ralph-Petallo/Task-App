export const sendMessageToGemini = async (
  message: string,
  todoData: { active: any[]; finished: any[]; trashed: any[] }
) => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const apiUrl = process.env.EXPO_PUBLIC_GEMINI_API_URL;

  const prompt = `
    You are a helpful AI assistant inside a TODO app.
    
    Current User Data:
    - Active Tasks: ${JSON.stringify(todoData.active)}
    - Finished Tasks: ${JSON.stringify(todoData.finished)}
    - Trashed Tasks: ${JSON.stringify(todoData.trashed)}

    User message: ${message}

    Respond in a helpful, short, and friendly way.
  `;

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to answer that.";
  } catch (error) {
    console.error(error);
    return "Error talking to AI buddy.";
  }
};