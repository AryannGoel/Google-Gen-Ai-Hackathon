
import React, { useState } from 'react';
import type { UserInfo, UserPersona } from '../types';
import { AcademicCapIcon, BriefcaseIcon, IdentificationIcon, SparklesIcon } from './icons';

interface PersonaSelectorProps {
    onSubmit: (data: UserInfo) => void;
}

const PersonaButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
}> = ({ label, icon, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-6 border-2 rounded-lg text-center transition-all duration-200 transform ${
            isSelected 
                ? 'bg-brand-blue text-white shadow-lg scale-105 border-transparent' 
                : 'bg-gray-50 text-brand-text hover:bg-blue-100 hover:border-brand-lightblue'
        }`}
    >
        <div className="w-10 h-10">{icon}</div>
        <span className="mt-2 font-semibold">{label}</span>
    </button>
);


export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [persona, setPersona] = useState<UserPersona | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!persona) {
            setError('Please select your current role.');
            return;
        }
        setError('');
        onSubmit({ name, age, persona });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-text">Tell Us About Yourself</h2>
                <p className="text-brand-subtle mt-1">Let's start with the basics to personalize your journey.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="name" className="flex items-center text-lg font-semibold text-brand-text mb-2">
                        <IdentificationIcon />
                        <span className="ml-2">Your Name</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Alex Doe"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-lightblue focus:border-brand-lightblue transition-all duration-200 bg-gray-100 text-gray-900 focus:bg-white"
                    />
                </div>
                <div>
                    <label htmlFor="age" className="flex items-center text-lg font-semibold text-brand-text mb-2">
                        <SparklesIcon />
                        <span className="ml-2">Your Age</span>
                    </label>
                    <input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g., 16"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-lightblue focus:border-brand-lightblue transition-all duration-200 bg-gray-100 text-gray-900 focus:bg-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-lg font-semibold text-brand-text mb-2 text-center">I am currently a...</label>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <PersonaButton 
                        label="School Student" 
                        icon={<AcademicCapIcon />} 
                        isSelected={persona === 'school'} 
                        onClick={() => setPersona('school')} 
                    />
                    <PersonaButton 
                        label="College Student" 
                        icon={<AcademicCapIcon />} 
                        isSelected={persona === 'college'} 
                        onClick={() => setPersona('college')} 
                    />
                    <PersonaButton 
                        label="Working Professional" 
                        icon={<BriefcaseIcon />} 
                        isSelected={persona === 'professional'} 
                        onClick={() => setPersona('professional')} 
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </div>

            <div className="text-center pt-4">
                <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-brand-blue text-white font-bold rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue transition-all duration-300 transform hover:scale-105"
                >
                    Continue
                </button>
            </div>
        </form>
    );
};
