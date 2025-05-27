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

// Individual Product Card Component
function ProductCard({ productData }) {
    const initialVariant = productData.detailedVariants && productData.detailedVariants.length > 0
        ? productData.detailedVariants[0]
        : null;
    const [selectedVariant, setSelectedVariant] = useState(initialVariant);

    const displayPriceForCardLink = productData.initialPriceDisplay; // Price shown on the main card link area (starting from)
    const displayPriceForDropdownSelection = selectedVariant // Price shown with selected dropdown variant
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

    // No need for stopLinkClick if dropdown is truly outside the Link component

    return (
        <div className="col-6 col-sm-6 col-md-4 col-lg-4 product-item d-flex flex-column"> {/* product-item is now a flex column */}
            {/* Part 1: The Clickable Card Area (Link) */}
            <Link href={selengkapnyaLink} passHref legacyBehavior>
                <a className="product-card-link-wrapper text-decoration-none d-block"> {/* This is the clickable area */}
                    {/* MOBILE VERSION CARD (Dropdown will be outside this 'a' tag too for mobile for consistency) */}
                    <div className="hyundai-product-card d-block d-sm-none"> {/* Removed h-100, height managed by flex on product-item */}
                        <ul className="hyundai-product-card__labels">
                            <li className="hyundai-product-card__label hyundai-product-card__label--sale">
                                {productData.mobileLabel}
                            </li>
                        </ul>
                        <div className="hyundai-product-card__image-wrapper">
                            <Image
                                src={productData.mobileImage}
                                alt={productData.alt}
                                width={300} height={200} style={{ objectFit: "contain" }}
                                className="hyundai-product-card__image"
                            />
                        </div>
                        <div className="hyundai-product-card__content">
                            <span className="hyundai-product-card__price">{displayPriceForCardLink}</span> {/* Shows initial/lowest price */}
                            <h3 className="hyundai-product-card__title">{productData.title}</h3>
                            {/* Variant count or basic info can go here if dropdown is separate */}
                            <span className="hyundai-product-card__type d-block text-muted small">
                                {productData.detailedVariants.length > 1 ? `${productData.detailedVariants.length} variants available` : (productData.detailedVariants.length === 1 ? `${productData.detailedVariants[0].variant_name} (${productData.detailedVariants[0].transmission})` : '')}
                            </span>
                        </div>
                    </div>

                    {/* DESKTOP/TABLET VERSION CARD */}
                    <div className="hyundai_product_grid d-none d-sm-block"> {/* Removed h-100 */}
                        <ul className="product_label ul_li text-uppercase clearfix">
                            <li className="bg_carparts_red">{productData.desktopLabel}</li>
                        </ul>
                        <div className="item_image">
                            <Image
                                src={productData.desktopImage}
                                alt={productData.alt}
                                width={400} height={300} style={{ objectFit: "contain" }}
                            />
                        </div>
                        <div className="item_content">
                            <span className="item_price">{displayPriceForCardLink}</span> {/* Shows initial/lowest price */}
                            <h3 className="item_title">{productData.title}</h3>
                            <span className="item_type text-uppercase">
                                {productData.detailedVariants.length > 1 ? `${productData.detailedVariants.length} variants available` : (productData.detailedVariants.length === 1 ? `${productData.detailedVariants[0].variant_name} (${productData.detailedVariants[0].transmission})` : '')}
                            </span>
                        </div>
                    </div>
                </a>
            </Link>

            {/* Part 2: The Variant Dropdown (Sibling to the Link, so OUTSIDE the clickable area) */}
            {/* This is shown for both mobile (d-block) and desktop (d-sm-block) if needed,
                or you can use d-none d-sm-block for desktop only.
                For simplicity, making it always visible below the card area.
            */}
            <div className="variant-dropdown-container pt-2 px-3 pb-3 d-none d-sm-block"> {/* px-3 pb-3 for padding, desktop only */}
                {productData.detailedVariants && productData.detailedVariants.length > 1 && (
                    <Dropdown onSelect={handleVariantChange} className="w-100">
                        <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            id={`dropdown-variants-${productData.id}`}
                            className="w-100 text-truncate"
                        >
                            {selectedVariant ?
                                `${selectedVariant.variant_name} (${selectedVariant.transmission}) - ${formatDisplayPrice(selectedVariant.price, selectedVariant.currency)}`
                                : "Select Variant & See Price"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="product-card-dropdown-menu w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {productData.detailedVariants.map(v => (
                                <Dropdown.Item
                                    key={`${productData.id}-${v.variant_name}-${v.transmission}`}
                                    eventKey={`${v.variant_name}__${v.transmission}`}
                                    active={selectedVariant && selectedVariant.variant_name === v.variant_name && selectedVariant.transmission === v.transmission}
                                >
                                    {v.variant_name} ({v.transmission}) - {formatDisplayPrice(v.price, v.currency)}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
                {/* If only one variant, display it simply, also outside the link */}
                {productData.detailedVariants && productData.detailedVariants.length === 1 && (
                    <div className="text-muted small text-center w-100">
                        {productData.detailedVariants[0].variant_name} ({productData.detailedVariants[0].transmission}) - {formatDisplayPrice(productData.detailedVariants[0].price, productData.detailedVariants[0].currency)}
                    </div>
                )}
            </div>
            {/* Mobile specific dropdown, outside the link, below the card content */}
            <div className="variant-dropdown-container pt-2 px-2 pb-2 d-block d-sm-none">
                {productData.detailedVariants && productData.detailedVariants.length > 0 && ( // Show even for 1 variant on mobile
                    <Dropdown onSelect={handleVariantChange} className="w-100">
                        <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            id={`dropdown-variants-mob-${productData.id}`}
                            className="w-100 text-truncate"
                        >
                            {selectedVariant ?
                                `${selectedVariant.variant_name} (${selectedVariant.transmission})`
                                : "Select Variant"}
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
                {selectedVariant && ( // Show selected variant price on mobile below dropdown
                    <div className="text-center text-primary fw-bold mt-1 selected-variant-price-mobile">
                        {formatDisplayPrice(selectedVariant.price, selectedVariant.currency)}
                    </div>
                )}
            </div>


            <style jsx>{`
                .product-item {
                    margin-bottom: 1.5rem; /* Ensure space if cards wrap */
                }
                .product-card-link-wrapper {
                    display: block;
                    color: inherit;
                    flex-grow: 1; /* Allows the link/card area to take up space before dropdown */
                    /* No height: 100% here, let content define height, and parent .product-item use flex */
                }
                .hyundai-product-card, .hyundai_product_grid {
                    display: flex;
                    flex-direction: column;
                    /* height: 100%; Removed, as the link wrapper now handles filling space if parent is flex */
                    background-color: #fff;
                    border: 1px solid #eee;
                    border-radius: .25rem;
                    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075); /* Softer shadow */
                }
                .hyundai-product-card__content, .item_content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 1rem;
                }
                .item_content .item_type, .hyundai-product-card__content .hyundai-product-card__type {
                     margin-top: auto; /* Pushes this and dropdown (if it were here) to bottom */
                     padding-top: 0.5rem; /* Space above it */
                }
                
                /* Variant Dropdown Container - Sits BELOW the clickable card area */
                .variant-dropdown-container {
                    /* This container is a sibling to the Link, not a child */
                    /* It does not need stopPropagation */
                    flex-shrink: 0; /* Prevent it from shrinking */
                }

                .variants-dropdown .dropdown-toggle, /* For react-bootstrap Dropdown */
                .product-card-dropdown-menu .dropdown-toggle, /* If custom */
                .variant-dropdown-container .dropdown-toggle { /* Specific target */
                    font-size: 0.8rem;
                    padding: 0.35rem 0.5rem; /* Slightly more padding */
                    border-color: #ced4da;
                }
                 .variants-dropdown .dropdown-menu, /* For react-bootstrap Dropdown */
                 .product-card-dropdown-menu .dropdown-menu, /* If custom */
                 .variant-dropdown-container .dropdown-menu { /* Specific target */
                    font-size: 0.8rem;
                }
                .selected-variant-price-mobile {
                    font-size: 0.9rem;
                }


                /* Hover Actions Styling */
                .hyundai_product_grid .item_image { position: relative; overflow: hidden; }
                .product_action_btns { position: absolute; bottom: 0; left: 0; width: 100%; background-color: rgba(0, 44, 94, 0.85); padding: 8px 0; transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; list-style: none; margin: 0; display: flex; justify-content: space-around; opacity: 0; transform: translateY(100%); }
                .hyundai_product_grid .item_image:hover .product_action_btns { opacity: 1; transform: translateY(0); }
                .product_action_btns li .action-link-style { color: white; text-decoration: none; display: flex; flex-direction: column; align-items: center; font-size: 0.75rem; padding: 3px 5px; }
                .product_action_btns li .action-link-style span i { font-size: 1.1rem; margin-bottom: 3px; }

                /* Original card styling */
                .hyundai-product-card__labels { list-style: none; padding: 0.5rem; margin:0; position: absolute; top: 0; left:0; z-index:1; }
                .hyundai-product-card__label { background-color: #002C5E; color: white; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 3px; }
                .hyundai_product_grid .product_label { /* Your existing styles */ }
                .bg_carparts_red { background-color: red; color: white; padding: 2px 5px; }
            `}</style>
        </div>
    );
}

// FULL ProductLineup component (export default function ProductLineup() { ... })
// REMAINS EXACTLY THE SAME AS IN YOUR LAST PROVIDED CODE,
// including the useEffect hooks for mapping and filtering data, and the main section layout.
// The only change is that it now calls this revised ProductCard component.

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
            const initialPriceDisplay = minPrice !== Infinity ? formatDisplayPrice(minPrice, currency) : "N/A";
            const placeholderImage = '/assets/images/placeholder-card.webp'; // Make sure this image exists

            return {
                id: `${car.product_id || car.model_name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
                category: car.category ? car.category.toLowerCase() : 'uncategorized',
                mobileLabel: car.category ? car.category.toUpperCase() : 'N/A',
                desktopLabel: car.category ? car.category.toUpperCase() : 'N/A',
                mobileImage: car.card_mobile_image || car.model_image_url || placeholderImage,
                desktopImage: car.card_desktop_image || car.model_image_url || placeholderImage,
                alt: car.alt_text || car.model_name,
                initialPriceDisplay: initialPriceDisplay, // Used by card if no variant selected
                title: car.model_name,
                detailedVariants: car.variants || [],
                actions: car.actions || [
                    { icon: 'fab fa-whatsapp', text: 'Whatsapp', link: `https://wa.me/6281914438888?text=Halo%20Hyundai,%20saya%20tertarik%20dengan%20${encodeURIComponent(car.model_name)}` },
                    { icon: 'fas fa-eye', text: 'Selengkapnya', link: `/vehicle/${car.product_id || car.model_name.toLowerCase().replace(/\s+/g, '-')}` },
                    { icon: 'fas fa-file-pdf', text: 'e-Brochure', link: '#!' },
                ],
            };
        });
        setProductsForDisplay(mappedData);
    }, []);

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
        <section className="product_section deco_wrap clearfix">
            <div className="container maxw_1430">
                <div className="hyundai_section_title mb_30 text-center">
                    <h2 className="title_text">Our <span>Lineup</span></h2>
                    <p className="mb-0">New Thinking, New Possibilities</p>
                </div>

                <div className="hyundai_tabs_navigation_wrapper">
                    <ul className="hyundai_tabs_nav ul_li_center nav text-uppercase d-flex flex-nowrap d-sm-flex" role="tablist" style={{ overflowX: 'auto', justifyContent: 'flex-center' }}>
                        {tabsData.map(tab => (
                            <li key={tab.id} className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                    href={tab.href}
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

            <div className="deco_image hyundai_image_1" style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: -1, opacity: 0.3 }}>
                <Image
                    src="/assets/images/home_hyundai/img_01.png"
                    alt="decoration"
                    width={150}
                    height={225}
                    style={{ objectFit: "contain" }}
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