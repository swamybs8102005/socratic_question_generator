
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BrainCircuit,
    Gamepad2,
    TrendingUp,
    BookOpen,
    Users,
    FileText,
    History,
    UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BrainCircuit, label: 'Socratic Questions', path: '/dashboard/socratic' },
    { icon: History, label: 'Quiz History', path: '/dashboard/quiz-history' },
    { icon: Gamepad2, label: 'Gamified Learning', path: '/dashboard/gamified' },
    { icon: TrendingUp, label: 'Progress & Analytics', path: '/dashboard/progress' },
    { icon: BookOpen, label: 'LMS / Syllabus', path: '/dashboard/syllabus' },
    { icon: Users, label: 'Group Challenges', path: '/dashboard/groups' },
    { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
];

export const Sidebar = () => {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-sidebar/95 border-r border-border h-screen sticky top-0 backdrop-blur-xl z-30">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    AI Path
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Student Dashboard</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {sidebarItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(255,141,71,0.2)] border border-primary/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                                )}
                                <item.icon className={cn("h-5 w-5 z-10 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                                <span className="font-medium z-10">{item.label}</span>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_#ff8d47]" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/5 border border-primary/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                    <h3 className="font-semibold text-foreground">Daily Streak</h3>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-3xl font-bold text-primary">12</span>
                        <span className="text-sm text-muted-foreground mb-1">days</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
                </div>
            </div>
        </aside>
    );
};
