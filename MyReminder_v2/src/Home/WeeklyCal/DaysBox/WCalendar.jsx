import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    startOfMonth,
    addMonths, subMonths ,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameDay
} from 'date-fns';
import './WCalendar.css';

function WCalendar({ onDateSelect }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [visibleDays, setVisibleDays] = useState(7);
    const [startIndex, setStartIndex] = useState(0);

    const monthStart = startOfMonth(currentWeek);
    const monthEnd = endOfMonth(currentWeek);
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    useEffect(() => {
        const today = new Date();
        if (isSameDay(startOfMonth(currentWeek), startOfMonth(today))) {
            // Si on a dans le mois actuel, commencer aujourd'hui
            const todayIndex = allDays.findIndex(day => isSameDay(day, today));
            setStartIndex(todayIndex >= 0 ? todayIndex : 0);
        }
    }, [allDays, currentWeek]);
    useEffect(() => {
        const updateVisibleDays = () => {
            const width = window.innerWidth;
            if (width < 480) {
                setVisibleDays(5);  // Mobile: 5 days
            } else if (width < 768) {
                setVisibleDays(7);  // Tablet: 7 days
            } else if (width < 1024) {
                setVisibleDays(10); // Small desktop: 10 days
            } else {
                setVisibleDays(14); // Large desktop: 14 days
            }
        };
        // Run on mount
        updateVisibleDays();
        // Run on window resize
        window.addEventListener('resize', updateVisibleDays);

        // Cleanup listener on unmount
        return () => window.removeEventListener('resize', updateVisibleDays);
    }, []);
    const displayedDays = allDays.slice(startIndex, startIndex + visibleDays);
    const handleDayClick = (date) => {
        setSelectedDate(date);
        // Notify parent component if callback provided
        if (onDateSelect) {
            onDateSelect(date);
        }
    };
    const handleNext = () => {
        if (startIndex + visibleDays <  allDays.length) {
            setStartIndex(startIndex + 1);
        } else {
            const nextMonth = addMonths(currentWeek,1)
            setCurrentWeek(nextMonth);
            setStartIndex(0);
        }
    };
    const handlePrevious = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        } else{
            const prevMonth = subMonths(currentWeek,1)
            const prevStart = startOfMonth(prevMonth);
            const prevEnd = endOfMonth(prevMonth);
            const prevDays = eachDayOfInterval({start: prevStart , end: prevEnd})
            setCurrentWeek(prevMonth);
            setStartIndex(Math.max(0, prevDays.length - visibleDays));
        }
    };
    return (
        <div className="wc-section">
            <h2 className="MedsTitle">
                Weekly scheduled:
            </h2>
            <div className="calendar-container">
                <button
                    className="nav-arrow"
                    onClick={handlePrevious} >
                    <ChevronLeft size={16} />
                </button>
                <div className="days-list">
                    {displayedDays.map((date) => {
                        const isActive = isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());
                        return (
                            <div
                                key={date.toString()}
                                className={`day-item ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`}
                                onClick={() => handleDayClick(date)}>
                                <div className="day-number">{format(date, 'dd')}</div>
                                <div className="day-label">{format(date, 'EEE')}</div>
                            </div>
                        );
                    })}
                </div>
                <button
                    className="nav-arrow"
                    onClick={handleNext}>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
// probeme de 26 --> 1
export default WCalendar;
