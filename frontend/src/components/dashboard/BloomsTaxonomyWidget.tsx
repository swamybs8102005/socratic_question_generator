
import React from 'react';

export const BloomsWidget = () => (
    <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <h3 className="font-semibold text-lg mb-4 relative z-10">Bloom's Progress</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
            {['Remembering', 'Understanding', 'Applying', 'Analyzing', 'Evaluating', 'Creating'].map((level, i) => (
                <div key={level} className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center gap-1 transition-all ${i < 4
                        ? 'bg-primary/20 border-primary/50 text-foreground shadow-[0_0_10px_rgba(255,141,71,0.1)]'
                        : 'bg-secondary/5 border-white/5 text-muted-foreground opacity-70'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${i < 4 ? 'bg-primary text-black' : 'bg-secondary/20'
                        }`}>
                        {i + 1}
                    </div>
                    <span className="text-xs font-medium">{level}</span>
                </div>
            ))}
        </div>
    </div>
);
