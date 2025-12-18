
import React from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, Code, Check, Flag } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedIndices: number[];
  onToggleOption?: (optionIndex: number) => void;
  isReviewMode?: boolean;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedIndices,
  onToggleOption,
  isReviewMode = false,
  isFlagged = false,
  onToggleFlag,
}) => {
  const correctCount = question.correctAnswerIndices.length;
  const isMultiple = correctCount > 1;

  const getOptionStyle = (index: number) => {
    let baseStyle = "p-4 border-2 cursor-pointer transition-all flex items-start gap-3 ";
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

    if (isSelected) {
      return baseStyle + "bg-indigo-50 border-indigo-600 shadow-sm";
    }
    return baseStyle + "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
  };

  const handleCopyCode = () => {
    if (question.codeSnippet) {
      navigator.clipboard.writeText(question.codeSnippet);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2 items-center">
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

        {/* Flag Toggle Button */}
        {!isReviewMode && onToggleFlag && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFlag();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 text-xs font-bold uppercase tracking-tight
              ${isFlagged 
                ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' 
                : 'bg-white border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-600'
              }`}
          >
            <Flag size={14} fill={isFlagged ? 'currentColor' : 'none'} />
            {isFlagged ? 'Flagged' : 'Flag for Review'}
          </button>
        )}
        
        {isReviewMode && isFlagged && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-amber-50 border-amber-200 text-amber-700 text-xs font-bold uppercase">
            <Flag size={14} fill="currentColor" />
            Flagged During Test
          </div>
        )}
      </div>

      <h3 className="text-lg font-medium text-slate-900 mb-6 leading-relaxed">
        {question.questionText}
      </h3>

      {question.codeSnippet && (
        <div className="mb-6 bg-[#0d1117] rounded-lg border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] rounded-t-lg border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <Code size={14} /> Terraform HCL
            </div>
            <button 
              onClick={handleCopyCode}
              className="text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="p-5 overflow-x-auto min-h-[100px]">
            <pre className="text-[13px] text-[#e6edf3] font-mono leading-relaxed whitespace-pre">
              {question.codeSnippet}
            </pre>
          </div>
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
              <div className={`
                mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-200
                ${isMultiple ? 'rounded-md' : 'rounded-full'}
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
                   isCorrect ? <CheckCircle size={16} /> : (isSelected ? <XCircle size={16} /> : null)
                ) : (
                  isSelected && (
                    isMultiple 
                      ? <Check size={16} strokeWidth={3} />
                      : <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
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
        <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-tight">
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
