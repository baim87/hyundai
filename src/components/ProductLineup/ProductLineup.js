// src/components/ProductLineup/ProductLineup.js
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import allCarModelsData from '@/data/carModels.json';
import { Col, Dropdown } from 'react-bootstrap';

// Helper to format price
const formatDisplayPrice = (price, currency = "IDR") => {
    if (typeof price !== 'number') return "N/A";
    return `${currency === "IDR" ? "Rp." : ""}${price.toLocaleString('id-ID')}`;
};

const tabsData = [
    { id: 'all', label: 'All', href: '#all' },
    { id: 'ev', label: 'EV', href: '#ev' },
    { id: 'suv', label: 'SUV', href: '#suv' },
    { id: 'mpv', label: 'MPV', href: '#mpv' },
    { id: 'crossover', label: 'Crossover', href: '#crossover' },
];

// Get basePath from environment variable (set in next.config.js)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Individual Product Card Component
function ProductCard({ productData }) {
    const initialVariant = productData.detailedVariants && productData.detailedVariants.length > 0
        ? productData.detailedVariants[0]
        : null;
    const [selectedVariant, setSelectedVariant] = useState(initialVariant);

    // This price is shown on the main clickable card area (usually "starting from" or default variant)
    const cardLinkPrice = productData.initialPriceDisplay;

    // This price is shown in/near the dropdown, reflecting the selected variant
    const dropdownSelectedPrice = selectedVariant
        ? formatDisplayPrice(selectedVariant.price, selectedVariant.currency)
        : productData.initialPriceDisplay;


    const handleVariantChange = (variantKey) => {
        if (!variantKey) {
            setSelectedVariant(initialVariant);
            return;
        }
        const [name, transmission] = variantKey.split('__');
        const newSelectedVariant = productData.detailedVariants.find(
            v => v.variant_name === name && v.transmission === transmission
        );
        setSelectedVariant(newSelectedVariant || initialVariant);
    };

    const selengkapnyaLink = productData.actions.find(a => a.text === 'Selengkapnya')?.link || `#!`;

    // No stopPropagation needed on dropdown itself if it's outside the Link

    return (
        <div className="col-6 col-sm-6 col-md-4 col-lg-4 product-item d-flex flex-column">
            {/* Part 1: The Clickable Card Area (Link) */}
            <Link href={selengkapnyaLink} passHref legacyBehavior>
                <a className="product-card-link-wrapper text-decoration-none d-block">
                    {/* MOBILE VERSION CARD CONTENT (EXCLUDING DROPDOWN) */}
                    <div className="hyundai-product-card d-block d-sm-none">
                        <ul className="hyundai-product-card__labels">
                            <li className="hyundai-product-card__label hyundai-product-card__label--sale">
                                {productData.mobileLabel}
                            </li>
                        </ul>
                        <div className="hyundai-product-card__image-wrapper">
                            <Image
                                src={productData.mobileImage} // Path already includes basePath if needed from mapping
                                alt={productData.alt}
                                width={300} height={200} style={{ objectFit: "contain" }}
                                className="hyundai-product-card__image"
                            />
                        </div>
                        <div className="hyundai-product-card__content">
                            <span className="hyundai-product-card__price">{cardLinkPrice}</span>
                            <h3 className="hyundai-product-card__title">{productData.title}</h3>
                            <span className="hyundai-product-card__type d-block text-muted small">
                                {productData.detailedVariants.length > 0 ? `${productData.detailedVariants.length} variant${productData.detailedVariants.length !== 1 ? 's' : ''}` : 'Details unavailable'}
                            </span>
                        </div>
                    </div>

                    {/* DESKTOP/TABLET VERSION CARD CONTENT (EXCLUDING DROPDOWN) */}
                    <div className="hyundai_product_grid d-none d-sm-block">
                        <ul className="product_label ul_li text-uppercase clearfix">
                            <li className="bg_carparts_red">{productData.desktopLabel}</li>
                        </ul>
                        <div className="item_image"> {/* Hover actions will be inside this */}
                            <Image
                                src={productData.desktopImage} // Path already includes basePath if needed
                                alt={productData.alt}
                                width={400} height={300} style={{ objectFit: "contain" }}
                            />
                            <ul className="product_action_btns ul_li_block text-uppercase text-center clearfix">
                                {productData.actions?.filter(action => action.text !== 'Selengkapnya').map((action, index) => (
                                    <li key={index} onClick={(e) => e.stopPropagation()}> {/* Stop link trigger for other actions */}
                                        <Link
                                            href={action.link}
                                            target={action.link.startsWith('http') || action.link.startsWith('https://wa.me') ? '_blank' : '_self'}
                                            rel={action.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            legacyBehavior
                                        >
                                            <a onClick={(e) => e.stopPropagation()} className="action-link-style">
                                                <span><i className={action.icon}></i></span>
                                                <span>{action.text}</span>
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="item_content">
                            <span className="item_price">{cardLinkPrice}</span>
                            <h3 className="item_title">{productData.title}</h3>
                            <span className="item_type text-uppercase">
                                {productData.detailedVariants.length > 0 ? `${productData.detailedVariants.length} variant${productData.detailedVariants.length !== 1 ? 's' : ''}` : 'Details unavailable'}
                            </span>
                        </div>
                    </div>
                </a>
            </Link>

            {/* Part 2: The Variant Dropdown (Sibling to the Link, thus OUTSIDE the clickable area) */}
            {/* Desktop Dropdown Area */}
            <div className="variant-dropdown-container pt-2 px-3 pb-3 d-none d-sm-block">
                {productData.detailedVariants && productData.detailedVariants.length > 1 && (
                    <Dropdown onSelect={handleVariantChange} className="w-100">
                        <Dropdown.Toggle
                            variant="outline-secondary" size="sm"
                            id={`dropdown-variants-desktop-${productData.id}`}
                            className="w-100 text-truncate"
                        >
                            {selectedVariant ?
                                `${selectedVariant.variant_name} (${selectedVariant.transmission}) - ${formatDisplayPrice(selectedVariant.price, selectedVariant.currency)}`
                                : "Select Variant & See Price"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="product-card-dropdown-menu w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {productData.detailedVariants.map(v => (
                                <Dropdown.Item
                                    key={`${productData.id}-desk-${v.variant_name}-${v.transmission}`}
                                    eventKey={`${v.variant_name}__${v.transmission}`}
                                    active={selectedVariant && selectedVariant.variant_name === v.variant_name && selectedVariant.transmission === v.transmission}
                                >
                                    {v.variant_name} ({v.transmission}) - {formatDisplayPrice(v.price, v.currency)}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
                {productData.detailedVariants && productData.detailedVariants.length === 1 && (
                    <div className="text-muted small text-center w-100 single-variant-info py-2">
                        {productData.detailedVariants[0].variant_name} ({productData.detailedVariants[0].transmission}) - {formatDisplayPrice(productData.detailedVariants[0].price, productData.detailedVariants[0].currency)}
                    </div>
                )}
            </div>

            {/* Mobile Dropdown Area (also sibling to the link) */}
            <div className="variant-dropdown-container pt-2 px-2 pb-2 d-block d-sm-none">
                {productData.detailedVariants && productData.detailedVariants.length > 0 && (
                    <Dropdown onSelect={handleVariantChange} className="w-100">
                        <Dropdown.Toggle
                            variant="outline-secondary" size="sm"
                            id={`dropdown-variants-mobile-${productData.id}`}
                            className="w-100 text-truncate"
                        >
                            {selectedVariant ? `${selectedVariant.variant_name} (${selectedVariant.transmission})` : "Select Variant"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="product-card-dropdown-menu w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {productData.detailedVariants.map(v => (
                                <Dropdown.Item
                                    key={`${productData.id}-mob-${v.variant_name}-${v.transmission}`}
                                    eventKey={`${v.variant_name}__${v.transmission}`}
                                    active={selectedVariant && selectedVariant.variant_name === v.variant_name && selectedVariant.transmission === v.transmission}
                                >
                                    {v.variant_name} ({v.transmission}) - {formatDisplayPrice(v.price, v.currency)}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
                {selectedVariant && (
                    <div className="text-center text-primary fw-bold mt-1 selected-variant-price-mobile">
                        {formatDisplayPrice(selectedVariant.price, selectedVariant.currency)}
                    </div>
                )}
            </div>

            <style jsx>{`
                .product-item {
                    /* margin-bottom is handled by Bootstrap's g-3/g-md-4 on the parent .row */
                }
                .product-card-link-wrapper {
                    display: block; /* Takes up space */
                    color: inherit;
                    /* flex-grow: 1; Let content define height, overall .product-item is flex-column */
                    /* The card visual elements (.hyundai-product-card, .hyundai_product_grid)
                       should define their own backgrounds and borders. */
                }
                .hyundai-product-card, .hyundai_product_grid {
                    /* These are the visual cards, now children of the <a> tag */
                    display: flex;
                    flex-direction: column;
                    background-color: #fff;
                    border: 1px solid #eee;
                    border-radius: .25rem;
                    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
                    /* min-height needed to ensure consistent card appearance before dropdown */
                    min-height: 380px; /* Adjust this based on your content */
                }
                .hyundai-product-card__content, .item_content {
                    flex-grow: 1; /* Pushes variant summary to bottom if card is flex */
                    display: flex;
                    flex-direction: column;
                    padding: 1rem;
                }
                .item_content .item_type, .hyundai-product-card__content .hyundai-product-card__type {
                     margin-top: auto;
                     padding-top: 0.5rem;
                }
                .variant-dropdown-container {
                    flex-shrink: 0; /* Prevent this container from shrinking */
                    background-color: #fff; /* Give it a background if cards are also white */
                    /* Add border-top if you want a visual separation from the card above */
                    /* border-top: 1px solid #eee; */
                    /* Ensure dropdown aligns with card padding if card has padding */
                    margin-left: -1px; /* Offset card border */
                    margin-right: -1px; /* Offset card border */
                    /* This may need adjustment based on exact card padding/border */
                }
                .variants-dropdown .dropdown-toggle,
                .variant-dropdown-container .dropdown-toggle {
                    font-size: 0.8rem;
                    padding: 0.35rem 0.5rem;
                    border-color: #ced4da;
                }
                .variants-dropdown .dropdown-menu,
                .variant-dropdown-container .dropdown-menu {
                    font-size: 0.8rem;
                }
                .selected-variant-price-mobile {
                    font-size: 0.9rem;
                }

                /* Hover Actions Styling */
                .hyundai_product_grid .item_image { position: relative; overflow: hidden; }
                .product_action_btns { position: absolute; bottom: 0; left: 0; width: 100%; background-color: rgba(0, 44, 94, 0.85); padding: 8px 0; transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; list-style: none; margin: 0; display: flex; justify-content: space-around; opacity: 0; transform: translateY(100%); z-index: 5; /* Ensure actions are above image */}
                .hyundai_product_grid .item_image:hover .product_action_btns { opacity: 1; transform: translateY(0); }
                .product_action_btns li .action-link-style { color: white; text-decoration: none; display: flex; flex-direction: column; align-items: center; font-size: 0.75rem; padding: 3px 5px; }
                .product_action_btns li .action-link-style span i { font-size: 1.1rem; margin-bottom: 3px; }

                /* Original card styling */
                .hyundai-product-card__labels { list-style: none; padding: 0.5rem; margin:0; position: absolute; top: 0; left:0; z-index:1; }
                .hyundai-product-card__label { background-color: #002C5E; color: white; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 3px; }
                .hyundai_product_grid .product_label { /* ... */ }
                .bg_carparts_red { background-color: red; color: white; padding: 2px 5px; }
            `}</style>
        </div>
    );
}


export default function ProductLineup() {
    const [activeTab, setActiveTab] = useState('all');
    const [productsForDisplay, setProductsForDisplay] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const mappedData = allCarModelsData.map((car, index) => {
            let minPrice = Infinity;
            let currency = "IDR";
            if (car.variants && car.variants.length > 0) {
                car.variants.forEach(v => {
                    if (typeof v.price === 'number' && v.price < minPrice) {
                        minPrice = v.price;
                        currency = v.currency;
                    }
                });
            }
            // Use the formatted minPrice for initialPriceDisplay
            const initialPriceDisplay = minPrice !== Infinity ? formatDisplayPrice(minPrice, currency) : "N/A";
            const placeholderImage = '/assets/images/placeholder-card.webp';

            // Prepend basePath to image URLs that come from your data file and start with '/'
            const carMobileImage = car.card_mobile_image || car.model_image_url || placeholderImage;
            const carDesktopImage = car.card_desktop_image || car.model_image_url || placeholderImage;

            return {
                id: `${car.product_id || car.model_name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
                category: car.category ? car.category.toLowerCase() : 'uncategorized',
                mobileLabel: car.category ? car.category.toUpperCase() : 'N/A',
                desktopLabel: car.category ? car.category.toUpperCase() : 'N/A',
                mobileImage: carMobileImage.startsWith('/') ? `${basePath}${carMobileImage}` : carMobileImage,
                desktopImage: carDesktopImage.startsWith('/') ? `${basePath}${carDesktopImage}` : carDesktopImage,
                alt: car.alt_text || car.model_name,
                initialPriceDisplay: initialPriceDisplay,
                title: car.model_name,
                detailedVariants: car.variants || [],
                actions: (car.actions || []).map(action => ({
                    ...action,
                    // Prepend basePath to internal action links, but not external or wa.me links
                    link: (action.link && action.link.startsWith('/') && !action.link.startsWith('//') && !action.link.startsWith('https://wa.me'))
                        ? `${basePath}${action.link}`
                        : action.link || '#!'
                })),
            };
        });
        setProductsForDisplay(mappedData);
    }, []); // Removed basePath from dependency array as it's defined outside and won't change after mount for this component

    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredProducts(productsForDisplay);
        } else {
            setFilteredProducts(productsForDisplay.filter(p => p.category === activeTab));
        }
    }, [activeTab, productsForDisplay]);

    const handleTabClick = (e, tabId) => {
        e.preventDefault();
        setActiveTab(tabId);
    };

    return (
        <section className="product_section sec_ptb_100 deco_wrap clearfix">
            <div className="container maxw_1430">
                <div className="hyundai_section_title mb_30 text-center">
                    <h2 className="title_text">Our <span>Lineup</span></h2>
                    <p className="mb-0">New Thinking, New Possibilities</p>
                </div>

                <div className="hyundai_tabs_navigation_wrapper">
                    <ul className="hyundai_tabs_nav ul_li_center nav text-uppercase d-flex flex-nowrap d-sm-flex" role="tablist" style={{ overflowX: 'auto', justifyContent: 'flex-start' }}>
                        {tabsData.map(tab => (
                            <li key={tab.id} className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                    href={tab.href} // For non-JS fallback or direct linking, but onClick handles SPA
                                    onClick={(e) => handleTabClick(e, tab.id)}
                                    role="tab"
                                >
                                    {tab.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="tab-content mb_50 mt-4">
                    <div id="all_products_pane" className="tab-pane fade show active">
                        <div className="row justify-content-center g-3 g-md-4">
                            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <ProductCard key={product.id} productData={product} />
                            )) : (
                                <Col xs={12}>
                                    <p className="text-center text-muted py-5">No products found {activeTab !== 'all' ? `in the "${activeTab}" category` : ''}.</p>
                                </Col>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Image - ensure path is correct and prefixed with basePath */}
            <div className="deco_image hyundai_image_1" style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: -1, opacity: 0.3 }}>
                <Image
                    src={`${basePath}/assets/images/home_hyundai/img_01.png`}
                    alt="decoration"
                    width={150}
                    height={225}
                    style={{ objectFit: "contain" }}
                    unoptimized // if basePath is used and output: 'export'
                />
            </div>
            <style jsx global>{`
                /* Tab navigation styles */
                .hyundai_tabs_nav { border-bottom: 1px solid #dee2e6; margin-bottom: 2rem; scrollbar-width: none; -ms-overflow-style: none; }
                .hyundai_tabs_nav::-webkit-scrollbar { display: none; }
                .hyundai_tabs_nav .nav-item { margin-bottom: -1px; }
                .hyundai_tabs_nav .nav-link { border: 1px solid transparent; border-top-left-radius: .25rem; border-top-right-radius: .25rem; padding: .75rem 1.25rem; color: #6c757d; font-weight: 500; white-space: nowrap; }
                .hyundai_tabs_nav .nav-link:hover, .hyundai_tabs_nav .nav-link:focus { border-color: #e9ecef #e9ecef #dee2e6; isolation: isolate; }
                .hyundai_tabs_nav .nav-link.active { color: #002C5E; background-color: #fff; border-color: #dee2e6 #dee2e6 #fff; font-weight: 700; }
            `}</style>
        </section>
    );
}