
import React from 'react';
import { Gamepad2, Puzzle, Target, Trophy } from 'lucide-react';

const games = [
    { icon: Trophy, label: 'Quiz Mode', points: '100 XP', color: 'text-yellow-500' },
    { icon: Puzzle, label: 'Puzzle Zone', points: '150 XP', color: 'text-blue-500' },
    { icon: Target, label: 'Mission', points: '300 XP', color: 'text-red-500' },
    { icon: Gamepad2, label: 'Challenge', points: '200 XP', color: 'text-purple-500' },
];

export const GamifiedLearning = () => (
    <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Gamified Zone
        </h3>
        <div className="grid grid-cols-2 gap-4">
            {games.map((game) => (
                <div key={game.label} className="p-4 rounded-xl bg-secondary/5 border border-white/5 hover:bg-secondary/10 hover:border-primary/30 transition-all cursor-pointer group text-center flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full bg-background/50 group-hover:scale-110 transition-transform ${game.color}`}>
                        <game.icon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="font-medium text-sm">{game.label}</div>
                        <div className="text-xs text-primary font-bold">{game.points}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
