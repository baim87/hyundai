// src/components/BigFeatureSection/BigFeatureSection.js
'use client'; // For useState and event handlers

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // If the button is an internal link

// Sample data for tabs and content (replace with your actual data)
const featureTabsData = [
    {
        id: 'tab_one',
        tabImageSrc: '/assets/images/feature/hyundai/img_02.png',
        tabImageAlt: 'Feature Tab 1',
        content: {
            mainImageSrc: '/assets/images/feature/hyundai/img_01.png',
            mainImageAlt: 'Feature Image 1',
            title: 'Adjusts The Hydraulic Fork',
            description: 'Aliquam lorem ante, dapibus in, viverra quis, feugiat Phasellus viverra nulla ut metus varius laoreet srtrum aenean imperdiet. Etiam ultricies nisi vel augue.',
            infoList: [
                'web & Mobile - Optimized',
                'Coustom domain server',
                'best hosting on the market',
                'outstanding support',
            ],
            buttonText: 'Whatsapp',
            buttonLink: '#!', // Or a real link
        },
    },
    {
        id: 'tab_two',
        tabImageSrc: '/assets/images/feature/hyundai/img_03.png',
        tabImageAlt: 'Feature Tab 2',
        content: {
            mainImageSrc: '/assets/images/feature/hyundai/img_01.png', // Assuming same image, change if different
            mainImageAlt: 'Feature Image 2',
            title: 'Advanced Safety Systems', // Example different title
            description: 'Phasellus viverra nulla ut metus varius laoreet srtrum aenean imperdiet. Etiam ultricies nisi vel augue. Aliquam lorem ante, dapibus in, viverra quis, feugiat.',
            infoList: [
                'Enhanced crumple zones',
                'AI-powered driver assist',
                '360-degree camera view',
                'Emergency braking system',
            ],
            buttonText: 'Learn More',
            buttonLink: '#!',
        },
    },
    {
        id: 'tab_three',
        tabImageSrc: '/assets/images/feature/hyundai/img_04.png',
        tabImageAlt: 'Feature Tab 3',
        content: {
            mainImageSrc: '/assets/images/feature/hyundai/img_01.png', // Assuming same image, change if different
            mainImageAlt: 'Feature Image 3',
            title: 'Eco-Friendly Performance', // Example different title
            description: 'Etiam ultricies nisi vel augue. Aliquam lorem ante, dapibus in, viverra quis, feugiat Phasellus viverra nulla ut metus varius laoreet srtrum aenean imperdiet.',
            infoList: [
                'Reduced carbon footprint',
                'Hybrid powertrain options',
                'Sustainable materials',
                'Optimized fuel efficiency',
            ],
            buttonText: 'Discover Tech',
            buttonLink: '#!',
        },
    },
];

export default function BigFeatureSection() {
    const [activeTab, setActiveTab] = useState(featureTabsData[0].id); // Default to the first tab

    // Handle Parallax: The `parallaxie.js` and `data-background` are jQuery dependent.
    // To achieve parallax in React, you'd typically use:
    // 1. A React parallax library (e.g., `react-scroll-parallax`, `react-parallax`).
    // 2. Custom JavaScript using `useEffect` to listen to scroll events and update background position.
    // For this direct translation, I'll apply the background image via inline style
    // and omit the dynamic parallax effect for simplicity.
    const sectionStyle = {
        backgroundImage: 'url(/assets/images/backgrounds/bg_16.jpg)',
        // For parallax, you'd add more styles here updated by JS
    };

    // Find the content for the currently active tab
    const activeTabData = featureTabsData.find(tab => tab.id === activeTab)?.content;

    return (
        <section
            className="feature_section hyundai_big_feature sec_ptb_100 has_overlay clearfix" // Your global classes
            style={sectionStyle} // Apply background image
        // The `parallaxie` class might still trigger some basic CSS if defined,
        // but the JS functionality of parallaxie.js won't work directly.
        >
            <div className="overlay"></div> {/* Your global .overlay class needs to style this */}
            <div className="container"> {/* Bootstrap container */}
                <div className="row align-items-center justify-content-lg-between"> {/* Bootstrap row */}
                    <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
                        <ul className="tabs_menu nav ul_li_block clearfix" role="tablist">
                            {featureTabsData.map((tab) => (
                                <li key={tab.id}>
                                    <a
                                        className={activeTab === tab.id ? 'active' : ''}
                                        href={`#${tab.id}`} // Keep href for semantics, but click is handled
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab(tab.id);
                                        }}
                                        data-toggle="tab" // Keep if your Bootstrap CSS styles based on this
                                    >
                                        <Image
                                            src={tab.tabImageSrc}
                                            alt={tab.tabImageAlt}
                                            width={100} // Adjust as needed
                                            height={100} // Adjust as needed
                                            style={{ objectFit: "contain" }}
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-10">
                        <div className="tab-content">
                            {/* Render only the active tab's content */}
                            {activeTabData && (
                                <div id={activeTab} className="tab-pane active"> {/* Always active class for styling */}
                                    <div className="row align-items-center">
                                        <div className="col-lg-6">
                                            <div className="item_image text-center">
                                                <Image
                                                    src={activeTabData.mainImageSrc}
                                                    alt={activeTabData.mainImageAlt}
                                                    width={500} // Adjust
                                                    height={400} // Adjust
                                                    style={{ objectFit: "contain" }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="item_content">
                                                <h3 className="item_title mb_15">
                                                    {activeTabData.title}
                                                </h3>
                                                <p className="mb_15">
                                                    {activeTabData.description}
                                                </p>
                                                <ul className="info_list ul_li_block mb_30 clearfix">
                                                    {activeTabData.infoList.map((info, index) => (
                                                        <li key={index}>
                                                            <i className="fal fa-check"></i> {info}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Link href={activeTabData.buttonLink} className="custom_btn bg_carparts_red text-uppercase">
                                                    {activeTabData.buttonText}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* The other tab-pane divs are no longer needed as we render content dynamically */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}