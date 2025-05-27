// app/loading-hyundai.js or components/LoadingHyundai/LoadingHyundai.js
'use client'; // Only if it uses client-side hooks, usually not needed for a simple loader

import Logo from '@/components/Logo/Logo'; // Assuming your Logo component path

export default function LoadingHyundai() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column', // To stack logo and spinner
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark overlay
            zIndex: 9999, // Ensure it's on top
            color: 'white', // For any text
        }}>
            <div className="hyundai-loader-logo" style={{ marginBottom: '20px' }}>
                <Logo /> {/* Your Hyundai SVG Logo */}
            </div>
            <div className="hyundai-spinner"></div>
            {/* Optional: Loading text */}
            {/* <p style={{ marginTop: '15px', fontSize: '1.1rem' }}>Loading...</p> */}

            <style jsx>{`
                .hyundai-loader-logo svg {
                    width: 150px; /* Adjust size as needed */
                    height: auto;
                    animation: pulse 1.5s infinite ease-in-out;
                }

                .hyundai-spinner {
                    border: 5px solid #f3f3f3; /* Light grey */
                    border-top: 5px solid #002C5E; /* Hyundai Blue */
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0% {
                        transform: scale(0.95);
                        opacity: 0.7;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0.95);
                        opacity: 0.7;
                    }
                }
            `}</style>
        </div>
    );
}