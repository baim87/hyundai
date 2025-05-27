// app/price-list/PriceListClientPage.js
'use client';

import { useState, useMemo, useEffect } from 'react';
import allCarModelsData from '@/data/carModels.json';

// Component Imports
// import PriceListHeader from '../Header/PriceListHeader'; // Assuming not used for now
import CarSearchInput from '../Search/CarSearchInput';
import CarTable from '../CarTable/CarTable';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import ModelImageFilter from '../ModelImageFilter/ModelImageFilter'; // Your ModelImageFilter

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// This basePath will be '' for local dev and '/hyundai' (or your repo name) for production
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const getUniqueModelsForFilter = (carData) => {
    if (!carData || !Array.isArray(carData)) { // Added Array.isArray check
        console.error("getUniqueModelsForFilter: carData is invalid", carData);
        return [];
    }
    const modelsMap = new Map();
    carData.forEach(car => {
        if (car && typeof car.model_name === 'string' && !modelsMap.has(car.model_name)) {
            // Prepend basePath to imageUrl here
            let imageUrlWithBasePath = car.model_image_url || '/images/placeholder-car.png'; // Default placeholder
            if (imageUrlWithBasePath.startsWith('/')) { // Only prepend if it's an absolute path
                imageUrlWithBasePath = `${basePath}${imageUrlWithBasePath}`;
            }

            modelsMap.set(car.model_name, {
                name: car.model_name,
                imageUrl: imageUrlWithBasePath // Use the potentially prefixed URL
            });
        }
    });
    return Array.from(modelsMap.values());
};

export default function PriceListClientPage() {
    const [variantSearchTerm, setVariantSearchTerm] = useState('');
    const [selectedModel, setSelectedModel] = useState(null);
    const [hydrated, setHydrated] = useState(false);
    const [isMobileViewForLayout, setIsMobileViewForLayout] = useState(false);

    useEffect(() => {
        setHydrated(true);
        const checkMobile = () => setIsMobileViewForLayout(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // uniqueModels will now have imageUrls prefixed with basePath if applicable
    const uniqueModels = useMemo(() => getUniqueModelsForFilter(allCarModelsData), []);
    // Note: If allCarModelsData itself could change, add it to dependency array, but it's an import.

    const allVariantsWithModelInfo = useMemo(() => {
        if (!allCarModelsData || !Array.isArray(allCarModelsData)) return [];
        return allCarModelsData.flatMap(model =>
            (model.variants || []).map(variant => ({ // Added fallback for model.variants
                modelName: model.model_name,
                variantName: variant.variant_name,
                transmission: variant.transmission,
                price: variant.price,
                currency: variant.currency,
                modelOptions: model.model_options || [],
            }))
        );
    }, []);

    const filteredCarVariants = useMemo(() => {
        let carsToDisplay = allVariantsWithModelInfo;
        if (selectedModel) {
            carsToDisplay = carsToDisplay.filter(car => car.modelName === selectedModel);
        }
        if (variantSearchTerm.trim()) {
            const lowerSearchTerm = variantSearchTerm.toLowerCase();
            carsToDisplay = carsToDisplay.filter(car => {
                const modelNameMatch = car.modelName?.toLowerCase().includes(lowerSearchTerm) || false;
                const variantNameMatch = car.variantName?.toLowerCase().includes(lowerSearchTerm) || false;
                const transmissionMatch = car.transmission?.toLowerCase().includes(lowerSearchTerm) || false;
                const numericSearchTerm = lowerSearchTerm.replace(/[^0-9]/g, '');
                const priceMatch = numericSearchTerm && car.price ? car.price.toString().includes(numericSearchTerm) : false;
                return modelNameMatch || variantNameMatch || transmissionMatch || priceMatch;
            });
        }
        return carsToDisplay;
    }, [selectedModel, variantSearchTerm, allVariantsWithModelInfo]);

    const handleVariantSearchChange = (event) => {
        setVariantSearchTerm(event.target.value);
    };

    const handleModelSelect = (modelName) => {
        setSelectedModel(prevModel => (prevModel === modelName ? null : modelName));
        setVariantSearchTerm('');
    };

    if (!hydrated) {
        return null; // Or a loading skeleton
    }

    return (
        <>
            <Header />
            <Container fluid className="mt-4 mb-5 price-list-page-container">
                {/* Mobile specific filter placement */}
                {isMobileViewForLayout && (
                    <Row>
                        <Col xs={12} className="mobile-filter-container sticky-top">
                            {/* ModelImageFilter receives models with already prefixed imageUrls */}
                            <ModelImageFilter
                                allModels={uniqueModels}
                                selectedModel={selectedModel}
                                onModelSelect={handleModelSelect}
                            />
                        </Col>
                    </Row>
                )}

                <Row>
                    {/* Desktop Sidebar Filter */}
                    {!isMobileViewForLayout && (
                        <Col md={4} lg={3} className="mb-4 mb-md-0 price-list-sidebar">
                            <div className="sticky-top desktop-sidebar-sticky-wrapper">
                                {/* ModelImageFilter receives models with already prefixed imageUrls */}
                                <ModelImageFilter
                                    allModels={uniqueModels}
                                    selectedModel={selectedModel}
                                    onModelSelect={handleModelSelect}
                                />
                            </div>
                        </Col>
                    )}

                    {/* Main Content: Search and Table */}
                    <Col
                        xs={12}
                        md={isMobileViewForLayout ? 12 : 8}
                        lg={isMobileViewForLayout ? 12 : 9}
                        className={isMobileViewForLayout ? 'pt-3' : ''} // Add padding top if mobile filter is above
                    >
                        <h4 className="mb-3">
                            {selectedModel ? `Variants for: ${selectedModel}` : "All Models & Variants"}
                        </h4>
                        <div style={{ maxWidth: '400px' }} className="mb-3"> {/* Wrapper for search input */}
                            <CarSearchInput
                                searchTerm={variantSearchTerm}
                                onSearchChange={handleVariantSearchChange}
                                placeholder={selectedModel ? `Search ${selectedModel} variants...` : "Search all variants..."}
                            />
                        </div>
                        <CarTable
                            cars={filteredCarVariants}
                            searchTerm={variantSearchTerm}
                            selectedModel={selectedModel}
                        />
                    </Col>
                </Row>
            </Container>
            <Footer />
            <style jsx global>{`
                /* Define --main-header-height in a global CSS file or ensure it's set if used */
                /* For example, in your app/globals.css or layout's style */
                /* :root { --main-header-height: 75px; } */

                .price-list-page-container {
                  margin-top: calc(var(--main-header-height, 75px) + 1rem) !important; /* Default 75px if var not set */
                }

                .mobile-filter-container.sticky-top {
                    top: var(--main-header-height, 75px); /* Default 75px */
                    z-index: 1020;
                    /* Background for the sticky mobile filter container is handled inside ModelImageFilter */
                }

                .desktop-sidebar-sticky-wrapper {
                    top: calc(var(--main-header-height, 75px) + 20px); /* Default 75px + 20px space */
                    z-index: 1010;
                    max-height: calc(100vh - (var(--main-header-height, 75px) + 40px)); /* Max height calculation */
                    display: flex;
                    flex-direction: column;
                    background-color: #fff; 
                    border: 1px solid #eee;
                    border-radius: .25rem;
                    overflow: hidden; /* Parent wrapper does not scroll; ModelImageFilter handles internal scroll */
                }
                /* ModelImageFilter (as per your last correct version) will handle its own
                   internal fixed "Select Model" h5, search, button, and then scrollable cards */
            `}</style>
        </>
    );
}