
import { GoogleGenAI } from "@google/genai";
import type { CareerFormData, UserInfo } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateCareerAdvice = async (userInfo: UserInfo, formData: CareerFormData): Promise<string> => {
  try {
    let prompt = `
      Here is a user's profile:
      - Name: ${userInfo.name}
      - Age: ${userInfo.age}
      - Current Status: ${userInfo.persona.charAt(0).toUpperCase() + userInfo.persona.slice(1)} Student
    `;

    // Add persona-specific fields
    if (userInfo.persona === 'school' && formData.grade) {
      prompt += `\n- Grade: ${formData.grade}`;
    }
    if (userInfo.persona === 'college') {
      if (formData.degree) prompt += `\n- Degree / Field of Study: ${formData.degree}`;
      if (formData.expertise) prompt += `\n- Key Expertise: ${formData.expertise}`;
    }
    if (userInfo.persona === 'professional') {
      if (formData.jobTitle) prompt += `\n- Job Title: ${formData.jobTitle}`;
      if (formData.industry) prompt += `\n- Industry: ${formData.industry}`;
    }

    // Add common fields
    prompt += `
      - Interests: ${formData.interests}
      - Physical Activities: ${formData.physicalActivities}
      - Cognitive Abilities: ${formData.cognitiveAbilities}
      - Achievements: ${formData.achievements}
      - Certifications & Courses: ${formData.certifications}
      - Extracurriculars: ${formData.extracurriculars}

      Based on this comprehensive profile, please provide a personalized career path recommendation.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    if (error instanceof Error) {
        return `An error occurred while generating your career advice: ${error.message}. Please try again later.`;
    }
    return "An unknown error occurred. Please try again later.";
  }
};