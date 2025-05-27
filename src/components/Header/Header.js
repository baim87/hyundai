// src/components/Header/Header.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Logo from '../Logo/Logo'; // Assuming Logo.js renders your SVG logo

// All styling for this component is expected to come from global CSS files
// (e.g., style.css, bootstrap.min.css) linked in src/app/layout.js.
// Class names used here (header_section, brand_logo, main_menu, mobile_menu_btn, etc.)
// must be defined in your global stylesheets.

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null); // Stores ID: 'vehicles'
    const [activeSubmenu, setActiveSubmenu] = useState(null);  // Stores ID: 'services', 'layanan', 'mobile-services'

    const megaMenuContainerRef = useRef(null);
    const servicesSubmenuContainerRef = useRef(null);
    // Ref for the mobile menu itself to help with outside clicks
    const mobileMenuRef = useRef(null);


    const toggleMobileMenu = () => {
        const newOpenState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newOpenState);
        if (newOpenState) {
            document.body.classList.add('mobile-menu-active-lock-scroll');
            // Close desktop dropdowns when mobile menu opens
            setActiveMegaMenu(null);
            setActiveSubmenu(null);
        } else {
            document.body.classList.remove('mobile-menu-active-lock-scroll');
        }
    };

    const handleDesktopMenuToggle = (menuType, menuId, event) => {
        if (event) event.stopPropagation(); // Prevent event from bubbling up and closing immediately

        if (menuType === 'mega') {
            setActiveMegaMenu(prev => (prev === menuId ? null : menuId));
            setActiveSubmenu(null);
        } else if (menuType === 'sub') {
            setActiveSubmenu(prev => (prev === menuId ? null : menuId));
            // If opening a main submenu, ensure mega menu is closed if it's a different branch
            if (menuId === 'services') { // Example: 'services' is a top-level submenu
                setActiveMegaMenu(null);
            }
        }
    };

    const handleMobileSubmenuToggle = (menuId, event) => {
        if (event) event.stopPropagation();
        setActiveSubmenu(prev => (prev === menuId ? null : menuId));
    }

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event) {
            // Close desktop mega menu
            if (megaMenuContainerRef.current && !megaMenuContainerRef.current.contains(event.target)) {
                // Check if the click was on its own trigger to avoid immediate re-close
                const megaTrigger = megaMenuContainerRef.current.querySelector('a'); // Assuming first 'a' is the trigger
                if (megaTrigger && !megaTrigger.contains(event.target)) {
                    setActiveMegaMenu(null);
                }
            }
            // Close desktop services submenu
            if (servicesSubmenuContainerRef.current && !servicesSubmenuContainerRef.current.contains(event.target)) {
                const serviceTrigger = servicesSubmenuContainerRef.current.querySelector('a');
                if (serviceTrigger && !serviceTrigger.contains(event.target)) {
                    // Only close 'services' or 'layanan' if they are open
                    if (activeSubmenu === 'services' || activeSubmenu === 'layanan') {
                        setActiveSubmenu(null);
                    }
                }
            }
            // Close mobile menu
            if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                // Check if the click was on a mobile_menu_btn to let toggleMobileMenu handle it
                if (!event.target.closest('.mobile_menu_btn')) {
                    setIsMobileMenuOpen(false);
                    document.body.classList.remove('mobile-menu-active-lock-scroll');
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen, activeMegaMenu, activeSubmenu]); // Re-add listener if these states change


    // Data for menus
    const vehicleMenuItems = [
        { href: "/vehicle/venue", imgSrc: "/assets/images/cars/venue.webp", alt: "venue", title: "Venue" },
        { href: "/vehicle/new-creta", imgSrc: "/assets/images/cars/new-creta.webp", alt: "new creta", title: "New Creta" },
        { href: "/vehicle/ioniq5n", imgSrc: "/assets/images/cars/ioniq5n.webp", alt: "IONIQ 5 N", title: "IONIQ 5 N" },
        { href: "/vehicle/new-tucson", imgSrc: "/assets/images/cars/new-tucson.webp", alt: "new Tucson", title: "The New Tucson" },
        { href: "/vehicle/all-new-santa-fe", imgSrc: "/assets/images/cars/all-new-santa-fe.webp", alt: "All New Santa FE", title: "All New Santa FE" },
        { href: "/vehicle/all-new-kona-electric", imgSrc: "/assets/images/cars/all-new-kona.webp", alt: "All New Kona", title: "All New Kona Electric" },
        { href: "/vehicle/ioniq6", imgSrc: "/assets/images/cars/ioniq6.webp", alt: "ioniq6", title: "IONIQ 6" },
        { href: "/vehicle/stargazer", imgSrc: "/assets/images/cars/stargazer.webp", alt: "stargazer", title: "Stargazer" },
        { href: "/vehicle/creta", imgSrc: "/assets/images/cars/creta.webp", alt: "creta", title: "Creta" },
        { href: "/vehicle/staria", imgSrc: "/assets/images/cars/staria.webp", alt: "staria", title: "Staria" },
        { href: "/vehicle/palisade", imgSrc: "/assets/images/cars/palisade.webp", alt: "palisade", title: "Palisade" },
    ];

    const servicesLayananSubmenu = [
        { href: "/services/booking", title: "Booking Service" },
        { href: "/services/test-drive", title: "Test Drive" },
        { href: "/services/towing", title: "Towing" },
    ];

    // Effect for body scroll lock based on mobile menu state
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('mobile-menu-active-lock-scroll');
        } else {
            document.body.classList.remove('mobile-menu-active-lock-scroll');
        }
        // Cleanup function to remove class if component unmounts while menu is open
        return () => {
            document.body.classList.remove('mobile-menu-active-lock-scroll');
        };
    }, [isMobileMenuOpen]);


    return (
        <header className="header_section hyundai_header bg-black sticky_header clearfix main-site-header">
            <div className="header_content_wrap d-flex align-items-center">
                <div className="container-fluid prl_90"> {/* These classes need to be defined in your global CSS */}
                    <div className="row align-items-center">
                        <div className="col-lg-2 col-8"> {/* Adjusted col for logo on mobile */}
                            <div className="brand_logo">
                                <Logo />
                            </div>
                        </div>

                        <div className="col-lg-6 d-none d-lg-block"> {/* Desktop Main Menu */}
                            <nav className="main_menu clearfix">
                                <ul className="ul_li_center clearfix">
                                    <li className={`menu_item_has_child ${activeMegaMenu === 'vehicles' ? 'menu-open' : ''}`} ref={megaMenuContainerRef}>
                                        <a href="#!" onClick={(e) => handleDesktopMenuToggle('mega', 'vehicles', e)}>Vehicles</a>
                                        <div className="mega_menu text-center" style={{ display: activeMegaMenu === 'vehicles' ? 'block' : 'none' }}>
                                            <div className="background" style={{ backgroundColor: '#ffffff' }}>
                                                <div className="container">
                                                    <ul className="home_pages ul_li clearfix">
                                                        {vehicleMenuItems.map(item => (
                                                            <li key={item.title}>
                                                                <Link href={item.href} onClick={() => setActiveMegaMenu(null)}>
                                                                    <span className="item_image">
                                                                        <Image src={item.imgSrc} alt={item.alt} width={100} height={70} style={{ objectFit: "contain" }} />
                                                                    </span>
                                                                    <span className="item_title">{item.title}</span>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/price-list">Price List</Link>
                                    </li>
                                    <li>
                                        <Link href="/test-drive">Test Drive</Link>
                                    </li>
                                    <li><Link href="/news">News</Link></li>
                                </ul>
                            </nav>
                        </div>

                        <div className="col-lg-4 col-4"> {/* Adjusted col for mobile actions */}
                            <ul className="action_items ul_li_right clearfix">
                                <li className="d-lg-none"> {/* This button is only for mobile (lg and up hidden) */}
                                    <button type="button" className="mobile_menu_btn" onClick={toggleMobileMenu} aria-label="Toggle mobile menu" aria-expanded={isMobileMenuOpen}>
                                        {/* Using the second SVG from your HTML */}
                                        <svg width="34" height="18" viewBox="0 0 34 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path fillRule="evenodd" clipRule="evenodd" d="M28.8798 2.77594C31.1289 4.03763 33.675 6.2559 33.4094 9.2138C33.1018 11.9544 30.6087 13.8685 28.3813 15.0208C21.8789 18.2069 12.746 18.3057 6.03136 15.5213C3.76154 14.5528 1.21547 12.8901 0.260462 10.3883C-0.471039 8.3335 0.419934 6.19056 1.91526 4.76632C5.04494 1.85124 9.03298 0.850894 13.1387 0.274756C17.5933 -0.279812 22.282 0.209421 26.2707 1.6121C27.1616 1.94971 28.0422 2.31922 28.8798 2.77594ZM25.2098 2.68903C25.255 2.71373 25.3027 2.73401 25.3501 2.75414C25.4696 2.80486 25.5869 2.85468 25.655 2.97194C25.7238 3.12167 25.6258 3.22842 25.5353 3.32697C25.514 3.35023 25.493 3.37304 25.4748 3.39584C23.2794 5.15739 20.765 6.13648 18.1985 6.99491C17.9204 7.06444 17.6419 7.14582 17.3616 7.22769C16.3264 7.53011 15.2682 7.83926 14.1248 7.58292C13.7854 7.49571 13.4778 7.2675 13.2866 6.9302C12.9265 5.90797 13.4147 4.84228 13.8385 3.9501C14.4008 2.83065 15.3979 1.51394 16.777 1.49299C19.7469 1.47048 22.5476 1.92752 25.2098 2.68903ZM11.3241 2.33016L11.3668 2.16666C11.301 2.0419 11.1439 2.04444 11.0057 2.04667C10.9878 2.04696 10.9701 2.04725 10.9531 2.04725C9.53183 2.27545 8.18439 2.67809 6.89031 3.17827C4.70496 4.12453 2.0851 5.51689 1.43806 8.12624C1.03557 10.1272 2.43514 11.8131 3.98413 12.8569C4.06614 12.8945 4.14966 12.953 4.23451 13.0125C4.46767 13.1759 4.71082 13.3463 4.95987 13.107C6.69974 9.3551 8.53505 5.5816 11.3241 2.33016ZM29.8772 5.03798C31.1927 6.14711 32.3809 7.65889 31.9775 9.48577C31.3195 12.1826 28.4557 13.6181 26.1755 14.5313L26.1041 14.5557C24.8859 14.9727 23.6565 15.3935 22.3244 15.5213C22.3089 15.5193 22.2916 15.5184 22.2736 15.5175C22.1931 15.5133 22.0979 15.5083 22.0805 15.4013L22.1122 15.249C24.0432 13.0201 25.5071 10.5193 26.7902 7.98494C27.3848 6.84329 27.9364 5.66851 28.4453 4.51529C28.5194 4.4287 28.5935 4.38556 28.6789 4.35274C29.034 4.38532 29.313 4.60457 29.59 4.82219C29.685 4.89684 29.7797 4.9713 29.8772 5.03798ZM19.3547 14.0776C19.8898 13.0766 20.4465 12.035 20.2134 10.8015C20.0439 10.3445 19.5667 10.0075 19.0895 9.94249C17.9398 9.79084 16.853 10.1122 15.8295 10.4148L15.8113 10.4202C15.688 10.4625 15.5646 10.5048 15.4412 10.547C12.8052 11.4498 10.1585 12.3563 7.91941 14.2165C7.8133 14.3143 7.73921 14.4547 7.79226 14.6076C7.85599 14.7167 7.97277 14.792 8.08895 14.8251C10.6561 15.6188 13.4244 16.0656 16.2574 16.1087C17.5195 16.2387 18.5696 15.3688 19.2057 14.3578C19.2547 14.2647 19.3046 14.1713 19.3547 14.0776Z" fill="#002c5e"></path></g></svg>
                                    </button>
                                </li>
                                {/* Add other desktop action items here if any, e.g., search icon */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Sidebar - Conditionally rendered */}
            {isMobileMenuOpen && (
                <>
                    <div ref={mobileMenuRef} className="sidebar_mobile_menu menu_open"> {/* Ensure menu_open is always applied when rendered */}
                        <button type="button" className="close_btn" onClick={toggleMobileMenu} aria-label="Close mobile menu">
                            <i className="fal fa-times"></i>
                        </button>
                        <div className="msb_widget brand_logo mb-3 text-center"> {/* Added text-center */}
                            <Link href="/" onClick={toggleMobileMenu}>
                                <Logo /> {/* Your SVG logo */}
                            </Link>
                        </div>
                        <div className="msb_widget mobile_menu_list clearfix">
                            <h3 className="title_text mb_15 text-uppercase">
                                <i className="far fa-bars me-2"></i> Menu List
                            </h3>
                            <ul className="ul_li_block clearfix">
                                {/* Mobile Menu Items */}
                                <li><Link href="/vehicles" onClick={toggleMobileMenu}>Vehicles</Link></li>
                                <li><Link href="/price-list" onClick={toggleMobileMenu}>Price List</Link></li>
                                <li className={`menu_item_has_child ${activeSubmenu === 'mobile-services' ? 'menu-open' : ''}`}>
                                    <a href="#!" onClick={(e) => { e.preventDefault(); handleMobileSubmenuToggle('mobile-services', e); }}>
                                        Services <i className={`fas ${activeSubmenu === 'mobile-services' ? 'fa-chevron-up' : 'fa-chevron-down'} ms-1`}></i>
                                    </a>
                                    <ul className="submenu ul_li_block" style={{ display: activeSubmenu === 'mobile-services' ? 'block' : 'none' }}>
                                        {servicesLayananSubmenu.map(item => (
                                            <li key={item.title}><Link href={item.href} onClick={toggleMobileMenu}>{item.title}</Link></li>
                                        ))}
                                        <li><Link href="/call-center" onClick={toggleMobileMenu}>Call Center</Link></li>
                                        <li><Link href="/e-brochure" onClick={toggleMobileMenu}>e-Brochure</Link></li>
                                    </ul>
                                </li>
                                <li><Link href="/promo" onClick={toggleMobileMenu}>Promo</Link></li>
                                <li><Link href="/news" onClick={toggleMobileMenu}>News</Link></li>
                            </ul>
                        </div>
                        {/* If you have user info section for mobile menu from original HTML, add here */}
                    </div>
                    {/* Overlay for mobile menu */}
                    <div className="overlay mobile_menu_overlay" onClick={toggleMobileMenu}></div>
                </>
            )}

            {/* Search Body Collapse (its toggle needs separate state if you implement a search button) */}
            {/* <div id="search_body_collapse" className="search_body_collapse collapse"> ... </div> */}
        </header>
    );
}