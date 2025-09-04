import React, { useState, useMemo } from 'react';
import { 
    QuestionMarkCircleIcon, 
    CalendarIcon, 
    ClipboardListIcon, 
    UsersIcon, 
    TargetIcon, 
    PhoneIcon, 
    XMarkIcon 
} from './icons';

interface CareerResultProps {
  advice: string;
  onReset: () => void;
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "The 'Why':": <QuestionMarkCircleIcon />,
  "A Glimpse into the Future:": <CalendarIcon />,
  "Preparing for Your Future:": <ClipboardListIcon />,
  "Further Guidance:": <UsersIcon />,
};

// New parser to structure the AI's response
const parseAdviceIntoStructure = (text: string) => {
    const sectionRegex = /(\*\*The 'Why':\*\*|\*\*A Glimpse into the Future:\*\*|\*\*Preparing for Your Future:\*\*|\*\*Further Guidance:\*\*)/;
    const parts = text.split(sectionRegex);

    const headerPart = parts[0];
    const headerLines = headerPart.trim().split('\n').filter(line => line.trim());
    
    let careerTitle = "Your Career Recommendation";
    const greetingLines: string[] = [];
    let titleFound = false;

    // Find career title (usually the last bold line in the intro)
    for (let i = headerLines.length - 1; i >= 0; i--) {
        const line = headerLines[i].trim();
        if (line.startsWith('**') && line.endsWith('**') && !titleFound) {
            careerTitle = line.substring(2, line.length - 2);
            titleFound = true;
        } else if (titleFound) {
            greetingLines.unshift(headerLines[i]);
        }
    }
    // If no title found in the loop, the remaining lines are the greeting
    if (!titleFound) {
        greetingLines.unshift(...headerLines);
    }
    const greeting = greetingLines.join('\n');

    const sections = [];
    for (let i = 1; i < parts.length; i += 2) {
        const title = parts[i].replace(/\*\*/g, '');
        const content = parts[i + 1]?.trim() || '';
        if (title && content) {
            sections.push({ title, content });
        }
    }

    return { greeting, careerTitle, sections };
};

// New component to render content with lists and paragraphs
const SectionContent: React.FC<{ content: string }> = ({ content }) => {
    const nodes = content.split('\n').filter(line => line.trim() !== '').map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return { type: 'li', text: trimmed.substring(2) };
        }
        return { type: 'p', text: trimmed };
    });

    const renderedNodes: React.ReactNode[] = [];
    let listItems: string[] = [];
    
    nodes.forEach((node, index) => {
        if (node.type === 'li') {
            listItems.push(node.text);
        } else {
            if (listItems.length > 0) {
                renderedNodes.push(
                    <ul key={`ul-${index}`} className="list-disc list-inside space-y-2 mt-4 pl-4 text-brand-subtle">
                        {listItems.map((item, liIndex) => <li key={liIndex}>{item}</li>)}
                    </ul>
                );
                listItems = [];
            }
            renderedNodes.push(<p key={`p-${index}`} className="text-brand-subtle leading-relaxed mt-4">{node.text}</p>);
        }
    });

    if (listItems.length > 0) {
        renderedNodes.push(
            <ul key="ul-final" className="list-disc list-inside space-y-2 mt-4 pl-4 text-brand-subtle">
                {listItems.map((item, liIndex) => <li key={liIndex}>{item}</li>)}
            </ul>
        );
    }

    return <>{renderedNodes}</>;
};


const parseSkills = (text: string): string[] => {
    const skills: string[] = [];
    const futureSectionRegex = /\*\*Preparing for Your Future:\*\*(.*?)(?=\*\*|$)/s;
    const match = text.match(futureSectionRegex);

    if (match && match[1]) {
        const content = match[1];
        const skillListRegex = /(?:key skills to learn|Here are some key skills)[\s\S]*?((?:\n\s*[*|-]\s.*)+)/i;
        const skillMatch = content.match(skillListRegex);

        if (skillMatch && skillMatch[1]) {
            const listItems = skillMatch[1].trim().split('\n');
            return listItems.map(item => item.trim().replace(/^[*|-]\s*/, ''));
        }
        
        const allListItemsRegex = /\n\s*[*|-]\s(.*?)(?=\n|$)/g;
        let listItemMatch;
        while ((listItemMatch = allListItemsRegex.exec(content)) !== null) {
            skills.push(listItemMatch[1].trim());
        }
    }
    
    return skills.slice(0, 5); // Limit to 5 for a clean UI
};

const ConnectExpertModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
                    <XMarkIcon />
                </button>
                <div className="flex items-center text-xl font-semibold text-brand-text mb-4">
                    <span className="text-brand-lightblue mr-2"><PhoneIcon /></span>
                    Connect with an Expert
                </div>
                <p className="text-brand-subtle mb-6">
                    Take the next step by getting advice from people in the field. Here are some ways to connect:
                </p>
                <div className="space-y-4">
                    <a href="https://www.linkedin.com/search/results/people/?keywords=career%20counselor" target="_blank" rel="noopener noreferrer" className="block w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <p className="font-semibold text-brand-blue">Schedule a 1:1 Call</p>
                        <p className="text-sm text-brand-subtle">Find a professional career counselor for personalized guidance.</p>
                    </a>
                    <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="block w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <p className="font-semibold text-brand-blue">Find an Industry Mentor</p>
                        <p className="text-sm text-brand-subtle">Use platforms like LinkedIn to find and connect with professionals in your recommended field.</p>
                    </a>
                    <a href="https://www.reddit.com/r/findapath/" target="_blank" rel="noopener noreferrer" className="block w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <p className="font-semibold text-brand-blue">Join a Community Forum</p>
                        <p className="text-sm text-brand-subtle">Discuss career paths and get advice from online communities.</p>
                    </a>
                </div>
                 <div className="text-right mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const SkillsHub: React.FC<{ skills: string[] }> = ({ skills }) => {
    const [checkedSkills, setCheckedSkills] = useState<Record<string, boolean>>({});

    if (skills.length === 0) return null;

    const handleToggle = (skill: string) => {
        setCheckedSkills(prev => ({ ...prev, [skill]: !prev[skill] }));
    };

    const completedCount = Object.values(checkedSkills).filter(Boolean).length;
    const progress = (completedCount / skills.length) * 100;

    return (
        <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-200">
            <h3 className="flex items-center text-xl font-semibold text-brand-text mb-4">
                <span className="text-brand-lightblue mr-2"><TargetIcon /></span>
                Your Skills Hub
            </h3>
            <p className="text-brand-subtle mb-4">Track your progress as you develop the key skills for your new career path.</p>
            
            <div className="space-y-3">
                {skills.map((skill, index) => (
                    <label key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={!!checkedSkills[skill]}
                            onChange={() => handleToggle(skill)}
                            className="h-5 w-5 rounded border-gray-300 text-brand-blue focus:ring-brand-lightblue"
                        />
                        <span className={`ml-3 text-brand-text ${checkedSkills[skill] ? 'line-through text-gray-500' : ''}`}>
                            {skill}
                        </span>
                    </label>
                ))}
            </div>

            <div className="mt-5">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-brand-text">Progress</span>
                    <span className="text-sm font-medium text-brand-blue">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-blue h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export const CareerResult: React.FC<CareerResultProps> = ({ advice, onReset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const parsedAdvice = useMemo(() => parseAdviceIntoStructure(advice), [advice]);
  const skills = useMemo(() => parseSkills(advice), [advice]);

  return (
    <div className="animate-fade-in text-left space-y-8">
      <header className="text-center">
        <p className="text-lg text-brand-subtle mb-4 leading-relaxed">{parsedAdvice.greeting}</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-blue tracking-tight">
            {parsedAdvice.careerTitle}
        </h2>
      </header>

      <div className="space-y-6">
        {parsedAdvice.sections.map(({ title, content }) => (
            <section key={title} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-shadow hover:shadow-xl">
                <h3 className="flex items-center text-xl font-semibold text-brand-text">
                    <span className="flex items-center justify-center h-10 w-10 text-brand-lightblue mr-4 p-2 bg-blue-50 rounded-full">
                        {SECTION_ICONS[title]}
                    </span>
                    {title}
                </h3>
                <div className="mt-2 pl-[56px]"> {/* 56px = 40px icon width + 16px margin */}
                   <SectionContent content={content} />
                </div>
            </section>
        ))}
      </div>
      
      <SkillsHub skills={skills} />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-brand-blue text-white font-bold rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue transition-all duration-300 transform hover:scale-105"
        >
          <PhoneIcon />
          <span className="ml-2">Connect with an Expert</span>
        </button>
        <button
          onClick={onReset}
          className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300"
        >
          Start Over
        </button>
      </div>
      
      <ConnectExpertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
