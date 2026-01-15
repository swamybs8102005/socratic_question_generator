
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth';

export const DashboardNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
            // Fallback redirect even on error
            navigate('/');
        }
    };

    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
            <div className="flex-1 flex max-w-xl items-center gap-4">
                {/* Course Selector - Mockup */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                    <span className="text-sm font-medium text-foreground">AIML - Semester 4</span>
                </div>

                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search topics, questions..."
                        className="pl-9 bg-secondary/5 border-border focus:bg-background focus:border-primary/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/20 hover:text-primary transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#ff8d47]" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/50 transition-all">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                                <AvatarFallback>ST</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border backdrop-blur-xl">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link to="/account/profile" className="w-full flex items-center">
                                <User className="mr-2 h-4 w-4" /> Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link to="/dashboard/settings" className="w-full flex items-center">
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={handleLogout}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
