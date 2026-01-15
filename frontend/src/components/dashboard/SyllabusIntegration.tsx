
import React from 'react';
import { Book, Upload, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SyllabusIntegration = () => (
    <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                LMS / Syllabus
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">Connected</span>
        </div>

        <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/5 border border-dashed border-border flex flex-col items-center justify-center text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">AIML_Syllabus_2025.pdf</p>
                <p className="text-xs text-muted-foreground">Processed • 12 Topics Generated</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1 h-8">
                    <Upload className="h-3 w-3" /> Upload
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs gap-1 h-8">
                    <RefreshCw className="h-3 w-3" /> Sync LMS
                </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
                Last synced: 2 mins ago
            </div>
        </div>
    </div>
);
