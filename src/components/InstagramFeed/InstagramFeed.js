// src/components/InstagramFeed/InstagramFeed.js
'use client'; // Not strictly needed if no client-side interactions, but good practice

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // If these images link somewhere specific

// Sample data for Instagram images
// In a real application, this would likely come from an API (Instagram API if allowed)
// or be manually curated and stored in a JSON file or fetched from a CMS.
const instagramFeedData = [
    { id: 1, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/ba9NwpWVKPYTjTgL55w9.jpg", alt: "Instagram post 1", link: "#!" },
    { id: 2, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/3TznZcOW3TtcELdPDgXW.jpg", alt: "Instagram post 2", link: "#!" },
    { id: 3, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/QpQvqilcEqgyXUMIuqTj.jpg", alt: "Instagram post 3", link: "#!" },
    { id: 4, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/C9xtt5PPjLf1rOb5e1tk.jpg", alt: "Instagram post 4", link: "#!" },
    { id: 5, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/IvizuDQFtIPnahIGcE5E.jpg", alt: "Instagram post 5", link: "#!" },
    { id: 6, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/XWkkRR20RA1pUHcxb9Bj.jpg", alt: "Instagram post 6", link: "#!" },
    { id: 7, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/KjcxQlO5GTnayix3wFdT.jpg", alt: "Instagram post 7", link: "#!" },
    { id: 8, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/tj0qAy231pXyEujZGsCh.jpg", alt: "Instagram post 8", link: "#!" },
    { id: 9, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/sr51YLXa96mWKfY1X82E.jpg", alt: "Instagram post 9", link: "#!" },
    { id: 10, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/fwrTGDibRihEg0NFpZIX.jpg", alt: "Instagram post 10", link: "#!" },
    { id: 11, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/kh4rI3w7qUEpCZb1Zl8b.jpg", alt: "Instagram post 11", link: "#!" },
    { id: 12, src: "https://hyundaimobil.co.id/storage/page-contents/March2023/3W0e2yHxkt6U49XieppE.jpg", alt: "Instagram post 12", link: "#!" },
];

export default function InstagramFeed() {
    // The data-bg-color="#f5f5f5" will be applied via inline style
    const sectionStyle = {
        backgroundColor: '#f5f5f5',
    };

    return (
        // Use the exact same global CSS classes as your original HTML
        <>
            <div className="hyundai_section_title mb_30 mt-5 text-center">
                <h2 className="title_text">THANK <span>YOU</span></h2>
                <p className="mb-0">For trusting us.</p> {/* Updated subtitle */}
            </div>
            <div className="hyundai_instagram clearfix" style={sectionStyle}>
                <div className="container-fluid p-0"> {/* Bootstrap class for no padding */}
                    <div className="row no-gutters"> {/* Bootstrap classes for no gutter between columns */}
                        {instagramFeedData.map((item) => (
                            // Using Bootstrap column classes for responsiveness
                            <div key={item.id} className="col-lg-2 col-md-3 col-sm-4 col-6"> {/* Adjusted col-sm-4 from your col-md-4 for better fit on small screens with 6 items per row logic */}
                                {/*
                The <a> tag can be a Link if it goes to an internal page,
                or a regular <a> if it goes to Instagram or is just a placeholder.
              */}
                                <Link href={item.link} className="hyundai_instagram_image">
                                    {/*
                    For images that need to fill their container and act like backgrounds,
                    using `next/image` with layout="fill" and objectFit="cover" is ideal.
                    The parent `<a>` or a div inside it would need `position: relative` and an aspect ratio.
                  */}
                                    <div style={{ position: 'relative', width: '100%', paddingTop: '100%' /* 1:1 Aspect Ratio */ }}>
                                        <Image
                                            src={item.src}
                                            alt={item.alt}
                                            layout="fill" // Fills the parent relative container
                                            objectFit="cover" // Covers the area, cropping if necessary
                                        // You might not need explicit width/height when using layout="fill"
                                        />
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
}