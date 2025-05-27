// app/price-list/PriceListClientPage.js
'use client';

import { useState, useMemo, useEffect } from 'react';
import allCarModelsData from '@/data/carModels.json';

// Component Imports
import PriceListHeader from '../Header/PriceListHeader';
import CarSearchInput from '../Search/CarSearchInput';
import CarTable from '../CarTable/CarTable';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import ModelImageFilter from '../ModelImageFilter/ModelImageFilter';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const getUniqueModelsForFilter = (carData) => {
    if (!carData) return [];
    const modelsMap = new Map();
    carData.forEach(car => {
        if (!modelsMap.has(car.model_name)) {
            modelsMap.set(car.model_name, {
                name: car.model_name,
                imageUrl: car.model_image_url || '/images/placeholder-car.png'
            });
        }
    });
    return Array.from(modelsMap.values());
};

export default function PriceListClientPage() {
    const [variantSearchTerm, setVariantSearchTerm] = useState(''); // Renamed for clarity
    const [selectedModel, setSelectedModel] = useState(null);
    const [hydrated, setHydrated] = useState(false);
    const [isMobileViewForLayout, setIsMobileViewForLayout] = useState(false); // For layout adjustments
    useEffect(() => {
        setHydrated(true);
        const checkMobile = () => setIsMobileViewForLayout(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const uniqueModels = useMemo(() => getUniqueModelsForFilter(allCarModelsData), []);

    const allVariantsWithModelInfo = useMemo(() => {
        // ... (same as before)
        if (!allCarModelsData) return [];
        return allCarModelsData.flatMap(model =>
            model.variants.map(variant => ({
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

        // 1. Filter by selected model from the sidebar (if any)
        if (selectedModel) {
            carsToDisplay = carsToDisplay.filter(car => car.modelName === selectedModel);
        }

        // 2. Filter by the main variantSearchTerm across multiple fields
        if (variantSearchTerm.trim()) {
            const lowerSearchTerm = variantSearchTerm.toLowerCase();
            carsToDisplay = carsToDisplay.filter(car => {
                const modelNameMatch = car.modelName.toLowerCase().includes(lowerSearchTerm);
                const variantNameMatch = car.variantName.toLowerCase().includes(lowerSearchTerm);
                const transmissionMatch = car.transmission.toLowerCase().includes(lowerSearchTerm);
                // Basic price search: converts price number to string.
                // This will match if "340" is typed for a price of 340,000,000.
                // For more complex price searching (e.g., "340jt", "340.000"), it's harder.
                const priceMatch = car.price.toString().includes(lowerSearchTerm.replace(/[^0-9]/g, '')); // Remove non-digits from search for price match

                return modelNameMatch || variantNameMatch || transmissionMatch || priceMatch;
            });
        }
        return carsToDisplay;
    }, [selectedModel, variantSearchTerm, allVariantsWithModelInfo]);

    const handleVariantSearchChange = (event) => { // Renamed for clarity
        setVariantSearchTerm(event.target.value);
    };

    const handleModelSelect = (modelName) => {
        setSelectedModel(prevModel => (prevModel === modelName ? null : modelName));
        setVariantSearchTerm(''); // Clear variant search when model changes
    };

    if (!hydrated) {
        return null;
    }

    return (
        <>
            <Header />
            <Container fluid className="mt-4 mb-5 price-list-page-container">
                {/* Mobile specific filter placement */}
                {isMobileViewForLayout && (
                    <Row>
                        <Col xs={12}>
                            <div className="sticky-top desktop-model-filter-sticky-wrapper">
                                <ModelImageFilter
                                    allModels={uniqueModels}
                                    selectedModel={selectedModel}
                                    onModelSelect={handleModelSelect}
                                />
                            </div>
                        </Col>
                    </Row>
                )}

                <Row>
                    {/* Desktop Sidebar Filter */}
                    {!isMobileViewForLayout && (
                        <Col md={4} lg={3} className=" mb-md-0 price-list-sidebar">
                            <div className="sticky-top desktop-model-filter-sticky-wrapper">
                                <ModelImageFilter
                                    allModels={uniqueModels}
                                    selectedModel={selectedModel}
                                    onModelSelect={handleModelSelect}
                                />
                            </div>
                        </Col>
                    )}

                    {/* Main Content: Search and Table */}
                    {/* Adjust column span based on whether sidebar is visible */}
                    <Col
                        xs={12} // Full width on mobile (since filter is separate or above)
                        md={isMobileViewForLayout ? 12 : 8}
                        lg={isMobileViewForLayout ? 12 : 9}
                    >
                        {/* THIS IS THE WRAPPER FOR THE CarSearchInput FOR VARIANTS */}
                        <div style={{ minWidth: '250px', maxWidth: '350px' }} className="w-100 w-md-auto">
                            <CarSearchInput
                                searchTerm={variantSearchTerm}
                                onSearchChange={handleVariantSearchChange}
                                placeholder={selectedModel ? `Search ${selectedModel} variants...` : "Search all variants..."}
                                className="mb-3" // No top margin on mobile if filter is above
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
                /* Desktop Sidebar Sticky Position */
                .price-list-sidebar .desktop-model-filter-sticky-wrapper {
                    /* === ADJUST THIS VALUE === */
                    top: calc(75px + 20px); /* e.g., top: calc(75px + 20px); which is top: 95px; */
                    /* The 20px is optional spacing below the header */
                    z-index: 800; /* Or a value just below your header's z-index */
                    max-height: calc(100vh - (20px + 40px)); /* Max height considering header and some padding */
                    overflow-y: auto; /* Allow internal scroll if model list is long */
                }
                /* Mobile Dropdown (if styles are also managed here, though better in its component) */
                .model-filter-mobile-dropdown.sticky-top {
                    top: 60px; /* << ADJUST THIS: Main Header Height */
                    z-index: 1020;
                }

                /* General improvement for better scrolling behavior with sticky elements */
                .price-list-page-container {
                margin-top: 5rem !important
                }
                `}</style>
        </>
    );
}