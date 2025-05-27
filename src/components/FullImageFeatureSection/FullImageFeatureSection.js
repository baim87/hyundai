// src/components/FullImageFeatureSection/FullImageFeatureSection.js
'use client'; // Not strictly needed if no client-side interactions, but good practice if you might add hover effects etc.

import React from 'react';
import Image from 'next/image'; // For optimized images, though here <img> might be simpler for background-like behavior
import Link from 'next/link';   // If the button becomes an internal link

// Sample data for feature items
const featureItemsData = [
    {
        id: 1,
        imgSrc: "/assets/images/feature/hyundai/img_05.jpg", // Path from public folder
        imgAlt: "Feature 1",
        title: "ACCELERATING",
        buttonText: "Whatsapp",
        buttonLink: "https://wa.me/yourphonenumber", // Example external link
    },
    {
        id: 2,
        imgSrc: "/assets/images/feature/hyundai/img_06.jpg",
        imgAlt: "Feature 2",
        title: "INNOVATING", // Example different title
        buttonText: "Learn More",
        buttonLink: "/innovations", // Example internal link
    },
    {
        id: 3,
        imgSrc: "/assets/images/feature/hyundai/img_07.jpg",
        imgAlt: "Feature 3",
        title: "CONNECTING",
        buttonText: "Get In Touch",
        buttonLink: "/contact",
    },
    {
        id: 4,
        imgSrc: "/assets/images/feature/hyundai/img_08.jpg",
        imgAlt: "Feature 4",
        title: "EXPLORING",
        buttonText: "Discover",
        buttonLink: "/explore",
    },
    // Add more items if your design has more than 4
];

export default function FullImageFeatureSection() {
    return (
        <section className="feature_section clearfix"> {/* Your global class */}
            <div className="container-fluid p-0"> {/* Bootstrap classes */}
                <div className="row no-gutters"> {/* Bootstrap classes */}
                    {featureItemsData.map((item) => (
                        <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 col-xs-12"> {/* Bootstrap column classes */}
                            <div className="feature_fullimage text-center"> {/* Your global class */}
                                {/*
                  For full-width background images within a div,
                  using a standard <img> tag with absolute positioning and object-fit: cover
                  is often easier to style with external CSS than next/image if the image
                  is purely decorative and needs to fill the div.
                  If you use next/image, you might need to set layout="fill" and objectFit="cover"
                  and ensure its parent .feature_fullimage has position: relative and defined dimensions.
                */}
                                <Image
                                    src={item.imgSrc}
                                    alt={item.imgAlt}
                                // Style this img tag with global CSS to act like a background:
                                // .feature_fullimage img {
                                //   position: absolute;
                                //   top: 0;
                                //   left: 0;
                                //   width: 100%;
                                //   height: 100%;
                                //   object-fit: cover;
                                //   z-index: 1;
                                // }
                                // OR, set it as a background image on the div itself:
                                // style={{ backgroundImage: `url(${item.imgSrc})` }}
                                // For this direct translation, keeping the <img> tag as in original HTML.
                                // Ensure your global CSS for .feature_fullimage and its img child works as intended.
                                />
                                <div className="item_content"> {/* Your global class, needs CSS for overlay positioning */}
                                    {/*
                    Your global .feature_fullimage .item_content CSS should handle:
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 2;
                    text-align: center;
                    // etc.
                  */}
                                    <h3 className="item_title text-white mb_30">{item.title}</h3>
                                    {item.buttonLink.startsWith('/') ? (
                                        <Link href={item.buttonLink} className="custom_btn btn_sm bg_black text-uppercase">
                                            {item.buttonText}
                                        </Link>
                                    ) : (
                                        <a href={item.buttonLink} className="custom_btn btn_sm bg_black text-uppercase" target="_blank" rel="noopener noreferrer">
                                            {item.buttonText}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}