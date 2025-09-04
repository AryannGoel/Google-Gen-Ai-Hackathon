
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
    const profileDetails: string[] = [
      `- Name: ${userInfo.name}`,
      `- Age: ${userInfo.age}`,
    ];

    if (userInfo.persona === 'professional') {
      profileDetails.push(`- Current Status: Working Professional`);
      if (formData.jobTitle) profileDetails.push(`- Job Title: ${formData.jobTitle}`);
      if (formData.industry) profileDetails.push(`- Industry: ${formData.industry}`);
      profileDetails.push(`- Core Competencies & Strengths: ${formData.cognitiveAbilities}`);
      if (formData.achievements) profileDetails.push(`- Professional Achievements: ${formData.achievements}`);
      if (formData.certifications) profileDetails.push(`- Professional Development & Certifications: ${formData.certifications}`);
    } else {
      profileDetails.push(`- Current Status: ${userInfo.persona.charAt(0).toUpperCase() + userInfo.persona.slice(1)} Student`);
      if (userInfo.persona === 'school' && formData.grade) {
        profileDetails.push(`- Grade: ${formData.grade}`);
      }
      if (userInfo.persona === 'college') {
        if (formData.degree) profileDetails.push(`- Degree / Field of Study: ${formData.degree}`);
        if (formData.expertise) profileDetails.push(`- Key Expertise: ${formData.expertise}`);
      }
      profileDetails.push(`- Interests: ${formData.interests}`);
      if (formData.physicalActivities) profileDetails.push(`- Physical Activities: ${formData.physicalActivities}`);
      profileDetails.push(`- Thinking Style: ${formData.cognitiveAbilities}`);
      if (formData.achievements) profileDetails.push(`- Academic Achievements: ${formData.achievements}`);
      if (formData.certifications) profileDetails.push(`- Certifications & Courses: ${formData.certifications}`);
      if (formData.extracurriculars) profileDetails.push(`- Extracurriculars: ${formData.extracurriculars}`);
    }

    const prompt = `
      Here is a user's profile:
      ${profileDetails.join('\n      ')}

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