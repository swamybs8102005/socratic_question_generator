
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';

export const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <DashboardNavbar />

                <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
