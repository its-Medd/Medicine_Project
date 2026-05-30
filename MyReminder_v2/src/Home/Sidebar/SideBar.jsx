import React from 'react';
import { Home, LayoutGrid, CreditCard, User } from 'lucide-react';
import './sidebar.css';

export default function Sidebar({ activeTab, onTabChange }) {
    const navItems = [
        { id: 'home', icon: <Home size={24} />, label: 'Home' },
        { id: 'hospital', icon: <LayoutGrid size={24} />, label: 'Hospital' },
        { id: 'repay', icon: <CreditCard size={24} />, label: 'Repay' },
        { id: 'profile', icon: <User size={24} />, label: 'Profile' }
    ];

    return (
        <nav className="sidebar">
            <div className="sidebar-container">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => onTabChange(item.id)}
                        title={item.label}
                    >
                        <div className="icon-wrapper">{item.icon}</div>
                        {/* Label is hidden on very small screens if needed, or styled in CSS */}
                    </button>
                ))}
            </div>
        </nav>
    );
}