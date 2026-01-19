
import React from 'react';
import { Users } from 'lucide-react';

export const GroupLearning = () => (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            Study Group
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Team "Gradient Descent" is active now</p>
        <div className="flex -space-x-2 mb-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-600 border-2 border-background flex items-center justify-center text-[10px] overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs text-primary font-bold">+2</div>
        </div>

        <div className="space-y-3 mb-4">
            <div className="p-2 rounded-lg bg-background/20 border border-white/5">
                <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-indigo-200">Shared Mission</span>
                    <span className="text-indigo-400">80%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[80%]" />
                </div>
            </div>
        </div>

        <button className="w-full py-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-sm transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]">
            Join Session
        </button>
    </div>
);
