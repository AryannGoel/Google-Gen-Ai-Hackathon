
import React, { useState } from 'react';
import type { CareerFormData, UserInfo } from './types';
import { generateCareerAdvice } from './services/geminiService';
import { CareerForm } from './components/CareerForm';
import { CareerResult } from './components/CareerResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { PersonaSelector } from './components/PersonaSelector';

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [careerAdvice, setCareerAdvice] = useState<string | null>(null);

  const handlePersonaSubmit = (data: UserInfo) => {
    setUserInfo(data);
  };

  const handleSubmit = async (data: CareerFormData) => {
    if (!userInfo) {
        setError("User information is missing. Please start over.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setCareerAdvice(null);
    try {
      const advice = await generateCareerAdvice(userInfo, data);
      setCareerAdvice(advice);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get career advice. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserInfo(null);
    setCareerAdvice(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (careerAdvice) return <CareerResult advice={careerAdvice} onReset={handleReset} />;
    if (userInfo) return <CareerForm onSubmit={handleSubmit} isLoading={isLoading} persona={userInfo.persona} />;
    return <PersonaSelector onSubmit={handlePersonaSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-brand-bg to-indigo-100 font-sans text-brand-text flex items-center justify-center p-4">
      <main className="w-full max-w-3xl mx-auto">
        <div className="bg-brand-card rounded-2xl shadow-2xl p-6 sm:p-10 transition-all duration-500">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-text">
              Chart Your Lifelong Journey
            </h1>
            <p className="mt-3 text-lg text-brand-subtle max-w-xl mx-auto">
              Build a comprehensive profile of your skills, achievements, and passions to discover a career path that truly fits.
            </p>
          </div>

          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
        <footer className="text-center mt-6 text-sm text-gray-500">
          <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;