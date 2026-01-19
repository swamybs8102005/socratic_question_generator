
import React from 'react';
import { Info, Activity, Clock } from 'lucide-react';

export const ProgressAnalytics = () => (
    <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Analytics</h3>
            <Info className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-secondary/5 border border-white/5 flex flex-col gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <div>
                    <div className="text-xl font-bold">92%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
            </div>

            <div className="p-3 rounded-xl bg-secondary/5 border border-white/5 flex flex-col gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <div>
                    <div className="text-xl font-bold">4.5h</div>
                    <div className="text-xs text-muted-foreground">Time Spent</div>
                </div>
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Weak Areas</h4>
            <div className="flex flex-wrap gap-2">
                {['Backpropagation', 'Recurrent Nets'].map(topic => (
                    <span key={topic} className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-[10px] border border-destructive/20">
                        {topic}
                    </span>
                ))}
            </div>
        </div>
    </div>
);
