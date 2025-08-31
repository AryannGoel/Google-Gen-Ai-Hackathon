import React from 'react';
import { QuestionMarkCircleIcon, CalendarIcon, ClipboardListIcon, UsersIcon } from './icons';

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

const formatAdvice = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    // Filter out empty lines which might result from multiple newlines
    const lines = text.split('\n').filter(line => line.trim() !== '');

    let keyCounter = 0;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            nodes.push(
                <ul key={`ul-${keyCounter++}`} className="list-disc list-inside space-y-2 mb-4 pl-4 text-brand-subtle">
                    {listItems}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        // Handle list items
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            listItems.push(<li key={`li-${keyCounter++}`}>{trimmed.substring(2)}</li>);
            return; // Continue to next line
        }

        // If we encounter a non-list item, the current list (if any) has ended.
        flushList();

        // Handle headings and paragraphs
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
            const content = trimmed.substring(2, trimmed.length - 2);
            const icon = SECTION_ICONS[content];

            if (icon) { // It's a section header
                nodes.push(
                    <h3 key={`h3-${keyCounter++}`} className="flex items-center text-xl font-semibold text-brand-text mt-6 mb-3">
                        <span className="text-brand-lightblue mr-2">{icon}</span>
                        {content}
                    </h3>
                );
            } else { // It's the main career title
                nodes.push(
                    <h2 key={`h2-${keyCounter++}`} className="text-3xl font-bold text-brand-blue my-4 text-center">
                        {content}
                    </h2>
                );
            }
        } else { // It's a paragraph
            nodes.push(
                <p key={`p-${keyCounter++}`} className="text-brand-subtle leading-relaxed mb-4">
                    {trimmed}
                </p>
            );
        }
    });

    flushList(); // Ensure any list at the very end of the text is added

    return nodes;
};


export const CareerResult: React.FC<CareerResultProps> = ({ advice, onReset }) => {
  return (
    <div className="animate-fade-in text-left">
      <div className="prose max-w-none">
        {formatAdvice(advice)}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};