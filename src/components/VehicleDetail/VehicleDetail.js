// src/components/VehicleDetail/VehicleDetail.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hls from 'hls.js';
import HeaderVehicleDetail from '../Header/HeaderVehicleDetail';
import Footer from '../Footer/Footer';
import FloatingActionButtons from '../FloatingActionButtons/FloatingActionButtons';


const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str);

// --- Helper: Star Rating Component ---
const StarRating = ({ rating }) => {
    if (typeof rating !== 'number' || rating < 0 || rating > 5) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 === 0.5;
    for (let i = 0; i < fullStars; i++) stars.push(<i key={`full-${i}`} className="fas fa-star text-white"></i>);
    if (hasHalfStar) stars.push(<i key="half" className="fas fa-star-half-alt text-white"></i>);
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) stars.push(<i key={`empty-${i}`} className="far fa-star text-white"></i>);
    return <div className="d-inline-block">{stars}</div>;
};

// --- Helper: FAQ Item Component ---
const FaqItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="faq-item border-bottom py-3">
            <h3 className="mb-0 h6">
                <button
                    className="btn btn-link d-flex justify-content-between align-items-center w-100 text-start text-decoration-none text-dark fw-semibold p-0"
                    type="button" onClick={onClick} aria-expanded={isOpen}
                >
                    {question}
                    <span className={`faq-icon ms-2 ${isOpen ? 'open' : ''}`}>
                        <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    </span>
                </button>
            </h3>
            {isOpen && <div className="faq-answer pt-2 text-muted small"><p className="mb-0">{answer}</p></div>}
        </div>
    );
};

// Place this with other helper components like StarRating, FaqItem, OffersSection

