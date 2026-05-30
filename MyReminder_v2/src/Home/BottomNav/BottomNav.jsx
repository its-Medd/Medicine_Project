import React from 'react';
import { Home, LayoutGrid, CreditCard, User } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav({ activeTab, onTabChange }) {
    const navItems = [
        { id: 'home', icon: <Home size={24} />, label: 'Home' },
        { id: 'hospital', icon: <LayoutGrid size={24} />, label: 'Hospital' },
        { id: 'repay', icon: <CreditCard size={24} />, label: 'Repay' },
        { id: 'profile', icon: <User size={24} />, label: 'Profile' }
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`bottom-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => onTabChange(item.id)}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
