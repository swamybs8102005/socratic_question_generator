import React from 'react';
import { SocraticCard } from '../../components/dashboard/SocraticQuestionCard';

export const SocraticPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Socratic Tutor</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SocraticCard />
                <div className="bg-gradient-to-br from-card to-background border border-border rounded-xl p-6 relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-4 text-foreground">Learning Context</h3>
                    <p className="text-muted-foreground">
                        The Socratic method fosters critical thinking by asking guiding questions rather than providing direct answers.
                        Use this interface to explore complex topics and deepen your understanding through dialogue.
                    </p>
                </div>
            </div>
        </div>
    );
};
