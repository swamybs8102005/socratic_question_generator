
import React from 'react';
import { LearningOverview } from '@/components/dashboard/LearningOverview';
import { BloomsWidget } from '@/components/dashboard/BloomsTaxonomyWidget';
import { SocraticCard } from '@/components/dashboard/SocraticQuestionCard';
import { GamifiedLearning } from '@/components/dashboard/GamifiedLearning';
import { SyllabusIntegration } from '@/components/dashboard/SyllabusIntegration';
import { RewardsPanel } from '@/components/dashboard/RewardsPanel';
import { ProgressAnalytics } from '@/components/dashboard/ProgressAnalytics';
import { GroupLearning } from '@/components/dashboard/GroupLearning';

export const DashboardHome = () => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Student</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Ready to challenge your understanding today?</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-foreground rounded-lg border border-white/5 transition-all">
                        Daily Report
                    </button>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-[0_0_15px_#ff8d47] transition-all">
                        Quick Quiz
                    </button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 delay-100">
                <LearningOverview />
                <BloomsWidget />
                <RewardsPanel />
            </div>

            {/* Middle Row: Analytics & Tools */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 delay-150">
                <ProgressAnalytics />
                <GamifiedLearning />
                <SyllabusIntegration />
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-6 delay-200">
                <div className="lg:col-span-2">
                    <SocraticCard />
                </div>
                <div className="space-y-6">
                    <GroupLearning />
                </div>
            </div>
        </div>
    );
};
