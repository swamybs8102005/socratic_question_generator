import React, { useEffect, useState } from 'react';
import { authClient } from "../../lib/auth";

interface Evaluation {
    understanding: number;
    depth: number;
    hasEvidence: boolean;
    keyInsights: string[];
    weakAreas: string[];
}

export const SocraticCard = () => {
    const [user, setUser] = useState<any>(null);
    const [step, setStep] = React.useState<'setup' | 'question' | 'evaluation'>('setup');
    const [topic, setTopic] = React.useState("");
    const [difficulty, setDifficulty] = React.useState("Intermediate");

    const [question, setQuestion] = React.useState<string>("");
    const [answer, setAnswer] = React.useState("");
    const [evaluation, setEvaluation] = React.useState<Evaluation | null>(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        // Simple check for current user identity
        // @ts-ignore
        const currentUser = authClient?.authentication?.session?.user || null;
        setUser(currentUser);
    }, []);

    const handleStart = async () => {
        if (!topic.trim()) return;
        setLoading(true);
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
            const data = await response.json();
            if (data.question) {
                setQuestion(data.question);
                setStep('question');
            }
        } catch (error) {
            console.error('Failed to start session:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/turn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    learnerId: user?.sub || 'anonymous',
                    message: answer,
                    topic: topic
                })
            });
            const data = await response.json();

            if (data.evaluation) {
                setEvaluation(data.evaluation);
                setStep('evaluation');
            }

            if (data.question) {
                setQuestion(data.question);
                setAnswer("");
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
        } finally {
            setLoading(false);
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
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-medium text-primary uppercase tracking-wider">Socratic Question</span>
                            <h3 className="text-xl font-bold mt-1 text-foreground">{question}</h3>
                        </div>
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium border border-primary/20">{difficulty}</span>
                    </div>

                    <textarea
                        className="w-full h-32 bg-secondary/5 border border-white/10 rounded-lg p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted-foreground/50"
                        placeholder="Type your explanation here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={loading || step === 'evaluation'}
                    />

                    <div className="flex justify-between items-center mt-4">
                        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Skip Question</button>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/10 transition-colors">
                                Hint
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || step === 'evaluation'}
                                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_20px_#ff8d47] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Submitting...' : 'Submit Answer'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
