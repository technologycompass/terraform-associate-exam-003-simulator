import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, EXAM_TOPIC_CONFIG, TopicConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questionText: { type: Type.STRING, description: "The text of the exam question." },
    codeSnippet: { type: Type.STRING, description: "Optional Terraform HCL code snippet if relevant. Null if not needed.", nullable: true },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of possible answers (usually 4, or 2 for True/False).",
    },
    correctAnswerIndices: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: "Array of zero-based indices corresponding to the correct options.",
    },
    explanation: { type: Type.STRING, description: "Detailed explanation of the answer." },
    domain: { type: Type.STRING, description: "The exact Exam Topic name this question belongs to." },
  },
  required: ["questionText", "options", "correctAnswerIndices", "explanation", "domain"],
};

const examSchema: Schema = {
  type: Type.ARRAY,
  items: questionSchema,
  description: "A list of practice exam questions.",
};

const generateBatch = async (topics: TopicConfig[], batchId: string): Promise<Omit<Question, 'id'>[]> => {
  const topicDescriptions = topics.map(t => `- ${t.name} (Generate exactly ${t.questionCount} questions)`).join('\n');
  
  const prompt = `
    You are an exam engine for HashiCorp Terraform Associate (003).
    Generate a subset of questions for a practice exam.
    
    Requirements:
    1. Generate exactly the number of questions requested per topic below.
    2. Questions must be strictly aligned with the "003" exam version.
    3. Mix of Multiple Choice (single answer), Multiple Select (multiple answers), and True/False.
    4. For "Text Match" style questions, present them as Multiple Choice with command/code options.
    5. Use HCL code snippets frequently (especially for config/module topics).
    
    Topics for this batch:
    ${topicDescriptions}
    
    Return ONLY the JSON array.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: examSchema,
      temperature: 0.7,
    },
  });

  const rawText = response.text;
  if (!rawText) return [];
  return JSON.parse(rawText) as Omit<Question, 'id'>[];
};

export const generatePracticeTest = async (testId: number): Promise<Question[]> => {
  // Split topics into two batches to ensure we don't hit output token limits or timeouts
  // Batch A: Topics 1-5 (29 questions)
  // Batch B: Topics 6-9 (28 questions)
  
  const batchA_Topics = EXAM_TOPIC_CONFIG.slice(0, 5);
  const batchB_Topics = EXAM_TOPIC_CONFIG.slice(5);

  try {
    const [batchA_Results, batchB_Results] = await Promise.all([
      generateBatch(batchA_Topics, 'A'),
      generateBatch(batchB_Topics, 'B')
    ]);

    const allQuestions = [...batchA_Results, ...batchB_Results];

    // Hydrate with IDs
    return allQuestions.map((q, index) => ({
      ...q,
      id: index + 1,
    }));

  } catch (error) {
    console.error("Failed to generate test:", error);
    throw error;
  }
};