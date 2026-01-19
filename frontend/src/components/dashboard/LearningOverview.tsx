
import React from 'react';

export const LearningOverview = () => (
    <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col justify-between group hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
            <h3 className="font-semibold text-lg text-foreground">Current Course</h3>
            <p className="text-muted-foreground">Advanced Machine Learning</p>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Topic: Neural Networks</span>
                    <span className="text-primary font-medium">75%</span>
                </div>
                <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4 rounded-full shadow-[0_0_10px_#ff8d47]" />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded bg-secondary/10 border border-secondary/20 text-secondary">Bloom's: Analyzing</span>
            </div>
        </div>
        <button className="mt-6 w-full py-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-lg font-medium transition-all relative z-10">
            Resume Learning
        </button>
    </div>
);
