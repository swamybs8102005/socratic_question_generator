import React, { useEffect, useState } from 'react';
import { authClient } from "../../lib/auth";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Evaluation {
    understanding: number;
    depth: number;
    hasEvidence: boolean;
    keyInsights: string[];
    weakAreas: string[];
}

interface StructuredQuestion {
    questionType: string;
    difficulty: string;
    question: string;
    options?: string[];
    blanks?: Array<{
        id: number;
        options: string[];
        correctAnswer?: string;
    }>;
    expectsConfidence: boolean;
}

export const SocraticCard = () => {
    const [user, setUser] = useState<any>(null);
    const [step, setStep] = React.useState<'setup' | 'question' | 'evaluation'>('setup');
    const [topic, setTopic] = React.useState("");
    const [difficulty, setDifficulty] = React.useState("Intermediate");

    const [questionData, setQuestionData] = React.useState<StructuredQuestion | null>(null);
    const [question, setQuestion] = React.useState<string>("");
    const [answer, setAnswer] = React.useState("");
    const [selectedOption, setSelectedOption] = React.useState<string>("");
    const [evaluation, setEvaluation] = React.useState<Evaluation | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>("");
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [correctAnswer, setCorrectAnswer] = React.useState<string>("");
    const [isCorrect, setIsCorrect] = React.useState<boolean>(false);
    const [questionHistory, setQuestionHistory] = React.useState<Array<{
        questionData: StructuredQuestion | null;
        question: string;
        selectedOption: string;
        answer: string;
        isCorrect: boolean;
        correctAnswer: string;
    }>>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(-1);
    const [filledBlanks, setFilledBlanks] = React.useState<Record<number, string>>({});
    const [hint, setHint] = React.useState<string>("");
    const [loadingHint, setLoadingHint] = React.useState(false);

    useEffect(() => {
        // Simple check for current user identity
        // @ts-ignore
        const currentUser = authClient?.authentication?.session?.user || null;
        setUser(currentUser);
    }, []);

    // Helper function to render question with code highlighting and SVG support
    const renderQuestionContent = (questionText: string) => {
        // Remove "code snippet?" or similar phrases
        let cleanedText = questionText.replace(/code snippet\??\s*/gi, '');
        
        const parts: JSX.Element[] = [];
        let lastIndex = 0;
        
        // Match code blocks: ```language\ncode\n```
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        
        // Match inline code patterns - only match actual code, not "cpp program?" 
        // Must start with actual code keywords like #include, import, def, class, etc.
        const languageKeywords = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c\\+\\+', 'csharp', 'c#', 'ruby', 'go', 'rust', 'php', 'swift'];
        const codeStartPatterns = '#include|#define|import |def |class |function |const |let |var |int |void |public |private |package |using ';
        const inlineCodeRegex = new RegExp(`\\b(${languageKeywords.join('|')})\\s+(${codeStartPatterns})([\\s\\S]+?)(?=(?:\\n\\s*[A-D]\\)|\\n\\s*\\?|$))`, 'gi');
        
        // First, try to find markdown code blocks
        let match;
        let hasCodeBlocks = false;
        
        while ((match = codeBlockRegex.exec(cleanedText)) !== null) {
            hasCodeBlocks = true;
            // Add text before code block
            if (match.index > lastIndex) {
                const textBefore = cleanedText.substring(lastIndex, match.index);
                parts.push(<span key={`text-${lastIndex}`}>{textBefore}</span>);
            }
            
            // Add code block with syntax highlighting
            const language = match[1] || 'javascript';
            const code = match[2].trim();
            parts.push(
                <div key={`code-${match.index}`} className="my-4">
                    <SyntaxHighlighter
                        language={language}
                        style={vscDarkPlus}
                        customStyle={{
                            borderRadius: '8px',
                            padding: '16px',
                            fontSize: '14px'
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
            );
            
            lastIndex = match.index + match[0].length;
        }
        
        // If no markdown code blocks found, check for inline code patterns
        if (!hasCodeBlocks) {
            const text = cleanedText;
            let currentIndex = 0;
            
            // Reset regex
            inlineCodeRegex.lastIndex = 0;
            let inlineMatch;
            let hasInlineCode = false;
            
            while ((inlineMatch = inlineCodeRegex.exec(text)) !== null) {
                hasInlineCode = true;
                // Add text before code
                if (inlineMatch.index > currentIndex) {
                    parts.push(
                        <span key={`text-${currentIndex}`}>
                            {text.substring(currentIndex, inlineMatch.index)}
                        </span>
                    );
                }
                
                // Detect language
                const detectedLang = inlineMatch[1].toLowerCase();
                let language = detectedLang === 'c++' ? 'cpp' : detectedLang === 'c#' ? 'csharp' : detectedLang;
                
                // Extract code (group 2 is the code start pattern, group 3 is the rest)
                const code = (inlineMatch[2] + inlineMatch[3]).trim();
                
                parts.push(
                    <div key={`code-${inlineMatch.index}`} className="my-4">
                        <SyntaxHighlighter
                            language={language}
                            style={vscDarkPlus}
                            customStyle={{
                                borderRadius: '8px',
                                padding: '16px',
                                fontSize: '14px'
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                );
                
                currentIndex = inlineMatch.index + inlineMatch[0].length;
            }
            
            // Add remaining text after last inline code
            if (hasInlineCode && currentIndex < text.length) {
                lastIndex = currentIndex;
            }
        }
        
        // Add remaining text
        if (lastIndex < cleanedText.length) {
            const remainingText = cleanedText.substring(lastIndex);
            
            // Check for SVG content
            const svgRegex = /<svg[\s\S]*?<\/svg>/g;
            let svgMatch;
            let svgLastIndex = 0;
            const textParts: JSX.Element[] = [];
            
            while ((svgMatch = svgRegex.exec(remainingText)) !== null) {
                if (svgMatch.index > svgLastIndex) {
                    const textBeforeSvg = remainingText.substring(svgLastIndex, svgMatch.index);
                    // Handle <br> tags in text before SVG
                    const linesBeforeSvg = textBeforeSvg.split(/<br\s*\/?>/gi);
                    textParts.push(
                        <span key={`svg-text-${svgLastIndex}`}>
                            {linesBeforeSvg.map((line, idx) => (
                                <React.Fragment key={`line-${idx}`}>
                                    {line}
                                    {idx < linesBeforeSvg.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </span>
                    );
                }
                
                textParts.push(
                    <div 
                        key={`svg-${svgMatch.index}`} 
                        className="my-4 flex justify-center bg-white/5 rounded-lg p-4"
                        dangerouslySetInnerHTML={{ __html: svgMatch[0] }}
                    />
                );
                
                svgLastIndex = svgMatch.index + svgMatch[0].length;
            }
            
            if (svgLastIndex < remainingText.length) {
                const finalText = remainingText.substring(svgLastIndex);
                // Replace <br> tags with actual line breaks
                const lines = finalText.split(/<br\s*\/?>/gi);
                textParts.push(
                    <span key={`svg-text-end`}>
                        {lines.map((line, idx) => (
                            <React.Fragment key={`line-${idx}`}>
                                {line}
                                {idx < lines.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </span>
                );
            } else if (svgLastIndex === 0 && remainingText.trim()) {
                // No SVG found, just handle <br> tags in remaining text
                const lines = remainingText.split(/<br\s*\/?>/gi);
                textParts.push(
                    <span key="text-only">
                        {lines.map((line, idx) => (
                            <React.Fragment key={`line-${idx}`}>
                                {line}
                                {idx < lines.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </span>
                );
            }
            
            if (textParts.length > 0) {
                parts.push(<span key={`remaining-${lastIndex}`}>{textParts}</span>);
            }
        }
        
        return parts.length > 0 ? <>{parts}</> : <span>{cleanedText}</span>;
    };

    // Helper function to render multiple blanks question with filled values
    const renderMultipleBlanksQuestion = (questionText: string, blanks: Array<{id: number; options: string[]; correctAnswer?: string}>) => {
        let displayText = questionText;
        
        // Replace blanks with filled values or placeholder
        blanks.forEach(blank => {
            const filledValue = filledBlanks[blank.id];
            const placeholder = `_____${blank.id}_____`;
            
            if (filledValue) {
                // Show filled value with highlighting
                displayText = displayText.replace(
                    placeholder,
                    `<span class="inline-block px-3 py-1 mx-1 bg-primary/20 text-primary border-2 border-primary rounded font-mono font-semibold">${filledValue}</span>`
                );
            } else {
                // Show empty blank
                displayText = displayText.replace(
                    placeholder,
                    `<span class="inline-block px-3 py-1 mx-1 bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded text-muted-foreground font-mono">____</span>`
                );
            }
        });
        
        // Render as HTML with code highlighting if needed
        const hasCodeBlock = displayText.includes('```') || displayText.includes('#include') || displayText.includes('def ') || displayText.includes('function ');
        
        if (hasCodeBlock) {
            return (
                <div 
                    className="font-mono text-sm bg-secondary/10 p-4 rounded-lg border border-border"
                    dangerouslySetInnerHTML={{ __html: displayText.replace(/\n/g, '<br>') }}
                />
            );
        }
        
        return <div dangerouslySetInnerHTML={{ __html: displayText.replace(/\n/g, '<br>') }} />;
    };

    // Helper function to parse options from question text
    const parseQuestionWithOptions = (questionText: string) => {
        // Check if question has embedded options like "A) option B) option C) option D) option"
        const optionPattern = /([A-D])\)\s*([^A-D]+?)(?=\s*[A-D]\)|$)/g;
        const matches = [...questionText.matchAll(optionPattern)];
        
        if (matches.length >= 2) {
            // Extract the question text (everything before first option)
            const firstOptionIndex = questionText.indexOf(matches[0][0]);
            const cleanQuestion = questionText.substring(0, firstOptionIndex).trim();
            
            // Extract options
            const options = matches.map(match => match[2].trim());
            
            return {
                question: cleanQuestion,
                options: options,
                hasOptions: true
            };
        }
        
        return {
            question: questionText,
            options: [],
            hasOptions: false
        };
    };

    const handleStart = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setStep('question'); // Move to question step to show loading state
        setQuestion(""); // Clear any previous question
        setQuestionData(null);
        setError("");
        try {
            const response = await fetch('http://localhost:3001/api/turn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    learnerId: user?.sub || 'anonymous',
                    message: `I want to learn about ${topic}.`, // Implicit start
                    topic: topic
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch question from server');
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            if (data.question) {
                console.log("📥 Received question data:", data.question);
                
                // Handle both string and structured question formats
                if (typeof data.question === 'object' && data.question !== null) {
                    // Structured question format
                    setQuestionData(data.question);
                    setQuestion(data.question.question);
                    
                    // Store the correct answer for THIS question immediately
                    if (data.question.correctAnswer) {
                        setCorrectAnswer(data.question.correctAnswer);
                        console.log("✅ Stored correct answer for this question:", data.question.correctAnswer);
                    } else if (data.question.options && data.question.options.length > 0) {
                        setCorrectAnswer(data.question.options[0]);
                        console.log("✅ Stored first option as correct answer:", data.question.options[0]);
                    }
                    
                    console.log("✅ Structured question loaded with", data.question.options?.length || 0, "options");
                } else if (typeof data.question === 'string') {
                    // Plain string format - try to parse options
                    const parsed = parseQuestionWithOptions(data.question);
                    setQuestion(parsed.question);
                    if (parsed.hasOptions && parsed.options.length >= 4) {
                        setQuestionData({
                            questionType: 'MCQ',
                            difficulty: difficulty,
                            question: parsed.question,
                            options: parsed.options,
                            expectsConfidence: false
                        });
                        console.log("✅ Parsed embedded options:", parsed.options.length);
                    } else {
                        setQuestionData(null);
                        console.log("⚠️ No valid options found in text");
                    }
                } else {
                    console.error("❌ Unknown question format:", typeof data.question);
                }
            }
        } catch (error) {
            console.error('Failed to start session:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate question. Please try again.');
            setStep('setup'); // Go back to setup on error
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (instantAnswer?: string) => {
        const userAnswer = instantAnswer || (questionData?.options ? selectedOption : answer);
        if (!userAnswer.trim()) return;
        
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/turn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    learnerId: user?.sub || 'anonymous',
                    message: userAnswer,
                    topic: topic
                })
            });
            const data = await response.json();

            console.log("📥 Received from backend:", {
                hasEvaluation: !!data.evaluation,
                hasCorrectAnswer: !!data.correctAnswer,
                hasQuestion: !!data.question,
                correctAnswer: data.correctAnswer
            });

            // Use the STORED correct answer for this question, not the one from backend
            // (backend returns the NEXT question's correct answer)
            const storedCorrectAnswer = correctAnswer; // This was set when question loaded
            
            // Determine if answer is correct by comparing to stored correctAnswer
            const correct = userAnswer.trim() === storedCorrectAnswer.trim();
            setIsCorrect(correct);
            setShowFeedback(true);
            
            console.log("🎯 Frontend Feedback:");
            console.log("  User Answer:", JSON.stringify(userAnswer));
            console.log("  User Answer Length:", userAnswer.length);
            console.log("  Stored Correct Answer:", JSON.stringify(storedCorrectAnswer));
            console.log("  Stored Answer Length:", storedCorrectAnswer.length);
            console.log("  Backend Returned (next Q):", JSON.stringify(data.correctAnswer));
            console.log("  Trimmed User:", JSON.stringify(userAnswer.trim()));
            console.log("  Trimmed Correct:", JSON.stringify(storedCorrectAnswer.trim()));
            console.log("  Is Correct?:", correct);
            console.log("  Options:", questionData?.options);
            
            // Save current question to history
            setQuestionHistory(prev => [...prev, {
                questionData,
                question,
                selectedOption: userAnswer,
                answer: userAnswer,
                isCorrect: correct,
                correctAnswer: storedCorrectAnswer  // Use stored answer, not backend's
            }]);
            setCurrentQuestionIndex(prev => prev + 1);
            
            // Store the next question data but don't display it yet
            if (data.question) {
                // Will be loaded when user clicks "Go Next"
                console.log("📥 Next question ready (will show after Go Next)");
            }

            if (data.evaluation) {
                setEvaluation(data.evaluation);
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            const prevQuestion = questionHistory[currentQuestionIndex - 1];
            setQuestionData(prevQuestion.questionData);
            setQuestion(prevQuestion.question);
            setSelectedOption(prevQuestion.selectedOption);
            setAnswer(prevQuestion.answer);
            setIsCorrect(prevQuestion.isCorrect);
            setCorrectAnswer(prevQuestion.correctAnswer);
            setShowFeedback(true);
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };
    const handleGoNext = async () => {
        // Clear all states first
        setShowFeedback(false);
        setSelectedOption("");
        setAnswer("");
        setFilledBlanks({});
        setHint("");
        setCorrectAnswer("");
        setIsCorrect(false);
        setQuestionData(null);
        setQuestion("");
        
        setLoading(true);
        
        try {
            // Request next question
            const response = await fetch('http://localhost:3001/api/turn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    learnerId: user?.sub || 'anonymous',
                    message: 'Next question',
                    topic: topic
                })
            });
            const data = await response.json();

            if (data.question) {
                console.log("📥 Received next question:", data.question);
                
                if (typeof data.question === 'object' && data.question !== null) {
                    setQuestionData(data.question);
                    setQuestion(data.question.question);
                    
                    // ✅ CRITICAL: Store the correct answer for THIS question immediately
                    const newCorrectAnswer = data.question.correctAnswer || (data.question.options && data.question.options[0]) || '';
                    setCorrectAnswer(newCorrectAnswer);
                    console.log("✅ Stored correct answer for new question:", newCorrectAnswer);
                } else if (typeof data.question === 'string') {
                    const parsed = parseQuestionWithOptions(data.question);
                    setQuestion(parsed.question);
                    if (parsed.hasOptions && parsed.options.length >= 4) {
                        setQuestionData({
                            questionType: 'MCQ',
                            difficulty: difficulty,
                            question: parsed.question,
                            options: parsed.options,
                            expectsConfidence: false
                        });
                        // Store correct answer for parsed string questions too
                        const newCorrectAnswer = parsed.options[0] || '';
                        setCorrectAnswer(newCorrectAnswer);
                        console.log("✅ Stored correct answer for parsed question:", newCorrectAnswer);
                    } else {
                        setQuestionData(null);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to get next question:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleGetHint = async () => {
        if (!question || loadingHint) return;
        
        setLoadingHint(true);
        setHint("");
        try {
            const response = await fetch('http://localhost:3001/api/hint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: question,
                    topic: topic,
                    difficulty: questionData?.difficulty || difficulty
                })
            });
            const data = await response.json();
            
            if (data.hint) {
                setHint(data.hint);
            }
        } catch (error) {
            console.error('Failed to get hint:', error);
            setHint("Sorry, couldn't generate a hint. Try thinking about the key concepts related to " + topic);
        } finally {
            setLoadingHint(false);
        }
    };

    if (step === 'setup') {
        return (
            <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Start Socratic Session</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Topic</label>
                        <input
                            type="text"
                            className="w-full bg-secondary/10 border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Neural Networks, Ancient Rome, Calculus"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Difficulty</label>
                        <div className="flex gap-4">
                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${difficulty === level
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-transparent border-border hover:border-primary/50 text-muted-foreground'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        disabled={loading || !topic}
                        className="w-full mt-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? 'Starting...' : 'Begin Session'}
                    </button>
                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    )}
                    {user && <p className="text-xs text-center text-muted-foreground mt-2">Logged in as {user.email}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-card to-background border border-border rounded-xl p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(24,24,27,0.5)] transition-all">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            {/* Evaluation Feedback Overlay */}
            {step === 'evaluation' && evaluation && (
                <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4 animate-in fade-in slide-in-from-top-4">
                    <h4 className="font-semibold text-primary mb-2">Feedback</h4>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <span className="text-xs text-muted-foreground">Understanding</span>
                            <div className="h-2 bg-secondary rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${evaluation.understanding * 100}%` }} />
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Depth</span>
                            <div className="h-2 bg-secondary rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${evaluation.depth * 100}%` }} />
                            </div>
                        </div>
                    </div>
                    {evaluation.keyInsights.length > 0 && (
                        <p className="text-sm text-foreground mt-2">Insight: {evaluation.keyInsights[0]}</p>
                    )}
                    <button
                        onClick={() => setStep('question')}
                        className="text-xs text-primary underline mt-2 hover:text-primary/80"
                    >
                        Continue to next question
                    </button>
                </div>
            )}

            {/* Question Section */}
            {(step === 'question' || step === 'evaluation') && (
                <>
                    {loading && !question ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                            <p className="text-muted-foreground text-sm">Generating your question...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-primary uppercase tracking-wider">
                                                {questionData?.questionType || 'Question'}
                                            </span>
                                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium border border-primary/20">
                                                {questionData?.difficulty || difficulty}
                                            </span>
                                        </div>
                                        {currentQuestionIndex > 0 && (
                                            <button
                                                onClick={handlePrevious}
                                                disabled={loading}
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Previous
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-lg text-foreground leading-relaxed">
                                        {questionData?.questionType === 'MultipleBlanksFill' && questionData.blanks 
                                            ? renderMultipleBlanksQuestion(question, questionData.blanks)
                                            : renderQuestionContent(question)
                                        }
                                    </div>
                                </div>
                            </div>

                    {/* MultipleBlanksFill Question Type */}
                    {questionData?.questionType === 'MultipleBlanksFill' && questionData.blanks ? (
                        <div className="space-y-6">
                            {questionData.blanks.map((blank) => (
                                <div key={blank.id} className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Blank {blank.id}:
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {blank.options.map((option, idx) => {
                                            const isSelected = filledBlanks[blank.id] === option;
                                            const isCorrectOption = showFeedback && blank.correctAnswer === option;
                                            const isWrongSelection = showFeedback && isSelected && blank.correctAnswer !== option;
                                            
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        if (!showFeedback && !loading) {
                                                            setFilledBlanks(prev => ({
                                                                ...prev,
                                                                [blank.id]: option
                                                            }));
                                                        }
                                                    }}
                                                    disabled={showFeedback || loading}
                                                    className={`p-3 rounded-lg border-2 text-sm transition-all ${
                                                        isCorrectOption
                                                            ? 'border-green-500 bg-green-500/20 font-semibold'
                                                            : isWrongSelection
                                                            ? 'border-red-500 bg-red-500/20'
                                                            : isSelected
                                                            ? 'border-primary bg-primary/10 font-medium'
                                                            : 'border-border bg-secondary/5 hover:border-primary/50'
                                                    } disabled:opacity-75 disabled:cursor-not-allowed`}
                                                >
                                                    {isCorrectOption ? '✓ ' : isWrongSelection ? '✗ ' : ''}{option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            {Object.keys(filledBlanks).length === questionData.blanks.length && !showFeedback && (
                                <button
                                    onClick={() => {
                                        const answer = Object.entries(filledBlanks)
                                            .sort(([a], [b]) => Number(a) - Number(b))
                                            .map(([id, val]) => `Blank ${id}: ${val}`)
                                            .join(', ');
                                        handleSubmit(answer);
                                    }}
                                    disabled={loading}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    Submit Answer
                                </button>
                            )}
                        </div>
                    ) : questionData?.options && questionData.options.length >= 4 ? (
                        <div className="space-y-3">
                            {questionData.options.slice(0, 4).map((option, index) => {
                                const isSelected = selectedOption === option && !showFeedback;
                                const isCorrectOption = showFeedback && correctAnswer === option;
                                const isWrongSelection = showFeedback && selectedOption === option && !isCorrect;
                                
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (!showFeedback && !loading) {
                                                setSelectedOption(option);
                                            }
                                        }}
                                        disabled={showFeedback || loading}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                            isCorrectOption
                                                ? 'border-green-500 bg-green-500/20 text-foreground shadow-lg'
                                                : isWrongSelection
                                                ? 'border-red-500 bg-red-500/20 text-foreground shadow-lg'
                                                : isSelected
                                                ? 'border-primary bg-primary/10 text-foreground'
                                                : 'border-border bg-secondary/5 text-foreground hover:border-primary/50 hover:bg-primary/5'
                                        } disabled:opacity-75 disabled:cursor-not-allowed`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                                                isCorrectOption
                                                    ? 'border-green-500 bg-green-500 text-white'
                                                    : isWrongSelection
                                                    ? 'border-red-500 bg-red-500 text-white'
                                                    : isSelected
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-muted-foreground/30 bg-transparent text-muted-foreground'
                                            }`}>
                                                {isCorrectOption ? '✓' : isWrongSelection ? '✗' : String.fromCharCode(65 + index)}
                                            </span>
                                            <span className="flex-1 text-base">{option}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : questionData?.options && questionData.options.length > 0 ? (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <p className="text-sm text-yellow-600">⚠️ Incomplete question (only {questionData.options.length} options). Please try again.</p>
                        </div>
                    ) : (
                        <textarea
                            className="w-full h-32 bg-secondary/5 border border-white/10 rounded-lg p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted-foreground/50"
                            placeholder="Type your explanation here..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={loading || step === 'evaluation'}
                        />
                    )}

                            <div className="flex justify-between items-center mt-4">
                                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Skip Question</button>
                                <div className="flex gap-3">
                                    {showFeedback ? (
                                        <button 
                                            onClick={handleGoNext}
                                            disabled={loading}
                                            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_20px_#ff8d47] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                            {loading ? 'Loading...' : 'Go Next →'}
                                        </button>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={handleGetHint}
                                                disabled={loadingHint || showFeedback}
                                                className="px-4 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                {loadingHint ? 'Getting Hint...' : 'Hint'}
                                            </button>
                                            <button
                                                onClick={() => handleSubmit()}
                                                disabled={loading || step === 'evaluation' || (!selectedOption && !answer.trim())}
                                                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_20px_#ff8d47] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                                {loading ? 'Submitting...' : 'Submit Answer'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {hint && (
                                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-blue-600 mb-1">Hint:</p>
                                            <p className="text-sm text-foreground">{hint}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};
