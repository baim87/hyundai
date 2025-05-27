// src/components/CategorySection/CategorySection.js
'use client'; // Good practice if you might add interactions, though static here

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Sample data - in a real app, this would come from props, CMS, or API
const categoryData = [
    {
        id: 1,
        href: "/vehicle-check",
        imgSrc: "/assets/images/category/hyundai/img_01.png",
        imgAlt: "Vehicle Check",
        type: "Vehicle",
        title: "Check",
    },
    {
        id: 2,
        href: "/price-list",
        imgSrc: "/assets/images/category/hyundai/img_02.png",
        imgAlt: "Price List",
        type: "Complete",
        title: "Price List",
    },
    {
        id: 3,
        href: "/promo",
        imgSrc: "/assets/images/category/hyundai/img_03.png",
        imgAlt: "Promotions",
        type: "Smart People",
        title: "Promo",
    },
    {
        id: 4,
        href: "/test-drive",
        imgSrc: "/assets/images/category/hyundai/img_04.png",
        imgAlt: "Test Drive",
        type: "Xperience",
        title: "Drive",
    },
    // Add more categories for testing horizontal scroll
    {
        id: 5,
        href: "/financing",
        imgSrc: "/assets/images/category/hyundai/img_01.png", // Placeholder
        imgAlt: "Financing",
        type: "Solutions",
        title: "Finance",
    },
    {
        id: 6,
        href: "/service-centers",
        imgSrc: "/assets/images/category/hyundai/img_02.png", // Placeholder
        imgAlt: "Service Centers",
        type: "Support",
        title: "Service",
    },
];

export default function CategorySection() {
    return (
        // Use the exact same global CSS classes as your original HTML
        <div className="category_section clearfix">
            <div className="container maxw_1430"> {/* Your global .container and .maxw_1430 */}
                {/*
                    Bootstrap classes for mobile horizontal scroll:
                    - `d-flex`: Makes it a flex container on all screen sizes.
                    - `flex-nowrap`: Prevents items from wrapping to new lines.
                    - `overflow-auto` or specific `overflow-x-auto` (if your Bootstrap version has it)
                      If Bootstrap doesn't have `overflow-x-auto` as a utility,
                      we'll use an inline style for `overflowX`.
                    - `justify-content-start`: Aligns items to the start on mobile.
                    - `justify-content-sm-center`: Centers items on small screens and up (if `ul_li_center` does this).
                      This relies on your `ul_li_center` to apply `justify-content: center` from SM upwards,
                      or you can add `justify-content-sm-center` if your Bootstrap supports it.
                */}
                <ul
                    className="hyundai_category_group ul_li clearfix d-flex flex-nowrap justify-content-start justify-content-sm-center"
                    style={{
                        overflowX: 'auto',  // Explicitly enable horizontal scroll
                        overflowY: 'hidden', // Disable vertical scroll on this element
                        paddingBottom: '15px', // Space for the scrollbar
                        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                    }}
                >
                    {categoryData.map((item) => (
                        <li
                            key={item.id}
                            style={{
                                flexShrink: 0,      // Prevent items from shrinking
                                maxWidth: '150px',  // Give items a minimum width so they don't get too squished
                                marginRight: '15px', // Space between items
                                listStyleType: 'none' // Ensure no list bullets if ul_li doesn't handle it
                            }}
                        >{/* Prevent shrinking, set min-width and margin for spacing */}
                            <Link href={item.href} className="hyundai_category_item text-center">
                                <span className="item_image">
                                    <Image
                                        src={item.imgSrc}
                                        alt={item.imgAlt}
                                        width={80}  // Adjust as needed
                                        height={80} // Adjust as needed
                                        style={{ objectFit: "contain" }}
                                    />
                                </span>
                                <small className="item_type">{item.type}</small>
                                <strong className="item_title">{item.title}</strong>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}