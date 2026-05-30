import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/SideBar';
import BottomNav from '../BottomNav/BottomNav';
import './AppLayout.css';

function AppLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on current route
    const getActiveTab = () => {
        const path = location.pathname;
        if (path === '/home') return 'home';
        if (path === '/hospital') return 'hospital';
        if (path === '/repay') return 'repay';
        if (path === '/profile') return 'profile';
        return 'home';
    };

    // Handle navigation when user clicks on nav items
    const handleTabChange = (tabId) => {
        navigate(`/${tabId}`);
    };

    return (
        <div className="app-layout">
            {/* 1. Left Sidebar (Visible on Desktop via CSS) */}
            <Sidebar 
                activeTab={getActiveTab()} 
                onTabChange={handleTabChange} 
            />

            {/* 2. Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* 3. Bottom Nav (Visible on Mobile via CSS) */}
            <BottomNav 
                activeTab={getActiveTab()} 
                onTabChange={handleTabChange} 
            />
        </div>
    );
}

export default AppLayout;