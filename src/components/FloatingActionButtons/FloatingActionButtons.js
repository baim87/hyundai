'use client';

import React from 'react';
import { FaWhatsapp, FaCar } from 'react-icons/fa';
import Link from 'next/link';

const FloatingActionButtons = ({
    phoneNumber = "6281914438888",
    vehicleName = "this vehicle",
    whatsappMessage = `Halo, saya tertarik dengan ${vehicleName} dan ingin bertanya lebih lanjut.`
}) => {

    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    // --- Inline Styles ---
    const containerStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        width: '100%',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1030, // Common z-index for fixed elements
        backgroundColor: '#ffffff', // Base background for the container
    };

    const baseButtonStyle = {
        flex: '1 1 50%', // Each button takes 50%
        padding: '15px 10px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        outline: 'none',
        // Transition can be added here, but :hover and :active pseudo-classes can't be done inline easily
        // For hover/active effects, you'd typically use CSS classes or JavaScript event handlers to change styles.
        // For simplicity in a fully inline approach, we'll omit complex hover transitions.
    };

    const testDriveButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: '#002c5f', // Hyundai Primary Blue
        color: 'white',
    };

    const whatsappButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: '#25D366', // WhatsApp Green
        color: 'white',
    };

    const iconStyle = {
        marginRight: '8px',
        fontSize: '1.2rem',
    };
    // --- End Inline Styles ---


    // Note: For :hover and :active states with inline styles, you'd typically manage them with JavaScript state,
    // which adds complexity. Using CSS classes (even global ones) is generally preferred for these.
    // For this "fully inline" request, we'll skip dynamic hover/active style changes via JS for brevity.

    return (
        <div style={containerStyle}>
            <Link href={"/test-drive"} />
            <button
                onClick={handleWhatsAppClick}
                type="button"
                style={whatsappButtonStyle}
            // onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1DA851'}
            // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
            >
                <FaWhatsapp style={iconStyle} />
                WhatsApp
            </button>
        </div>
    );
};

export default FloatingActionButtons;