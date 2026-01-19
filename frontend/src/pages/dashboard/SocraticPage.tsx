import React from 'react';
import { SocraticCard } from '../../components/dashboard/SocraticQuestionCard';

export const SocraticPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Socratic Tutor</h1>
            <div className="max-w-4xl mx-auto">
                <SocraticCard />
            </div>
        </div>
    );
};
