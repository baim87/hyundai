// src/components/TestimonialSection/TestimonialSection.js
'use client'; // For react-slick and potentially parallax effect state/refs

import React, { useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

// Import slick carousel CSS files (essential)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample data for testimonials
const testimonialsData = [
    {
        id: 1,
        itemImageSrc: "/assets/images/meta/img_02.jpg", // Path from public folder
        itemImageAlt: "Testimonial background image",
        subTitle: "TESTIMONIALS",
        titlePart1: "BOSTON'S",
        titleSpan: " hyundai CLUB", // Note: Original had <span>BOSTON'S</span>, I've adjusted for flexibility
        quoteIconClass: "fas fa-quote-left",
        adminImages: [
            { src: "/assets/images/meta/img_03.jpg", alt: "Admin 1" },
            { src: "/assets/images/meta/img_04.jpg", alt: "Admin 2" },
        ],
        adminName: "JOHN DOE",
        testimonialText: "If you are looking to find a group of well-established and safe to ride with, you’ve found us. We were founded as a formal hyundai club in Boston in 1985, and are still going strong. We focus on safe riding and we also ride for with any questions you may have.",
    },
    {
        id: 2,
        itemImageSrc: "/assets/images/meta/img_02.jpg",
        itemImageAlt: "Testimonial background image 2",
        subTitle: "OUR CLIENTS",
        titlePart1: "HAPPY ",
        titleSpan: "DRIVERS",
        quoteIconClass: "fas fa-comments", // Example different icon
        adminImages: [
            { src: "/assets/images/meta/img_03.jpg", alt: "Client 1" },
        ],
        adminName: "JANE SMITH",
        testimonialText: "The service was exceptional and the vehicle is a dream to drive. Highly recommend this dealership to anyone looking for a quality Hyundai.",
    },
    // Add more testimonials
];

// Custom Arrow components using your global CSS classes
const CustomPrevArrow = (props) => {
    const { onClick } = props; // className from react-slick might not be needed if styled by mt_left_arrow
    return (
        <button type="button" className="mt_left_arrow" onClick={onClick}>
            <i className="fal fa-angle-left"></i>
        </button>
    );
};

const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
        <button type="button" className="mt_right_arrow" onClick={onClick}>
            <i className="fal fa-angle-right"></i>
        </button>
    );
};


export default function TestimonialSection() {
    const sliderRef = useRef(null);

    const settings = {
        dots: false, // From your data-slick='{"dots": false}'
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000, // Example
        // To use your custom HTML arrows:
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        // Or set arrows: true to use react-slick defaults (style .slick-prev/.slick-next)
        // Or set arrows: false to disable them
    };

    // Parallax: The `parallaxie` class and `data-background` attribute suggest a jQuery plugin.
    // For a React equivalent, you would use a library like `react-scroll-parallax` or implement
    // it with `useEffect` and scroll listeners.
    // Here, we'll set the background image statically. The dynamic parallax effect is omitted.
    const halfBgStyle = {
        backgroundImage: 'url(/assets/images/backgrounds/bg_17.jpg)',
        // Your global CSS for .half_bg should handle its positioning and size.
        // If parallaxie.js did more (like adjusting background-position on scroll),
        // that JS logic needs to be replicated in React.
    };

    return (
        <section className="testimonial_section hyundai_testimonial sec_ptb_100 clearfix">
            <div
                className="half_bg parallaxie" // Keep parallaxie class if it has some base CSS
                style={halfBgStyle}
            ></div>
            <div className="container maxw_1430">
                <div className="carousel_wrap position-relative">
                    <Slider {...settings} ref={sliderRef} className="hyundai_testimonial_carousel">
                        {testimonialsData.map((testimonial) => (
                            <div key={testimonial.id} className="item"> {/* Each direct child of Slider is a slide */}
                                <div className="hyundai_testimonial_item bg_white"> {/* Your global classes */}
                                    <div className="item_image">
                                        <Image
                                            src={testimonial.itemImageSrc}
                                            alt={testimonial.itemImageAlt}
                                            width={600} // Adjust based on your design's image size
                                            height={400} // Adjust
                                            style={{ objectFit: "cover" }} // Or "contain"
                                        />
                                    </div>
                                    <div className="item_content">
                                        <h4 className="sub_title">{testimonial.subTitle}</h4>
                                        <h3 className="title_text">
                                            <span>{testimonial.titlePart1}</span>{testimonial.titleSpan}
                                        </h3>
                                        <span className="quote_icon">
                                            <i className={testimonial.quoteIconClass}></i>
                                        </span>
                                        <ul className="admin_image ul_li mb_30 clearfix">
                                            {testimonial.adminImages.map((img, index) => (
                                                <li key={index}>
                                                    <Image
                                                        src={img.src}
                                                        alt={img.alt}
                                                        width={50} // Adjust
                                                        height={50} // Adjust
                                                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                        <h5 className="admin_name">{testimonial.adminName}</h5>
                                        <p className="mb-0">{testimonial.testimonialText}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    {/* The carousel_nav div and buttons are now handled by react-slick's prevArrow/nextArrow settings */}
                    {/* If you set arrows: true and don't provide custom components, react-slick adds its own. */}
                    {/* If you provide custom components like CustomPrevArrow, they are used. */}
                    {/* If you set arrows: false, no arrows will appear. */}
                    <div className="carousel_nav">
                        {/* This div is now effectively a container for the arrows defined in settings.
                Ensure its CSS positions it correctly if you are using CustomPrevArrow/CustomNextArrow
                that use your global .mt_left_arrow & .mt_right_arrow classes.
                If react-slick's default arrows are used, this div might not be strictly necessary
                unless it provides specific positioning context for .slick-prev & .slick-next. */}
                    </div>

                </div>
            </div>
        </section>
    );
}