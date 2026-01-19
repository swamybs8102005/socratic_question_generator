
import React from 'react';
import { Award, Medal, Crown } from 'lucide-react';

export const RewardsPanel = () => (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-all">
        <h3 className="font-semibold text-lg z-10 flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Rewards
        </h3>
        <div className="flex-1 flex items-center justify-center gap-6 mt-2 relative z-10">
            <div className="text-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center text-xl font-bold text-primary shadow-[0_0_20px_rgba(255,141,71,0.2)] bg-background">
                        LVL 5
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">Pro</div>
                </div>
                <span className="text-xs text-muted-foreground mt-2 block">Rank</span>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-secondary flex items-center gap-1">
                    2,450
                    <Award className="h-4 w-4 text-secondary/70" />
                </div>
                <span className="text-xs text-muted-foreground">Flow Points</span>
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Medal className="h-3 w-3 text-yellow-500" /> Gold Badge</span>
            <span>Next: 450 XP</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
);
