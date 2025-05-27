// src/components/CountdownTimer/CountdownTimer.js
'use client';

import React, { useState, useEffect } from 'react';

const calculateTimeLeft = (targetDateString) => { // Pass targetDateString to make it pure
    const difference = +new Date(targetDateString) - +new Date(); // Current time will differ
    let timeLeftOutput = {};

    if (difference > 0) {
        timeLeftOutput = {
            hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
            jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
            menit: Math.floor((difference / 1000 / 60) % 60),
            detik: Math.floor((difference / 1000) % 60),
        };
    } else {
        // Ensure all keys are present for consistent rendering, even if 0
        timeLeftOutput = { hari: 0, jam: 0, menit: 0, detik: 0 };
    }
    return timeLeftOutput;
};

// Initial state for timeLeft to ensure server and client match on first render pass
// You can also use null or an object with placeholder values like '--'
const initialTimeLeftState = { hari: 0, jam: 0, menit: 0, detik: 0 };
// Or, if you prefer to show placeholders until client hydrates:
// const initialTimeLeftState = { hari: '--', jam: '--', menit: '--', detik: '--' };


export default function CountdownTimer({ targetDate }) {
    // Initialize timeLeft with a non-time-sensitive value or null/empty object
    // This ensures server and client render the same thing initially for these spans.
    const [timeLeft, setTimeLeft] = useState(initialTimeLeftState);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true); // Mark that the component has mounted on the client

        // Calculate and set the initial time left once on the client
        setTimeLeft(calculateTimeLeft(targetDate));

        const timer = setInterval(() => { // Changed from setTimeout to setInterval for continuous update
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer); // Clear interval on component unmount
    }, [targetDate]); // Re-run effect if targetDate changes

    const timerComponents = [];
    if (!hasMounted) {
        // Optionally, render a placeholder or nothing until client-side calculation
        // This ensures the server output for these dynamic parts is minimal or matches a known state.
        // For simplicity, we can use the initialTimeLeftState values.
        // Or return a loading state: return <span>Loading timer...</span>;
    }

    Object.keys(timeLeft).forEach((interval) => {
        // The check `!timeLeft[interval] && timeLeft[interval] !== 0` was a bit confusing.
        // If timeLeft[interval] is 0, it's a valid value to display.
        // We should display if the value exists (even if 0).
        // If hasMounted is false, we'll use initialTimeLeftState which has 0s or '--'
        const valueToDisplay = hasMounted ? timeLeft[interval] : initialTimeLeftState[interval];

        timerComponents.push(
            <li key={interval}>
                <span>{String(valueToDisplay).padStart(2, '0')}</span> {interval}
            </li>
        );
    });

    return (
        <ul className="countdown_timer timein_box ul_li clearfix">
            {timerComponents.length ? timerComponents : <span>Time&apos;s up!</span>}
        </ul>
    );
}