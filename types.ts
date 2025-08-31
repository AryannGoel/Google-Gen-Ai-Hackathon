
export type UserPersona = 'school' | 'college' | 'professional';

export interface UserInfo {
  name: string;
  age: string;
  persona: UserPersona;
}

export interface CareerFormData {
  // Common fields
  interests: string;
  physicalActivities: string;
  cognitiveAbilities: string;
  extracurriculars: string;
  
  // School-specific
  grade?: string;
  
  // College-specific
  degree?: string;
  expertise?: string;
  
  // Professional-specific
  jobTitle?: string;
  industry?: string;

  // Shared achievements/certs
  achievements: string; // Renamed for broader use
  certifications: string;
}