// src/components/Footer/Footer.js
import React from 'react';
import Link from 'next/link'; // Use Link for internal navigation if needed in the future

export default function Footer() {
    // The data-bg-color="#151515" will be applied via inline style
    const footerBottomStyle = {
        backgroundColor: '#151515',
    };

    return (
        // Use the exact same global CSS classes as your original HTML
        <footer className="footer_section hyundai_footer clearfix">
            <div className="footer_bottom text-center" style={footerBottomStyle}>
                <div className="container"> {/* Bootstrap container class */}
                    <p className="copyright_text mb-0"> {/* Bootstrap margin bottom class */}
                        © {new Date().getFullYear()} All Rights Reserved {/* Dynamically get current year */}
                        {/* For external links, a regular <a> tag is appropriate */}
                        <a
                            href="https://volantris.web.id"
                            className="author_link text-white" // Your global classes
                            target="_blank" // Open external links in a new tab
                            rel="noopener noreferrer" // Security best practice for target="_blank"
                        >
                            Volantris Digital Agency
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}