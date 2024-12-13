import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'your-api-key', // In production, use environment variables
  dangerouslyAllowBrowser: true
});

export async function generateAnswer(question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful educational assistant specializing in economics and finance."
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    return response.choices[0].message.content || "I couldn't generate an answer.";
  } catch (error) {
    console.error('AI generation error:', error);
    return "Sorry, I couldn't generate an answer at this time.";
  }
}