const VehicleColorSelector = ({ colorsData, initialVehicleName = "Vehicle" }) => {
    const hasColors = colorsData && colorsData.colors && colorsData.colors.length > 0;

    const defaultColor = hasColors
        ? colorsData.colors.find(c => c.isDefault) || colorsData.colors[0]
        : null;

    const [selectedColor, setSelectedColor] = useState(defaultColor);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        if (!hasColors || !selectedColor) return;

        setIsImageLoading(true);
        const currentSelectionIsValid = colorsData.colors.some(c => c.name === selectedColor.name);
        if (!currentSelectionIsValid) {
            const newDefault = colorsData.colors.find(c => c.isDefault) || colorsData.colors[0];
            setSelectedColor(newDefault);
        }
    }, [colorsData, selectedColor?.name]);

    useEffect(() => {
        if (!selectedColor) return;
        setIsImageLoading(true);
    }, [selectedColor?.imageSrc]);

    const handleColorSelect = (color) => {
        if (color.name !== selectedColor.name) {
            setSelectedColor(color);
        }
    };

    if (!hasColors || !selectedColor) {
        return <p className="text-center text-muted">Color options are currently unavailable.</p>;
    }

    const swatchStyle = (hex, isSelected) => ({
        backgroundColor: hex,
        width: '50px',
        height: '50px',
        borderRadius: '4px',
        margin: '0 5px',
        cursor: 'pointer',
        border: isSelected ? '2px solid #007bff' : '2px solid transparent',
        boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 4px #007bff' : '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    });

    const checkMarkStyle = {
        color: '#fff',
        backgroundColor: '#007bff',
        borderRadius: '50%',
        padding: '3px',
        fontSize: '0.8rem',
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        border: '1px solid white',
        lineHeight: 1,
    };

    return (
        <div className="vehicle-color-selector text-center py-4">
            <div className="main-vehicle-image-container mb-4" style={{ minHeight: '300px' }}>
                <Image
                    src={selectedColor.imageSrc}
                    alt={`${initialVehicleName} in ${selectedColor.name}`}
                    width={800}
                    height={450}
                    style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                    priority
                    key={selectedColor.name}
                />
            </div>

            <p className="selected-color-name h5 fw-semibold mb-3">
                {selectedColor.name}
            </p>

            <div className="color-swatches-container d-flex justify-content-center align-items-center mb-3">
                {colorsData.colors.map((color) => (
                    <div
                        key={color.name}
                        style={swatchStyle(color.hex, color.name === selectedColor.name)}
                        onClick={() => handleColorSelect(color)}
                        title={color.name}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleColorSelect(color)}
                    >
                        {color.name === selectedColor.name && (
                            <i className="fas fa-check" style={checkMarkStyle}></i>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const OffersSection = ({ offersData, vehicleDisplayFullName }) => {
    const hasVariants = offersData && offersData.variants && offersData.variants.length > 0;

    const determinedInitialId = hasVariants
        ? (offersData.variants.find(v => v.id === offersData.defaultActiveVariantId)
            ? offersData.defaultActiveVariantId
            : offersData.variants[0].id)
        : null;

    const [activeVariantId, setActiveVariantId] = useState(determinedInitialId);

    useEffect(() => {
        if (!hasVariants) return;
        const currentVariantExists = offersData.variants.some(v => v.id === activeVariantId);
        if (!currentVariantExists && offersData.variants.length > 0) {
            setActiveVariantId(offersData.variants[0].id);
        }
    }, [offersData, activeVariantId, hasVariants]);

    if (!hasVariants || !activeVariantId) {
        return null;
    }

    const activeVariant = offersData.variants.find(v => v.id === activeVariantId);
    const currentOffersForVariant = activeVariant ? activeVariant.offers : [];

    const handleVariantChange = (variantId) => {
        setActiveVariantId(variantId);
    };

    const handleRequestQuote = (variantName, paymentType) => {
        const phoneNumber = "6281914438888";
        const message =
            paymentType.toLowerCase() === 'cash'
                ? `Halo, saya tertarik dengan ${vehicleDisplayFullName}, tipe ${variantName}. Minta info lebih lanjut.`
                : `Halo, saya minta perhitungan untuk ${vehicleDisplayFullName} tipe ${variantName}, payment ${paymentType.toLowerCase()}.`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const activeTabStyle = { color: '#002c5f', borderBottom: '2px solid #007bff', fontWeight: 'bold' };
    const inactiveTabStyle = { color: '#343a40', borderBottom: '2px solid transparent' };
    const sectionBgStyle = { backgroundColor: '#f0ebe5' };
    const cardBgStyle = { backgroundColor: '#e6e0d9' };
    const hyundaiBlue = '#002c5f';

    return (
        <section className="vehicle-offers-section py-5" style={sectionBgStyle}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{
                        borderBottom: `2px solid ${hyundaiBlue}`,
                        paddingBottom: '5px',
                        display: 'inline-block',
                        color: hyundaiBlue,
                        fontWeight: 'bold'
                    }}>
                        {offersData.titleSuffix || 'Penawaran'} {vehicleDisplayFullName}
                    </h2>
                </div>

                <div className="d-flex align-items-center mb-3 flex-wrap">
                    <ul className="nav nav-tabs border-bottom-0">
                        {offersData.variants.map((variant) => (
                            <li className="nav-item" key={variant.id}>
                                <a
                                    className="nav-link px-3 py-2"
                                    href="#!"
                                    onClick={(e) => { e.preventDefault(); handleVariantChange(variant.id); }}
                                    style={activeVariantId === variant.id ? activeTabStyle : inactiveTabStyle}
                                    role="button"
                                >
                                    {variant.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {activeVariant && (
                    <div className="row">
                        {currentOffersForVariant && currentOffersForVariant.length > 0 ? (
                            currentOffersForVariant.map((offer, index) => (
                                <div className="col-lg-4 col-md-6 mb-4" key={index}>
                                    <div className="card h-100" style={cardBgStyle}>
                                        <div className="card-body d-flex flex-column">
                                            <h6 className="card-subtitle mb-2 text-uppercase font-weight-bold" style={{ fontSize: '0.8rem', color: '#495057' }}>{offer.displayType}</h6>
                                            <h5 className="card-title font-weight-bold mb-2" style={{ color: '#212529' }}>{offer.title}</h5>
                                            <p className="h2 font-weight-bold mb-3" style={{ fontSize: '2.2rem', color: '#212529' }}>{offer.primaryOffer}</p>
                                            <p className="card-text small text-muted mb-3" style={{ flexGrow: 1 }}>{offer.description}</p>
                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                <button
                                                    className="btn btn-sm btn-light border font-weight-bold"
                                                    style={{ color: hyundaiBlue, borderColor: hyundaiBlue }}
                                                    onClick={() => handleRequestQuote(activeVariant.name, offer.type)}
                                                >
                                                    Minta Penawaran
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <p className="text-center text-muted py-5">
                                    No specific offers available for {activeVariant.name} at this time.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

// --- Main Vehicle Detail Content Component ---
export default function VehicleDetailContent({ pageDataProps, vehicleSlug }) {
    const pageData = pageDataProps;
    const [activeFaq, setActiveFaq] = useState(null);
    const subNavRef = useRef(null);
    const heroVideoRef = useRef(null);
    const [isSubNavSticky, setIsSubNavSticky] = useState(false);
    // useEffect for Sticky Sub-Navigation
    useEffect(() => {
        const subNav = subNavRef.current;
        if (!subNav) return;
        const mainHeader = document.querySelector('.main-site-header');
        const mainHeaderHeight = mainHeader ? mainHeader.offsetHeight : 60;
        let stickyPoint = subNav.offsetTop - mainHeaderHeight;
        const recalculateStickyPoint = () => {
            if (subNav) stickyPoint = subNav.offsetTop - mainHeaderHeight;
        };
        recalculateStickyPoint();
        const handleScroll = () => {
            if (!subNav) return;
            const currentPaddingTop = parseInt(document.body.style.paddingTop || 0, 10);
            if (window.pageYOffset > stickyPoint) {
                if (!subNav.classList.contains('is-sticky-subnav')) {
                    subNav.classList.add('is-sticky-subnav');
                    document.body.style.paddingTop = `${subNav.offsetHeight}px`;
                }
            } else {
                if (subNav.classList.contains('is-sticky-subnav')) {
                    subNav.classList.remove('is-sticky-subnav');
                    document.body.style.paddingTop = '0px';
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', recalculateStickyPoint);
        handleScroll(); // Initial check
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', recalculateStickyPoint);
            document.body.style.paddingTop = '0px';
        };
    }, [pageData]);

    // useEffect for HLS.js Video Player for Hero Background
    useEffect(() => {
        if (typeof Hls === 'undefined') return;
        if (pageData?.hero?.type === 'video' && pageData?.hero?.videoSrc?.endsWith('.m3u8') && heroVideoRef.current) {
            const videoElement = heroVideoRef.current;
            let hlsInstance;
            if (Hls.isSupported()) {
                hlsInstance = new Hls();
                hlsInstance.loadSource(pageData.hero.videoSrc);
                hlsInstance.attachMedia(videoElement);
                hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoElement.play().catch(error => console.warn("Hero video autoplay was prevented:", error));
                });
                hlsInstance.on(Hls.Events.ERROR, (event, data) => { /* ... basic error handling ... */ });
            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                videoElement.src = pageData.hero.videoSrc;
                videoElement.addEventListener('loadedmetadata', () => {
                    videoElement.play().catch(error => console.warn("Hero video autoplay was prevented:", error));
                });
            }
            return () => { if (hlsInstance) hlsInstance.destroy(); };
        }
    }, [pageData?.hero?.type, pageData?.hero?.videoSrc]);

    if (!pageData) {
        return <p>Vehicle information is loading or not available.</p>;
    }

    const vehicleDisplayFullName = `${pageData.year || ''} ${pageData.vehicleName || 'Vehicle'}`.trim();

    return (
        <>
            <div className="vehicle-detail-page"> {/* Overall wrapper for this page's content */}
                {/* --- Sub Navigation (Second Header) --- */}
                <HeaderVehicleDetail
                    pageData={pageData}
                    vehicleSlug={vehicleSlug}
                    subNavRef={subNavRef}
                    isSubNavSticky={isSubNavSticky}
                />

                {/* This div will receive padding-top from the sticky subNav effect */}
                <div id="main-vehicle-content-wrapper">

                    {/* --- Hero Section --- */}
                    {pageData.hero && (
                        <section
                            id="overview"
                            className="hero-section text-white position-relative d-flex flex-column justify-content-between"
                            style={{
                                backgroundImage: (pageData.hero.type === 'image' && pageData.hero.backgroundSrc) ? `url(${pageData.hero.backgroundSrc})` : 'none',
                                backgroundColor: pageData.hero.type === 'video' ? '#000000' : (pageData.hero.backgroundSrc ? 'transparent' : '#121212'),
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                                minHeight: 'calc(100vh - 100px)', // Adjust based on combined header heights
                                overflow: 'hidden',
                            }}
                        >
                            {pageData.hero.type === 'video' && pageData.hero.videoSrc?.endsWith('.m3u8') && (
                                <video ref={heroVideoRef} muted loop playsInline autoPlay className="position-absolute top-0 start-0 w-100 h-100" style={{ objectFit: 'cover', zIndex: 0 }} />
                            )}
                            {pageData.hero.type === 'video' && pageData.hero.videoSrc && !pageData.hero.videoSrc.endsWith('.m3u8') && (
                                <video autoPlay loop muted playsInline className="position-absolute top-0 start-0 w-100 h-100" style={{ objectFit: 'cover', zIndex: 0 }}>
                                    <source src={pageData.hero.videoSrc} type="video/mp4" />
                                </video>
                            )}
                            {(pageData.hero.backgroundSrc || pageData.hero.videoSrc) && (
                                <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: pageData.hero.overlayColor || 'rgba(0,0,0,0.35)', zIndex: 1 }}></div>
                            )}

                            <div className="container position-relative" style={{ zIndex: 2, paddingTop: 'calc(3vh + 300px)', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div className="row justify-content-center">
                                    <div className="col-lg-10 col-xl-8">
                                        {pageData.hero.eyebrow && <p className="text-uppercase small mb-2 hero-eyebrow">{pageData.hero.year}</p>}
                                        <h1 className="display-2 fw-bold my-0 hero-title text-white">{pageData.hero.title}</h1>
                                        {pageData.hero.tagline && <p className="lead mt-3 mb-3 hero-tagline">{pageData.hero.tagline}</p>}
                                        {/* {typeof pageData.hero.rating === 'number' && (
                                        <div className="mb-4 hero-rating">
                                            <StarRating rating={pageData.hero.rating} />
                                            {pageData.hero.reviewsLink && (
                                                <a href={pageData.hero.reviewsLink} className="ms-2 text-white text-decoration-none small">
                                                    See reviews <i className="fas fa-chevron-right fa-xs"></i>
                                                </a>
                                            )}
                                        </div>
                                    )} */}
                                    </div>
                                </div>
                            </div>

                            {pageData.hero.src && (
                                <div className="hero-car-image-container container-fluid px-0 position-relative" style={{ zIndex: 2, marginTop: 'auto', marginBottom: '5vh' }}>
                                    <Image
                                        src={pageData.hero.src}
                                        alt={`${pageData.year || ''} ${pageData.vehicleName} hero image`}
                                        width={1920} height={1080}
                                        style={{ width: '100%', maxWidth: '1200px', height: 'auto', objectFit: 'contain', margin: '0 auto' }}
                                        priority
                                    />
                                </div>
                            )}

                            {pageData.hero.keySpecs && pageData.hero.keySpecs.length > 0 && (
                                <div className="container-fluid bg-opacity-75 py-3 position-relative hero-key-specs-bar" style={{ zIndex: 2, marginTop: !pageData.hero.src ? 'auto' : '0' }}>
                                    <div className="container">
                                        <div className="row text-center gy-2 gx-0"> {/* gy-2 for vertical gap on mobile, gx-0 to remove horizontal gutters between cols */}
                                            {pageData.hero.keySpecs.map(spec => (
                                                // On mobile (xs), each spec takes full width (col-12).
                                                // On sm, 2 per row (col-sm-6). On md, 4 per row (col-md-3).
                                                <div className="col-12 col-sm-6 col-md-3 mb-2 mb-md-0" key={spec.label}>
                                                    <div className="small text-uppercase text-white-50">{spec.label}</div>
                                                    <div className="h5 mb-0 text-white fw-semibold">{spec.value}
                                                        {spec.infoLink && <a href={spec.infoLink} className="text-white-50 ms-1 small"><i className="fas fa-info-circle"></i></a>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* --- Charging Section --- */}
                    {pageData.chargingSection && (
                        <section id="charging" className="py-5 section-pad bg_secondary">
                            <div className="container">
                                {pageData.chargingSection.eyebrow && <p className="text-uppercase small text-muted mb-1">{pageData.chargingSection.eyebrow}</p>}
                                <h2 className="display-5 fw-bold mb-3 section-title" style={{ lineHeight: '1.2' }}>
                                    {pageData.chargingSection.titleLine1 && <>{pageData.chargingSection.titleLine1}<br /></>}
                                    {pageData.chargingSection.titleLine2}
                                </h2>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <p className="lead text-muted">{pageData.chargingSection.description}</p>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    {pageData.chargingSection.chargePoints?.map((point, index) => (
                                        // col-md-6 makes them 2 per row on medium+, stack on smaller
                                        <div key={index} className="col-md-6 mb-4">
                                            <div className="p-4 rounded h-100" style={{ backgroundColor: '#5D5047' }}>
                                                <h3 className="h5 fw-semibold text-white">{point.title}</h3>
                                                <p className="h2 fw-bold my-3 text-white">{point.detail}</p>
                                                <p className="small mb-0 text-white">{point.note}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* --- Electric Advantages Section --- */}
                    {pageData.electricAdvantages && (
                        <section id="electric-advantages" className="py-5 bg-light section-pad">
                            <div className="container">
                                {pageData.electricAdvantages.eyebrow && <p className="text-uppercase small text-muted mb-1 text-center">{pageData.electricAdvantages.eyebrow}</p>}
                                <h2 className="text-center mb-5 display-5 fw-semibold section-title">Electric Advantages</h2>
                                <div className="row text-center">
                                    {pageData.electricAdvantages.items?.map((item, index) => (
                                        // col-md-4 for 3 per row on medium+, col-6 for 2 per row on smaller
                                        <div key={index} className="col-md-4 col-6 mb-4">
                                            <div className="mb-3 electric-advantage-icon">
                                                <i className={`fas ${item.iconClass || 'fa-leaf'} fa-3x text-primary mb-2`}></i>
                                            </div>
                                            <h3 className="h5 fw-semibold">{item.title}</h3>
                                            <p className="text-muted small">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* --- Wheelbase and Space Section --- */}
                    {pageData.wheelbaseSpaceSection && (
                        <section id="wheelbase-space" className="py-5 section-pad bg_secondary">
                            <div className="container">
                                <div className="row align-items-center gy-4"> {/* gy-4 for vertical gap on mobile */}
                                    <div className="col-lg-5">
                                        {pageData.wheelbaseSpaceSection.eyebrow && <p className="text-uppercase small text-muted mb-1">{pageData.wheelbaseSpaceSection.eyebrow}</p>}
                                        <h2 className="display-5 fw-bold mb-3 section-title">{pageData.wheelbaseSpaceSection.title}</h2>
                                        <p className="text-muted">{pageData.wheelbaseSpaceSection.description}</p>
                                    </div>
                                    <div className="col-lg-7">
                                        <div className="position-relative">
                                            {pageData.wheelbaseSpaceSection.comparisonImage1 && (
                                                <div className="mb-4 text-center">
                                                    <Image src={pageData.wheelbaseSpaceSection.comparisonImage1.src} alt={pageData.wheelbaseSpaceSection.comparisonImage1.alt} width={700} height={350} className="img-fluid" style={{ objectFit: 'contain' }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}


                    {pageData.offersSection && (
                        <OffersSection // Now called as a top-level component
                            offersData={pageData.offersSection}
                            vehicleDisplayFullName={vehicleDisplayFullName}
                        />
                    )}
                    {/* --- Exterior/Interior View (Placeholder) --- */}
                    {pageData.exteriorInteriorView && (
                        <section id="exterior-interior-view" className="py-5 bg-white text-dark section-pad"> {/* Changed to bg-white text-dark */}
                            <div className="container"> {/* Removed text-center from container initially */}
                                <h2 className="display-5 fw-semibold mb-4 section-title text-center"> {/* Title centered */}
                                    {pageData.exteriorInteriorView.title || "Explore Exterior & Interior"}
                                </h2>

                                {/* Optional: Tabs for Exterior/Interior if you implement interior later */}
                                {pageData.exteriorInteriorView.tabs && pageData.exteriorInteriorView.tabs.length > 1 && (
                                    <ul className="nav nav-tabs justify-content-center mb-4">
                                        {pageData.exteriorInteriorView.tabs.map(tab => (
                                            <li className="nav-item" key={tab.id}>
                                                {/* Add active state logic for tabs if needed */}
                                                <a className={`nav-link ${tab.id === 'exterior' ? 'active' : ''}`} href={`#${tab.id}`}>
                                                    {tab.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Render the new VehicleColorSelector for the exterior */}
                                {/* Assuming the first tab or only data is for exterior colors */}
                                <VehicleColorSelector
                                    colorsData={pageData.exteriorInteriorView} // Pass the relevant part of pageData
                                    initialVehicleName={pageData.vehicleName}
                                />

                                {/* Placeholder for interior view if you add it later */}
                                {/* {activeTab === 'interior' && (
                                <p className="text-center">Interior view coming soon.</p>
                            )} */}
                            </div>
                        </section>
                    )}
                    {/* --- Hyundai SmartSense Section --- */}
                    {pageData.smartSenseSection && pageData.smartSenseSection.items?.length > 0 && (
                        <section id="smartsense" className="py-5 bg-light section-pad">
                            <div className="container">
                                {pageData.smartSenseSection.eyebrow && <p className="text-uppercase small text-muted mb-1 text-center">{pageData.smartSenseSection.eyebrow}</p>}
                                <h2 className="text-center mb-5 display-5 fw-semibold section-title">Hyundai SmartSense</h2>
                                <div className="row">
                                    {pageData.smartSenseSection.items.map((item, index) => (
                                        // col-md-4 for 3 per row on medium+, col-12 to stack on smaller
                                        <div key={index} className="col-md-4 col-12 mb-4 text-center">
                                            <div className="card h-100 border-0 shadow-sm">
                                                {item.imageSrc && <Image src={item.imageSrc} alt={item.title} width={400} height={225} className="card-img-top" style={{ objectFit: 'contain', paddingTop: '1rem' }} />}
                                                <div className="card-body d-flex flex-column">
                                                    <h3 className="h5 card-title fw-semibold">{item.title}</h3>
                                                    <p className="card-text small text-muted flex-grow-1">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* --- FAQ Section --- */}
                    {pageData.faqSection && pageData.faqSection.faqs?.length > 0 && (
                        <section id="faq" className="py-5 section-pad">
                            <div className="container">
                                {pageData.faqSection.eyebrow && <p className="text-uppercase small text-muted mb-1">{pageData.faqSection.eyebrow}</p>}
                                <h2 className="display-5 fw-bold mb-4 section-title">{pageData.faqSection.title}</h2>
                                <div className="faq-list">
                                    {pageData.faqSection.faqs.map((faq, index) => (
                                        <FaqItem
                                            key={index}
                                            question={faq.question}
                                            answer={faq.answer}
                                            isOpen={activeFaq === index}
                                            onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                    {/* --- Gallery Section --- */}
                    {pageData.gallerySection && pageData.gallerySection.images && pageData.gallerySection.images.length > 0 && (
                        <section id="gallery" className="py-5 section-pad" style={{ backgroundColor: '#E0D8CD' }}>
                            <div className="container">
                                <h2 className="text-center mb-5 display-5 fw-semibold section-title">Gallery</h2>

                                {/* Row 1: 3 images */}
                                {pageData.gallerySection.images.length >= 3 && (
                                    <div className="row g-3 mb-3">
                                        {pageData.gallerySection.images.slice(0, 3).map((img, index) => (
                                            <div key={img.src + "-row1-" + index} className="col-md-4 col-sm-6 col-12">
                                                <div className="gallery-image-wrapper" style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: '4px' }}>
                                                    <Image
                                                        src={img.src}
                                                        alt={img.alt || `Gallery image ${index + 1}`}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded"
                                                        placeholder="blur"
                                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 300))}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Row 2: 2 images (larger) */}
                                {pageData.gallerySection.images.length >= 5 && ( // Condition for at least 5 images for this row
                                    <div className="row g-3 mb-3">
                                        {pageData.gallerySection.images.slice(3, 5).map((img, index) => (
                                            <div key={img.src + "-row2-" + index} className="col-md-6 col-12">
                                                <div className="gallery-image-wrapper" style={{ aspectRatio: '16/10', overflow: 'hidden', borderRadius: '4px' }}>
                                                    <Image
                                                        src={img.src}
                                                        alt={img.alt || `Gallery image ${index + 4}`}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded"
                                                        placeholder="blur"
                                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(800, 500))}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Row 3: 3 images */}
                                {pageData.gallerySection.images.length >= 8 && ( // Condition for at least 8 images for this row
                                    <div className="row g-3">
                                        {pageData.gallerySection.images.slice(5, 8).map((img, index) => (
                                            <div key={img.src + "-row3-" + index} className="col-md-4 col-sm-6 col-12">
                                                <div className="gallery-image-wrapper" style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: '4px' }}>
                                                    <Image
                                                        src={img.src}
                                                        alt={img.alt || `Gallery image ${index + 6}`}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded"
                                                        placeholder="blur"
                                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 300))}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Fallback or message if not enough images for the specific layout */}
                                {pageData.gallerySection.images.length > 0 && pageData.gallerySection.images.length < 3 && (
                                    <div className="row g-3">
                                        {pageData.gallerySection.images.map((img, index) => (
                                            <div key={img.src + "-fallback-" + index} className="col-md-4 col-sm-6 col-12">
                                                <div className="gallery-image-wrapper" style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: '4px' }}>
                                                    <Image
                                                        src={img.src}
                                                        alt={img.alt || `Gallery image ${index + 1}`}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded"
                                                        placeholder="blur"
                                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 300))}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {pageData.gallerySection.images.length === 0 && (
                                    <p className="text-center text-muted">No gallery images available.</p>
                                )}
                            </div>
                        </section>
                    )}

                </div> {/* End of main content wrapper (if you used one) */}
            </div>
            <Footer />
            <FloatingActionButtons />
        </>
    );
}