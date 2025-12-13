import React from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, Code, Check } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedIndices: number[];
  onToggleOption?: (optionIndex: number) => void;
  isReviewMode?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedIndices,
  onToggleOption,
  isReviewMode = false,
}) => {
  const correctCount = question.correctAnswerIndices.length;
  const isMultiple = correctCount > 1;

  const getOptionStyle = (index: number) => {
    let baseStyle = "p-4 border-2 cursor-pointer transition-all flex items-start gap-3 ";
    // Use rounded-full for radio (single), rounded-lg for checkbox (multi) container
    baseStyle += "rounded-xl "; 
    
    const isSelected = selectedIndices.includes(index);
    const isCorrect = question.correctAnswerIndices.includes(index);

    if (isReviewMode) {
      if (isCorrect) {
        return baseStyle + "bg-green-50 border-green-500 text-green-900";
      }
      if (isSelected && !isCorrect) {
        return baseStyle + "bg-red-50 border-red-500 text-red-900";
      }
      return baseStyle + "bg-white border-slate-200 opacity-60";
    }

    // Test Taking Mode
    if (isSelected) {
      return baseStyle + "bg-indigo-50 border-indigo-600 shadow-sm";
    }
    return baseStyle + "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wider">
          {question.domain}
        </span>
        {isMultiple ? (
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded flex items-center gap-1.5">
             <Check size={14} className="stroke-[3px]" /> 
             Select {correctCount}
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
             Single Choice
          </span>
        )}
      </div>

      <h3 className="text-lg font-medium text-slate-900 mb-4 leading-relaxed">
        {question.questionText}
      </h3>

      {question.codeSnippet && (
        <div className="mb-6 bg-slate-900 rounded-lg p-4 overflow-x-auto border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-2 border-b border-slate-700 pb-2">
            <Code size={14} /> HCL
          </div>
          <pre className="text-sm text-indigo-300 font-mono whitespace-pre">
            {question.codeSnippet}
          </pre>
        </div>
      )}

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndices.includes(idx);
          const isCorrect = question.correctAnswerIndices.includes(idx);
          
          return (
            <div
              key={idx}
              onClick={() => !isReviewMode && onToggleOption && onToggleOption(idx)}
              className={getOptionStyle(idx)}
            >
              {/* Input Indicator */}
              <div className={`
                mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-200
                ${isMultiple ? 'rounded-md' : 'rounded-full'} /* Square for Checkbox, Circle for Radio */
                border-2
                ${isReviewMode 
                  ? (isCorrect 
                      ? 'border-green-600 bg-green-600 text-white' 
                      : (isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300')
                    )
                  : (isSelected 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-slate-300 bg-white hover:border-indigo-400'
                    )
                }
              `}>
                {isReviewMode ? (
                  // Review Mode Icons
                   isCorrect ? <CheckCircle size={16} /> : (isSelected ? <XCircle size={16} /> : null)
                ) : (
                  // Testing Mode Icons
                  isSelected && (
                    isMultiple 
                      ? <Check size={16} strokeWidth={3} /> // Checkbox tick
                      : <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" /> // Radio dot
                  )
                )}
              </div>
              
              <span className={`text-sm pt-0.5 ${isSelected && !isReviewMode ? 'font-medium text-indigo-900' : 'text-slate-700'}`}>
                {option}
              </span>
            </div>
          );
        })}
      </div>

      {isReviewMode && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={18} /> Explanation
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};