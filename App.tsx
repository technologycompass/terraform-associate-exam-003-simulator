import React, { useState, useCallback, useEffect } from 'react';
import { 
  AppStatus, 
  Question, 
  UserAnswer, 
  TestResult,
  EXAM_TOPIC_CONFIG,
  EXAM_DURATION_SECONDS
} from './types';
import { generatePracticeTest } from './services/geminiService';
import { Timer } from './components/Timer';
import { QuestionCard } from './components/QuestionCard';
import { CheatSheet } from './components/CheatSheet';
import { 
  Server, 
  BookOpen, 
  CheckSquare, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  Award,
  Terminal,
  Brain,
  BarChart3,
  PieChart,
  History,
  LayoutGrid,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.DASHBOARD);
  const [currentTestId, setCurrentTestId] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  
  // Historical data
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('terraform_prep_history');
    if (saved) {
      try {
        setTestHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history on update
  useEffect(() => {
    if (testHistory.length > 0) {
      localStorage.setItem('terraform_prep_history', JSON.stringify(testHistory));
    }
  }, [testHistory]);

  const startTest = async (testId: number) => {
    try {
      setStatus(AppStatus.GENERATING);
      setCurrentTestId(testId);
      setError(null);
      setIsSubmitConfirmOpen(false);
      
      const generatedQuestions = await generatePracticeTest(testId);
      
      setQuestions(generatedQuestions);
      setUserAnswers(generatedQuestions.map(q => ({ questionId: q.id, selectedIndices: [] })));
      setCurrentQuestionIndex(0);
      setStatus(AppStatus.TESTING);
    } catch (e) {
      console.error(e);
      setError("Failed to generate test. Please check your API key configuration or try again.");
      setStatus(AppStatus.DASHBOARD);
    }
  };

  const handleOptionToggle = (questionId: number, optionIndex: number) => {
    setUserAnswers(prev => prev.map(ans => {
      if (ans.questionId !== questionId) return ans;
      
      const question = questions.find(q => q.id === questionId);
      if (!question) return ans;

      const isMultiSelect = question.correctAnswerIndices.length > 1;
      let newSelected = [...ans.selectedIndices];

      if (isMultiSelect) {
        if (newSelected.includes(optionIndex)) {
          newSelected = newSelected.filter(i => i !== optionIndex);
        } else {
          newSelected.push(optionIndex);
        }
      } else {
        // Single select behavior
        newSelected = [optionIndex];
      }

      return { ...ans, selectedIndices: newSelected };
    }));
  };

  const submitTest = useCallback(() => {
    setIsSubmitConfirmOpen(false);
    let score = 0;
    questions.forEach(q => {
      const userAnswer = userAnswers.find(a => a.questionId === q.id);
      if (!userAnswer) return;

      // Exact match required for point
      const correctSet = new Set(q.correctAnswerIndices);
      const userSet = new Set(userAnswer.selectedIndices);
      
      if (correctSet.size === userSet.size && [...correctSet].every(x => userSet.has(x))) {
        score++;
      }
    });

    const passed = (score / questions.length) >= 0.7; // 70% passing score

    const newResult: TestResult = {
      testId: currentTestId,
      score,
      totalQuestions: questions.length,
      passed,
      dateTaken: new Date().toLocaleDateString(),
      userAnswers,
      questions
    };

    setResult(newResult);
    setTestHistory(prev => [newResult, ...prev]);
    setCurrentQuestionIndex(0); // Reset index for review mode
    setStatus(AppStatus.REVIEW);
  }, [questions, userAnswers, currentTestId]);

  // --- Statistics Logic ---
  const getAverageScore = () => {
    if (testHistory.length === 0) return 0;
    const totalPercentage = testHistory.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0);
    return Math.round((totalPercentage / testHistory.length) * 100);
  };

  const getPassRate = () => {
    if (testHistory.length === 0) return 0;
    const passedCount = testHistory.filter(t => t.passed).length;
    return Math.round((passedCount / testHistory.length) * 100);
  };

  const getTopicPerformance = () => {
    const topicStats: Record<string, { correct: number, total: number }> = {};
    
    // Initialize
    EXAM_TOPIC_CONFIG.forEach(t => {
      topicStats[t.name] = { correct: 0, total: 0 };
    });

    testHistory.forEach(test => {
      test.questions.forEach(q => {
        const userAnswer = test.userAnswers.find(a => a.questionId === q.id);
        const correctSet = new Set(q.correctAnswerIndices);
        const userSet = new Set(userAnswer?.selectedIndices || []);
        const isCorrect = correctSet.size === userSet.size && [...correctSet].every(x => userSet.has(x));

        // Fuzzy match topic name just in case AI generated slightly different string
        const topicKey = Object.keys(topicStats).find(k => k.includes(q.domain)) || q.domain;
        
        if (!topicStats[topicKey]) {
            topicStats[topicKey] = { correct: 0, total: 0 };
        }
        
        topicStats[topicKey].total++;
        if (isCorrect) topicStats[topicKey].correct++;
      });
    });

    return topicStats;
  };

  const renderDashboard = () => {
    const avgScore = getAverageScore();
    const passRate = getPassRate();
    const topicStats = getTopicPerformance();

    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
            <Terminal className="text-indigo-600" size={40} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Terraform Associate (003) <span className="text-indigo-600">Simulator</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Full-length, timed practice exams (57 Questions, 60 Minutes) tailored to the official HashiCorp objectives with intelligent topic weighting.
          </p>
          
          <button 
            onClick={() => setStatus(AppStatus.CHEATSHEET)}
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-full font-bold shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all"
          >
            <FileText size={18} className="mr-2" />
            Study Cheat Sheet
          </button>
        </div>

        {/* Stats Section */}
        {testHistory.length > 0 && (
          <div className="mb-12 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="text-indigo-600" /> Performance Analytics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Tests Taken</div>
                <div className="text-3xl font-bold text-slate-900">{testHistory.length}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Average Score</div>
                <div className={`text-3xl font-bold ${avgScore >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                  {avgScore}%
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Pass Rate</div>
                <div className={`text-3xl font-bold ${passRate >= 70 ? 'text-green-600' : 'text-indigo-600'}`}>
                  {passRate}%
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <PieChart size={16} /> Knowledge Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(topicStats).map(([topic, stats]) => {
                   if (stats.total === 0) return null;
                   const percentage = Math.round((stats.correct / stats.total) * 100);
                   return (
                     <div key={topic}>
                       <div className="flex justify-between text-sm mb-1">
                         <span className="text-slate-700 truncate max-w-[80%]">{topic}</span>
                         <span className="font-bold text-slate-900">{percentage}%</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2.5">
                         <div 
                           className={`h-2.5 rounded-full ${percentage >= 70 ? 'bg-green-500' : (percentage >= 50 ? 'bg-yellow-400' : 'bg-red-400')}`} 
                           style={{ width: `${percentage}%` }}
                         ></div>
                       </div>
                     </div>
                   )
                })}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 mx-auto max-w-2xl">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
          <BookOpen className="text-indigo-600" /> Start New Exam
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 10 }).map((_, i) => {
            const testNum = i + 1;
            return (
              <button
                key={testNum}
                onClick={() => startTest(testNum)}
                className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mock Exam</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">60 Mins</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  Test Suite #{testNum}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Generates 57 questions covering all 9 exam domains with official weighting.
                </p>
                <div className="mt-auto flex items-center text-sm font-medium text-slate-600 group-hover:text-indigo-600">
                  Begin Test <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGenerating = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center px-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Brain className="text-indigo-600 animate-pulse" size={24} />
        </div>
      </div>
      <h2 className="mt-8 text-xl font-bold text-slate-900">Constructing 57-Question Exam</h2>
      <p className="text-slate-500 mt-2">
        Compiling questions across 9 domains, balancing weightage, and generating unique scenarios. This may take about 10-15 seconds.
      </p>
    </div>
  );

  const renderTesting = () => {
    const currentQ = questions[currentQuestionIndex];
    const currentAns = userAnswers.find(a => a.questionId === currentQ.id);
    const answeredCount = userAnswers.filter(a => a.selectedIndices.length > 0).length;
    const unansweredCount = questions.length - answeredCount;
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Submit Confirmation Modal */}
        {isSubmitConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <AlertTriangle className="text-amber-600" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Submit Exam?</h3>
                  <p className="text-slate-600 mt-2">
                    You are about to finish the exam. Once submitted, you cannot change your answers.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-slate-600 font-medium">Questions Answered:</span>
                   <span className="text-indigo-700 font-bold">{answeredCount} / {questions.length}</span>
                </div>
                {unansweredCount > 0 && (
                  <div className="flex justify-between items-center text-amber-600 font-medium">
                     <span>Unanswered:</span>
                     <span>{unansweredCount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsSubmitConfirmOpen(false)}
                  className="px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Continue Testing
                </button>
                <button
                  onClick={submitTest}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-colors"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="sticky top-4 z-40 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question</span>
            <span className="text-xl font-bold text-slate-900">{currentQuestionIndex + 1} <span className="text-slate-400 text-base font-normal">/ {questions.length}</span></span>
          </div>
          
          <Timer 
            durationSeconds={EXAM_DURATION_SECONDS} 
            onTimeUp={submitTest} 
          />
          
          <button 
            onClick={() => setIsSubmitConfirmOpen(true)}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Submit Exam
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Question Area */}
           <div className="lg:col-span-8">
              {/* Progress Bar */}
              <div className="mb-6">
                 <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                   <span>Exam Progress</span>
                   <span>{Math.round(progressPercentage)}%</span>
                 </div>
                 <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                   <div 
                     className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
                     style={{ width: `${progressPercentage}%` }}
                   ></div>
                 </div>
              </div>

              <QuestionCard 
                question={currentQ}
                selectedIndices={currentAns?.selectedIndices || []}
                onToggleOption={(optIdx) => handleOptionToggle(currentQ.id, optIdx)}
              />
              
              <div className="flex justify-between items-center mt-6">
                <button 
                    onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center px-5 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                  >
                    <ArrowLeft size={18} className="mr-2" /> Previous
                  </button>
                  
                  <button 
                    onClick={() => setCurrentQuestionIndex(p => Math.min(questions.length - 1, p + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="flex items-center px-5 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                  >
                    Next <ArrowRight size={18} className="ml-2" />
                  </button>
              </div>
           </div>

           {/* Navigation Grid (Question Palette) */}
           <div className="lg:col-span-4">
             <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-28 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <LayoutGrid size={16} className="text-indigo-600" /> Question Palette
                </h3>
                
                {/* Reduced size tiles with tighter grid */}
                <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-8 gap-1.5">
                  {questions.map((q, idx) => {
                    const ans = userAnswers.find(a => a.questionId === q.id);
                    const isAnswered = ans && ans.selectedIndices.length > 0;
                    const isCurrent = idx === currentQuestionIndex;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        title={q.questionText}
                        className={`
                          h-7 w-full flex items-center justify-center rounded text-[10px] font-bold transition-all duration-150
                          ${isCurrent 
                            ? 'bg-white text-indigo-700 ring-2 ring-indigo-600 z-10 scale-110 shadow-md' 
                            : isAnswered 
                              ? 'bg-indigo-600 text-white border border-indigo-700 hover:bg-indigo-700' 
                              : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }
                        `}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
                
                <div className="mt-6 space-y-2 text-xs text-slate-500 font-medium">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white border border-indigo-600 ring-2 ring-indigo-600 rounded-sm"></div>
                      <span>Current Question</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
                      <span>Answered</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-50 border border-slate-200 rounded-sm"></div>
                      <span>Unanswered</span>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    if (!result) return null;
    
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const currentQ = result.questions[currentQuestionIndex];
    const currentUserAns = result.userAnswers.find(a => a.questionId === currentQ.id);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Result Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className={`${result.passed ? 'bg-green-600' : 'bg-red-600'} p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6`}>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/20 rounded-full">
                <Award size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {result.passed ? "Exam Passed!" : "Exam Failed"}
                </h2>
                <p className="text-white/80">
                  You scored {percentage}% ({result.score} / {result.totalQuestions})
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
               <button 
                 onClick={() => setStatus(AppStatus.DASHBOARD)}
                 className="flex items-center px-4 py-2 bg-white text-slate-700 border border-transparent rounded-lg hover:bg-slate-100 font-medium transition-colors shadow-sm text-sm"
               >
                 <BookOpen size={16} className="mr-2" /> Dashboard
               </button>
               <button 
                 onClick={() => startTest(currentTestId)}
                 className="flex items-center px-4 py-2 bg-indigo-900/30 text-white border border-white/20 rounded-lg hover:bg-indigo-900/50 font-medium transition-colors shadow-sm text-sm"
               >
                 <RotateCcw size={16} className="mr-2" /> Retake
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Question Review Pane */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="text-indigo-600" />
                Reviewing Question {currentQuestionIndex + 1}
              </h3>
            </div>
            
            <QuestionCard 
              question={currentQ} 
              selectedIndices={currentUserAns?.selectedIndices || []} 
              isReviewMode={true}
            />

             <div className="flex justify-between items-center mt-6">
                <button 
                    onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center px-5 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                  >
                    <ArrowLeft size={18} className="mr-2" /> Previous
                  </button>
                  
                  <button 
                    onClick={() => setCurrentQuestionIndex(p => Math.min(questions.length - 1, p + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="flex items-center px-5 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                  >
                    Next <ArrowRight size={18} className="ml-2" />
                  </button>
              </div>
          </div>

          {/* Navigation Palette Pane */}
          <div className="lg:col-span-4">
             <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-28 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <LayoutGrid size={16} className="text-indigo-600" /> Review Palette
                </h3>
                
                {/* Compact Grid for Review Mode */}
                <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-8 gap-1.5">
                  {result.questions.map((q, idx) => {
                    const ans = result.userAnswers.find(a => a.questionId === q.id);
                    const correctSet = new Set(q.correctAnswerIndices);
                    const userSet = new Set(ans?.selectedIndices || []);
                    const isCorrect = correctSet.size === userSet.size && [...correctSet].every(x => userSet.has(x));
                    
                    const isCurrent = idx === currentQuestionIndex;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`
                          h-7 w-full flex items-center justify-center rounded text-[10px] font-bold transition-all duration-150
                          ${isCurrent ? 'ring-2 ring-indigo-600 z-10 scale-110 shadow-md' : ''}
                          ${isCorrect 
                            ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                          }
                        `}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
                
                <div className="mt-6 space-y-2 text-xs text-slate-500 font-medium">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white border border-indigo-600 ring-2 ring-indigo-600 rounded-sm"></div>
                      <span>Current View</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"></div>
                      <span>Correct</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm"></div>
                      <span>Incorrect</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer"
            onClick={() => setStatus(AppStatus.DASHBOARD)}
          >
            <Server className="text-indigo-600" size={24} />
            <span>TerraPrep.AI</span>
          </div>
          <div className="flex items-center gap-4">
             {status === AppStatus.DASHBOARD && testHistory.length > 0 && (
               <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                 <History size={14} />
                 <span>{testHistory.length} Exams Completed</span>
               </div>
             )}
             <div className="text-xs text-slate-400 font-medium">
                Exam Version 003
             </div>
          </div>
        </div>
      </nav>

      {status === AppStatus.DASHBOARD && renderDashboard()}
      {status === AppStatus.GENERATING && renderGenerating()}
      {status === AppStatus.TESTING && renderTesting()}
      {status === AppStatus.REVIEW && renderReview()}
      {status === AppStatus.CHEATSHEET && <CheatSheet onBack={() => setStatus(AppStatus.DASHBOARD)} />}
    </div>
  );
}