
import React, { useState } from 'react';
import type { CareerFormData, UserPersona } from '../types';
import { LightbulbIcon, DumbbellIcon, BrainIcon, SparklesIcon, AcademicCapIcon, DocumentTextIcon, UsersIcon, BriefcaseIcon, TargetIcon } from './icons';

interface CareerFormProps {
  onSubmit: (data: CareerFormData) => void;
  isLoading: boolean;
  persona: UserPersona;
}

const FormField: React.FC<{
    id: keyof CareerFormData,
    label: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    icon: React.ReactNode,
    as?: 'textarea' | 'input',
    required?: boolean
}> = ({ id, label, placeholder, value, onChange, icon, as = 'textarea', required = false }) => (
    <div>
        <label htmlFor={id} className="flex items-center text-lg font-semibold text-brand-text mb-2">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        {as === 'textarea' ? (
            <textarea
                id={id}
                name={id}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-lightblue focus:border-brand-lightblue transition-all duration-200 bg-gray-100 text-gray-900 focus:bg-white"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        ) : (
            <input
                id={id}
                name={id}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-lightblue focus:border-brand-lightblue transition-all duration-200 bg-gray-100 text-gray-900 focus:bg-white"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        )}
    </div>
);


const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <fieldset className="border-t border-gray-200 pt-6 mt-6">
        <legend className="text-xl font-bold text-brand-text px-2">{title}</legend>
        <div className="space-y-6 mt-4">
            {children}
        </div>
    </fieldset>
);


export const CareerForm: React.FC<CareerFormProps> = ({ onSubmit, isLoading, persona }) => {
  const [formData, setFormData] = useState<CareerFormData>({
    interests: '',
    physicalActivities: '',
    cognitiveAbilities: '',
    achievements: '',
    certifications: '',
    extracurriculars: '',
    grade: '',
    degree: '',
    expertise: '',
    jobTitle: '',
    industry: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isProfessional = persona === 'professional';

  const achievementsLabel = isProfessional ? 'Professional Achievements' : 'Academic Achievements';
  const achievementsPlaceholder = isProfessional
    ? "e.g., Led a major project, received 'Employee of the Month', increased team efficiency by 20%..."
    : "e.g., Won the school science fair, top marks in mathematics, published a story in the school magazine...";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
       {(persona === 'school' || persona === 'college') && (
        <div>
            <label htmlFor="apaarId" className="flex items-center text-lg font-semibold text-brand-text mb-2">
                APAAR ID (Automated Permanent Academic Account Registry)
            </label>
            <input
                id="apaarId"
                name="apaarId"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                placeholder="Future Integration for Indian National Student ID"
                disabled
            />
            <p className="text-sm text-gray-500 mt-1">This feature is for demonstration purposes to show how a national ID could connect to a student's lifelong learning portfolio.</p>
        </div>
       )}

      <FormSection title={isProfessional ? "Your Professional Profile" : "About You"}>
          {!isProfessional && (
            <>
              <FormField
                id="interests"
                label="Your Interests"
                placeholder="e.g., building with LEGOs, drawing fantasy maps, reading about ancient history, video games..."
                value={formData.interests}
                onChange={handleChange}
                icon={<LightbulbIcon />}
                required
              />
              <FormField
                  id="physicalActivities"
                  label="Your Physical Activities"
                  placeholder="e.g., love running long distances, good at team sports like basketball, enjoy hiking and being outdoors..."
                  value={formData.physicalActivities}
                  onChange={handleChange}
                  icon={<DumbbellIcon />}
                  required
              />
            </>
          )}
          <FormField
            id="cognitiveAbilities"
            label={isProfessional ? "Core Competencies & Strengths" : "Your Thinking Style"}
            placeholder={isProfessional ? "e.g., Strategic planning, complex problem-solving, cross-functional team leadership, data analysis..." : "e.g., I'm great at puzzles and logic games, I enjoy debating and seeing different perspectives, I'm very imaginative..."}
            value={formData.cognitiveAbilities}
            onChange={handleChange}
            icon={<BrainIcon />}
            required
          />
      </FormSection>

      <FormSection title={isProfessional ? "Experience & Qualifications" : "Your Experience & Activities"}>
          {persona === 'school' && (
             <FormField
                id="grade"
                label="Current Grade"
                placeholder="e.g., 10th Grade"
                value={formData.grade!}
                onChange={handleChange}
                icon={<AcademicCapIcon />}
                as="input"
              />
          )}
          {persona === 'college' && (
            <>
              <FormField
                id="degree"
                label="Degree / Field of Study"
                placeholder="e.g., Bachelor of Science in Computer Science"
                value={formData.degree!}
                onChange={handleChange}
                icon={<AcademicCapIcon />}
                as="input"
              />
              <FormField
                id="expertise"
                label="Key Expertise / Subjects"
                placeholder="e.g., Machine Learning, Data Structures, Web Development"
                value={formData.expertise!}
                onChange={handleChange}
                icon={<SparklesIcon />}
              />
            </>
          )}
          {isProfessional && (
            <>
              <FormField
                id="jobTitle"
                label="Current Job Title"
                placeholder="e.g., Software Engineer, Marketing Manager"
                value={formData.jobTitle!}
                onChange={handleChange}
                icon={<BriefcaseIcon />}
                as="input"
                required
              />
              <FormField
                id="industry"
                label="Industry"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={formData.industry!}
                onChange={handleChange}
                icon={<BriefcaseIcon />}
                as="input"
                required
              />
            </>
          )}
          <FormField
            id="achievements"
            label={achievementsLabel}
            placeholder={achievementsPlaceholder}
            value={formData.achievements}
            onChange={handleChange}
            icon={isProfessional ? <TargetIcon /> : <AcademicCapIcon />}
          />
          <FormField
            id="certifications"
            label={isProfessional ? "Professional Development & Certifications" : "Certifications & Courses"}
            placeholder={isProfessional ? "e.g., PMP Certification, Advanced Google Analytics, AWS Certified Solutions Architect..." : "e.g., Completed an online course in Python, certified in first-aid, finished a public speaking workshop..."}
            value={formData.certifications}
            onChange={handleChange}
            icon={<DocumentTextIcon />}
          />
          {!isProfessional && (
            <FormField
                id="extracurriculars"
                label="Extracurriculars / Volunteer Work"
                placeholder="e.g., Captain of the chess club, member of the debate team, volunteer at the local animal shelter..."
                value={formData.extracurriculars}
                onChange={handleChange}
                icon={<UsersIcon />}
            />
           )}
      </FormSection>
      
      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-brand-blue text-white font-bold rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            'Analyzing Your Profile...'
          ) : (
            <>
              <SparklesIcon />
              <span className="ml-2">Discover Your Path</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};