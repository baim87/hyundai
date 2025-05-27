// src/components/RepresentativeSection/RepresentativeSection.js
'use client'; // If you plan any client-side interactions later

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // If the name links somewhere

// Sample data for representatives
const representativesData = [
    {
        id: 1,
        name: "Ika",
        lastNameOrTitle: "Purnama", // Or "Top Sales Consultant"
        achievement: "1280 Clients Helped", // Replaces 'item_price'
        imgSrc: "/assets/images/sales/sales.jpg", // Replace with actual representative image
        imgAlt: "Ika - Representative of the Month",
        departmentOrBrand: "Hyundai Sales", // Replaces 'product_label'
        rating: 4.5, // Example rating
        profileLink: "/representatives/baim-makarim", // Example link
        buttonLink: "#",
        buttonText: "Whatsapp"
    }
];

// Helper function to render stars (if you keep the star rating)
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
        stars.push(<li key={`full-${i}`}><i className="fas fa-star"></i></li>);
    }
    if (hasHalfStar) {
        stars.push(<li key="half"><i className="fas fa-star-half-alt"></i></li>); // Or fal fa-star if only full/empty
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<li key={`empty-${i}`}><i className="far fa-star"></i></li>); // Using 'far' for empty star
    }
    return stars;
};


export default function RepresentativeSection() {
    return (
        // Original section classes remain
        <section className="product_section deco_wrap clearfix">
            <div className="container maxw_1430">
                <div className="hyundai_section_title mb_30 text-center">
                    <h2 className="title_text">MEET OUR SALES <span>OF THE MONTH</span></h2>
                    <p className="mb-0">Satisfaction guaranteed.</p> {/* Updated subtitle */}
                </div>

                <div className="row justify-content-center">
                    {representativesData.map((rep) => (
                        // Using existing Bootstrap column classes
                        <div key={rep.id} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                            {/* Re-purposing hyundai_product_grid for the representative card */}
                            <div className="hyundai_product_grid "> {/* Added a new specific class for easier targeting */}
                                <ul className="product_label ul_li text-uppercase clearfix">
                                    {/* Re-purposing product_label for department or brand */}
                                    <li className="bg_carparts_red">{rep.departmentOrBrand}</li>
                                </ul>
                                <div className="item_image "> {/* Added specific class */}
                                    {/* Use next/image for optimized representative photos */}
                                    <Image
                                        src={rep.imgSrc}
                                        alt={rep.imgAlt}
                                        width={300}  // Adjust to fit your card design
                                        height={300} // Adjust to make it square or desired aspect ratio
                                        style={{ objectFit: 'cover', }} // Make image circular
                                    />
                                </div>
                                <div className="item_content "> {/* Added specific class */}
                                    {/* Re-purposing item_price for an achievement or key metric */}
                                    <span className="item_price ">{rep.achievement}</span>
                                    <h3 className="item_title ">
                                        {/* Link the name if there's a profile page */}
                                        <Link href={rep.profileLink}>{rep.name}</Link>
                                    </h3>
                                    {/* Re-purposing item_type for last name or title */}
                                    <span className="item_type text-uppercase">{rep.lastNameOrTitle}</span>

                                    {/* Optional: Re-purposing rating_star for performance or keep as is */}
                                    {rep.rating && (
                                        <ul className="rating_star ul_li clearfix ">
                                            {renderStars(rep.rating)}
                                        </ul>
                                    )}
                                </div>
                                <a href={rep.buttonLink} className="custom_btn btn_sm mt-3 bg_black w-100 text-uppercase" target="_blank" rel="noopener noreferrer">
                                    {rep.buttonText}
                                </a>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Decorative image from original HTML - keep if desired */}
            {/* <div className="deco_image hyundai_image_1">
        <img
          src="assets/images/home_hyundai/img_01.png" // Make sure this path is correct from /public
          alt="decoration"
        />
      </div> */}
        </section>
    );
}