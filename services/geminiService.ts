
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
      - Current Status: ${userInfo.persona === 'professional' ? 'Working Professional' : `${userInfo.persona.charAt(0).toUpperCase() + userInfo.persona.slice(1)} Student`}
    `;

    // Add persona-specific fields and common data
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
      prompt += `\n- Core Competencies & Strengths: ${formData.cognitiveAbilities}`;
      prompt += `\n- Professional Interests & Passions: ${formData.interests}`;
      if (formData.achievements) prompt += `\n- Professional Achievements: ${formData.achievements}`;
      if (formData.certifications) prompt += `\n- Professional Development & Certifications: ${formData.certifications}`;
    } else {
      // For school and college
      prompt += `\n- Interests: ${formData.interests}`;
      if (formData.physicalActivities) prompt += `\n- Physical Activities: ${formData.physicalActivities}`;
      prompt += `\n- Thinking Style: ${formData.cognitiveAbilities}`;
      if (formData.achievements) prompt += `\n- Academic Achievements: ${formData.achievements}`;
      if (formData.certifications) prompt += `\n- Certifications & Courses: ${formData.certifications}`;
      if (formData.extracurriculars) prompt += `\n- Extracurriculars: ${formData.extracurriculars}`;
    }

    prompt += `

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
