
import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Moon, Sun, Bell, Monitor, Type } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export const SettingsPage = () => {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <DashboardNavbar />

                <main className="flex-1 p-6 lg:p-8 max-w-4xl mx-auto w-full">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Settings</h1>

                    <div className="space-y-8">
                        {/* Appearance Section */}
                        <section className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-primary" /> Appearance
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4 text-muted-foreground" />
                                        <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                                    </div>
                                    <Switch id="dark-mode" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Type className="h-4 w-4 text-muted-foreground" />
                                        <Label className="text-base">Font Size</Label>
                                    </div>
                                    <div className="w-1/3">
                                        <Slider defaultValue={[16]} max={24} min={12} step={1} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Notifications Section */}
                        <section className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" /> Notifications
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="email-notifs">Email Notifications</Label>
                                    <Switch id="email-notifs" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="socratic-reminders">Daily Socratic Reminders</Label>
                                    <Switch id="socratic-reminders" defaultChecked />
                                </div>
                            </div>
                        </section>

                        {/* Learning Pace */}
                        <section className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Learning Pace</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {['Relaxed', 'Standard', 'Intensive'].map((pace, i) => (
                                    <div key={pace} className={`p-4 rounded-lg border cursor-pointer transition-all text-center ${i === 1 ? 'bg-primary/20 border-primary text-primary' : 'bg-secondary/5 border-border hover:bg-secondary/10'}`}>
                                        {pace}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};
