import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC0Tygk5SVCePeSZrCSGpo2vL93i8IQ7FM";
const MODEL_NAME = "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export default {
  category: 'AI',
  name: 'Gemini',
  description: 'Chat With Gemini AI',
  method: 'GET',
  parameters: [
    { name: 'q', description: 'Your question for Gemini', required: true }
  ],
  async execute({ q }) {
    if (!q) {
      throw new Error("Parameter 'q' is required.");
    }
    
    try {
      const result = await model.generateContent(q);
      const response = await result.response;
      const text = response.text();
      
      return {
        creator: "Odzreshop",
        status: "success",
        result: text
      };
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to get response from Gemini AI.");
    }
  }
};
