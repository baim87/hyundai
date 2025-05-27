// app/price-list/components/CarTable.js
'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from "@/app/utils/formatters"; // Ensure this path is correct

export default function CarTable({ cars, searchTerm, selectedModel }) {
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkMobileView = () => {
            // Bootstrap's sm breakpoint is 576px, md is 768px.
            // Let's switch to mobile table layout below 'md' for this example.
            setIsMobileView(window.innerWidth < 768);
        };
        checkMobileView(); // Initial check
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    const handleRequestInfo = (car) => {
        const message = encodeURIComponent(`Halo Hyundai, saya minta penawaran untuk ${car.modelName} ${car.variantName} ${car.transmission}`);
        const whatsappLink = `https://wa.me/6281914438888?text=${message}`;
        window.open(whatsappLink, '_blank');
    };

    if (!cars || cars.length === 0) {
        return (
            <div className="text-center p-4 border rounded bg-light mt-3">
                <h5 className="text-muted mb-1">No Results</h5>
                <p className="mb-0 text-muted small">
                    No variants found
                    {selectedModel ? ` for ${selectedModel}` : ''}
                    {searchTerm ? ` matching "${searchTerm}"` : ''}.
                    {!searchTerm && !selectedModel && ' Please try your search or select a model.'}
                    {!searchTerm && selectedModel && ' Please try a different search term for this model.'}
                </p>
            </div>
        );
    }

    // --- Mobile Table View ---
    if (isMobileView) {
        return (
            <div className="mobile-car-table-list mt-3">
                {cars.map((car, index) => (
                    <div key={`mobile-${car.modelName}-${car.variantName}-${index}`} className="card mb-3 mobile-car-card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 className="card-title mb-1"><strong>{car.modelName}</strong> {car.variantName}</h6>
                                    <p className="card-text small text-muted mb-1">
                                        {car.transmission} - {formatPrice(car.price, car.currency)}
                                    </p>
                                    {car.modelOptions && car.modelOptions.length > 0 && (
                                        <ul className="list-unstyled mb-0 small text-muted">
                                            {car.modelOptions.map((option, optIdx) => (
                                                <li key={`opt-mob-${optIdx}`}>
                                                    <small>• {option.description}: +{formatPrice(option.additional_price, option.currency)}</small>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleRequestInfo(car)}
                                    className="btn btn-success btn-sm ms-2 p-2 mobile-wa-button"
                                    title="Request Info via WhatsApp"
                                    style={{ lineHeight: 1 }} // Helps vertically align icon if it's slightly off
                                >
                                    <i className="fab fa-whatsapp fa-lg"></i> {/* Font Awesome Icon */}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <style jsx global>{`
                    .mobile-car-card .card-title {
                        font-size: 0.95rem;
                    }
                    .mobile-wa-button {
                        /* flex-shrink: 0; /* Prevent button from shrinking too much */
                        /* You can adjust padding or size of the button/icon if needed */
                    }
                `}</style>
            </div>
        );
    }

    // --- Desktop Table View ---
    return (
        <div className="car-table-scroll-wrapper shadow-sm rounded mt-3">
            <table className="table table-striped table-hover table-bordered mb-0 car-table-fixed-header">
                <thead className="thead-dark table-header-sticky">
                    <tr>
                        <th scope="col" className="sticky-th">Model</th>
                        <th scope="col" className="sticky-th">Variant</th>
                        <th scope="col" className="sticky-th">Transmission</th>
                        <th scope="col" className="sticky-th text-end">Base Price (OTR)</th>
                        <th scope="col" className="sticky-th">Available Options</th>
                        <th scope="col" className="sticky-th text-center">Info</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car, index) => (
                        <tr key={`desktop-${car.modelName}-${car.variantName}-${index}-${car.price}`}>
                            <td><strong>{car.modelName}</strong></td>
                            <td>{car.variantName}</td>
                            <td>{car.transmission}</td>
                            <td className="text-end">{formatPrice(car.price, car.currency)}</td>
                            <td>
                                {car.modelOptions && car.modelOptions.length > 0 ? (
                                    <ul className="list-unstyled mb-0 ps-3">
                                        {car.modelOptions.map((option, optIdx) => (
                                            <li key={`opt-desk-${optIdx}`} className="small">
                                                <span className="text-success me-1">•</span>
                                                {option.description}: +{formatPrice(option.additional_price, option.currency)}
                                                {option.applies_to_text && (
                                                    <em className="d-block text-muted">
                                                        ({option.applies_to_text})
                                                    </em>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-muted small"><em>-</em></span>
                                )}
                            </td>
                            <td> {/* New Cell */}
                                <button
                                    onClick={() => handleRequestInfo(car)}
                                    className="btn btn-sm btn-success" // Bootstrap button styling
                                    title="Request Info via WhatsApp"
                                >
                                    <i className="fab fa-whatsapp"></i> {/* Font Awesome Icon */}
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx global>{`
                .car-table-scroll-wrapper {
                    max-height: 70vh; 
                    overflow-y: auto;  
                    position: relative; 
                }
                .car-table-fixed-header {
                    width: 100%;
                }
                .table-header-sticky th.sticky-th {
                    position: -webkit-sticky; 
                    position: sticky;
                    top: 0; 
                    z-index: 2; 
                    background-color: #212529; 
                    color: white;
                }
                .table-header-sticky th.sticky-th::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: inherit; 
                    z-index: -1; 
                }
                .table-bordered .table-header-sticky th.sticky-th {
                    border-bottom-width: 1px; 
                }
                .table-header-sticky th.sticky-th.text-end {
                    text-align: right !important; 
                }
                .table-header-sticky th.sticky-th.text-center {
                    text-align: center !important;
                }
            `}</style>
        </div >
    );
}