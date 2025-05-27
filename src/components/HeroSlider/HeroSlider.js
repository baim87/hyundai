// src/components/HeroSlider/HeroSlider.js
'use client'; // Mark as Client Component because react-slick manipulates the DOM

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image'; // For optimized images
import Link from 'next/link';   // For internal links if "Search Now" goes to a page

// Import slick carousel CSS files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Optional: Import your SCSS module for this component
import styles from './HeroSlider.module.scss';

// Sample slide data (in a real app, this would come from props, CMS, or API)
const slideData = [
    {
        id: 1,
        backgroundImg: "https://hyundaimobil.co.id/vehicle/assets/images/ioniq-5/gallery/6.jpg", // Path from public folder
        overlayColor: "",
        titlePart1: "IONIQ 5 ",
        titleSpan: "POWER UP",
        titlePart2: " The Future",
        description: "Aliquam lorem ante, dapibus in, viverra quis, feugiat Phasellus viverra nulla ut metus varius laoreet srtrum aenean imperdiet. Etiam ultricies nisi vel augue.",
        buttonText: "Discover More",
        buttonLink: "/vehicle/ioniq-5", // Example link
        mainImageAlt: "Hyundai Tucson",
    },
    {
        id: 2,
        backgroundImg: "https://hyundaimobil.co.id/vehicle/assets/images/all-new-santafe/gallery/6.jpg",
        overlayColor: "",
        titlePart1: "New ",
        titleSpan: "SANTA FE",
        titlePart2: " Live Bigger",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        buttonText: "Discover More",
        buttonLink: "/vehicle/santa-fe",
        mainImageAlt: "santa-fe",
    },
    {
        id: 3,
        backgroundImg: "https://s7d1.scene7.com/is/image/hyundai/2025-palisade-offer-hp-hero-component-1440-1919?wid=1919&qlt=85,0&fmt=webp",
        overlayColor: "",
        titlePart1: "Empower ",
        titleSpan: "your",
        titlePart2: " World",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        buttonText: "Explore Features",
        buttonLink: "/vehicle/palisade",
        mainImageAlt: "Hyundai Palisade",
    },
];




export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null); // To control slider programmatically if needed

    const settings = {
        dots: false, // Your original setting
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000, // Adjust as needed
        fade: true, // For fade effect if desired, like many hero sliders
        arrows: false,
        cssEase: 'linear',
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlide(newIndex);
        },
        // The data-slick='{"dots": false}' from your HTML implies very basic settings.
        // You might need to add more settings here to match the exact behavior
        // of your original Slick Carousel if it had more custom JS initializations.
    };

    // Handling data-animation and data-delay would typically be done with
    // a React animation library (like Framer Motion, React Spring, or React Awesome Reveal for scroll-based)
    // or CSS animations triggered by class changes when a slide becomes active.
    // For simplicity, this example doesn't implement the data-animation attributes directly.

    return (
        <section className={`slider_section hyundai_slider position-relative clearfix ${styles.sliderSection}`}>
            <Slider {...settings} ref={sliderRef} className={`main_slider clearfix ${styles.mainSlider}`}>
                {slideData.map((slide, index) => (
                    <div key={slide.id}> {/* Key must be on the outermost element of the map */}
                        <div
                            className={`item d-flex align-items-center text-white ${styles.slideItem}`}
                            style={{
                                backgroundImage: `url(${slide.backgroundImg})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <span
                                className={`overlay ${styles.slideOverlay}`}
                                style={{ backgroundColor: slide.overlayColor }} // data-bg-color
                            ></span>
                            <div className="container maxw_1430">
                                <div className="row"> {/* Add row for Bootstrap grid structure */}
                                    <div className="col-lg-6">
                                        <div className={`slider_content ${styles.sliderContent}`}>
                                            <h3 className="text-white"> {/* data-animation handled by CSS/animation lib */}
                                                {slide.titlePart1}<span>{slide.titleSpan}</span>{slide.titlePart2}
                                            </h3>
                                            <p> {/* data-animation handled by CSS/animation lib */}
                                                {slide.description}
                                            </p>
                                            <div className="abtn_wrap"> {/* data-animation handled by CSS/animation lib */}
                                                <Link href={slide.buttonLink} className="custom_btn bg_carparts_red text-uppercase">
                                                    {slide.buttonText}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </Slider>
            <div className={`slide_count_wrap ${styles.slideCountWrap}`}>
                <span className="current">{currentSlide + 1}</span>
                <span className="total">{slideData.length}</span>
            </div>
        </section>
    );
}