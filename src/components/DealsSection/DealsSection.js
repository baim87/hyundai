// src/components/DealsSection/DealsSection.js
'use client';

import React, { useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from '../CountdownTimer/CountdownTimer';

// Import slick carousel CSS files (these are essential)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const now = new Date();
const tomorrowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);


// Sample data for deals (ensure image paths are correct from the public folder)
const dealsData = [
    {
        id: 2,
        imgSrc: "/assets/images/promo/dpringan.jpg",
        imgAlt: "Promo DP Ringan Mobil Hyundai", // More descriptive alt text
        titlePart1: "DP ",
        titleSpan: "Mulai Dari",
        titlePart2: " 20%",
        description: "Wujudkan mobil Hyundai idaman Anda dengan penawaran DP mulai dari 20% saja pasti dapat bunga 0%! Nikmati kemudahan memiliki kendaraan baru dengan cicilan yang bersahabat. Promo terbatas, jangan sampai ketinggalan!",
        countdownTargetDate: "2025/11/30",
        buttonText: "Ambil Promo",
    },
    {
        id: 3,
        imgSrc: "/assets/images/promo/CarService.png",
        imgAlt: "Promo Gratis Servis dan Suku Cadang Hyundai", // More descriptive alt text
        titlePart1: "Gratis ",
        titleSpan: "Service & Suku Cadang",
        titlePart2: " 3+1 Tahun",
        description: "Nikmati ketenangan berkendara dengan promo gratis biaya servis dan suku cadang selama 3+1 tahun! Perawatan mobil Anda jadi lebih hemat dan terjamin menggunakan suku cadang asli Hyundai. Penawaran eksklusif untuk Anda!",
        countdownTargetDate: "2025/11/30",
        buttonText: "Ambil Promo",
    },
    // You can add more deals here with similar descriptive content
    // Example of another potential deal:
    /*
    {
        id: 4,
        imgSrc: "/assets/images/promo/cashbackbesar.jpg", // Assuming you have an image
        imgAlt: "Promo Cashback Besar Hyundai",
        titlePart1: "Cashback ",
        titleSpan: "Hingga",
        titlePart2: " Puluhan Juta",
        description: "Kesempatan emas! Dapatkan cashback istimewa hingga puluhan juta rupiah untuk pembelian model Hyundai tertentu. Miliki mobil impian Anda dengan harga terbaik. Segera kunjungi dealer kami!",
        countdownTargetDate: "2025/12/31",
        buttonText: "Info Lengkap",
    }
    */
];
// Custom Arrow components for react-slick, using global classes

const generateWhatsappLink = (deal) => {
    const message = `Halo Hyundai, saya minta info promo ${deal.titlePart1}${deal.titleSpan}${deal.titlePart2}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/6281914438888?text=${encodedMessage}`;
};



export default function DealsSection() {

    const sliderRef = useRef(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000, // Example speed
        // To use your custom HTML arrows structure:
        // nextArrow: <CustomNextArrow />,
        // prevArrow: <CustomPrevArrow />,
        // OR to disable arrows completely:
        arrows: false, // Simpler if you don't need custom arrow images/structure
    };

    return (
        // Apply global classes directly. Apply data-bg-color as inline style.
        <section className="deals_section clearfix" style={{ backgroundColor: '#f5f5f5' }}>
            <div className="hyundai_deals_carousel sec_ptb_50 position-relative">
                <Slider {...settings} ref={sliderRef} className="slideshow1_slider clearfix">
                    {dealsData.map((deal) => (
                        // Each direct child of Slider is a slide
                        <div key={deal.id} className="item"> {/* Add your .item class */}
                            <div className="container maxw_1430">
                                <div className="row align-items-center justify-content-lg-between">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="item_image text-center">
                                            <Image
                                                src={deal.imgSrc}
                                                alt={deal.imgAlt}
                                                width={500} // Provide appropriate width
                                                height={400} // Provide appropriate height
                                                style={{ objectFit: 'contain' }} // Or 'cover'
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <div className="item_content">
                                            <h3 className="item_title">
                                                {deal.titlePart1}<span>{deal.titleSpan}</span>{deal.titlePart2}
                                            </h3>
                                            <p>{deal.description}</p>
                                            <div className="countdown_wrap mb_30">
                                                <span className="wrap_title">Hanya hari ini saja!</span>
                                                <CountdownTimer targetDate={tomorrowMidnight.toISOString()} />
                                            </div>
                                            <Link href={generateWhatsappLink(deal)} className="custom_btn bg_carparts_red text-uppercase">
                                                {deal.buttonText}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>

                {/* If you want your exact HTML for carousel_nav and have disabled react-slick's arrows
                    AND you want to control the slider with these custom buttons: */}
                {/*
                <div className="carousel_nav">
                    <button type="button" className="left_arrow" onClick={() => sliderRef.current?.slickPrev()}>
                        <img src="/assets/images/deals/hyundai/img_01.png" alt="Previous" />
                    </button>
                    <button type="button" className="right_arrow" onClick={() => sliderRef.current?.slickNext()}>
                        <img src="/assets/images/deals/hyundai/img_01.png" alt="Next" />
                    </button>
                </div>
                */}
            </div>
        </section>
    );
}