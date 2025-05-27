// app/ModelFilter/ModelImageFilter.js
'use client';
import { useState, useMemo, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

export default function ModelImageFilter({
    allModels,
    selectedModel,
    onModelSelect,
}) {
    const [modelSearchTerm, setModelSearchTerm] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    const filteredDisplayModels = useMemo(() => {
        if (!allModels) return [];
        if (isMobileView) {
            return allModels; // For dropdown, show all models
        }
        // Desktop card filtering
        if (!modelSearchTerm.trim()) {
            return allModels;
        }
        const lowerSearchTerm = modelSearchTerm.toLowerCase();
        return allModels.filter(model =>
            model.name.toLowerCase().includes(lowerSearchTerm)
        );
    }, [allModels, modelSearchTerm, isMobileView]);

    if (!allModels || allModels.length === 0) {
        return <p className="p-2 text-muted">No models available.</p>;
    }

    // --- Dropdown for Mobile ---
    if (isMobileView) {
        return (
            <div className="model-filter-mobile-dropdown bg-light p-2 mb-3 shadow-sm">
                <Dropdown className="d-grid">
                    <Dropdown.Toggle variant="outline-primary" id="dropdown-model-filter" className="w-100 text-truncate">
                        {selectedModel ? `Model: ${selectedModel}` : 'Select Car Model'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100 model-filter-dropdown-menu">
                        <Dropdown.Item onClick={() => onModelSelect(null)} active={!selectedModel}>
                            All Models
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        {allModels.map((model) => (
                            <Dropdown.Item key={model.name} onClick={() => onModelSelect(model.name)} active={selectedModel === model.name}>
                                {model.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <style jsx>{`
                    .model-filter-dropdown-menu {
                        max-height: calc(100vh - (var(--main-header-height, 75px) + 80px));
                        overflow-y: auto;
                    }
                `}</style>
            </div>
        );
    }

    // --- Cards for Desktop ---
    return (
        // THIS IS THE ROOT of the desktop filter component.
        // It uses flex to position its children.
        // Its height is determined by its parent in PriceListClientPage.js
        <div className="model-filter-desktop-pane">

            {/* Part 1: Fixed Search and "All Models" Button (IMAGE 1) */}
            {/* This div does NOT scroll. It's the first item in the flex column. */}
            <div className="model-filter-fixed-controls">
                <Form.Group className="mb-3">
                    <Form.Control
                        type="search"
                        placeholder="Search models..."
                        value={modelSearchTerm}
                        onChange={(e) => setModelSearchTerm(e.target.value)}
                        aria-label="Search car models"
                    />
                </Form.Group>
                <Button
                    variant={!selectedModel ? 'primary' : 'outline-secondary'}
                    onClick={() => onModelSelect(null)}
                    className={`w-100 mb-2 fw-bold ${!selectedModel ? 'btn-custom-primary-all-models' : 'btn-outline-secondary'}`}
                >
                    All Models
                </Button>
            </div>

            {/* Part 2: Scrollable list of Model Cards (IMAGE 2) */}
            {/* This div IS SCROLLABLE. It's the second item and grows. */}
            <div className="model-filter-scrollable-cards">
                {filteredDisplayModels.length > 0 ? (
                    filteredDisplayModels.map((model) => (
                        <Card
                            key={model.name}
                            className={`mb-2 model-filter-item ${selectedModel === model.name ? 'active-model' : ''}`}
                            onClick={() => onModelSelect(model.name)}
                        >
                            <Card.Img variant="top" src={model.imageUrl} alt={model.name} className="model-filter-image" />
                            <Card.Body className="text-center p-2 model-filter-body">
                                <Card.Title as="h6" className="mb-0 model-filter-name">{model.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted text-center mt-2">No models match &quot;{modelSearchTerm}&quot;.</p>
                )}
            </div>

            {/* Styles are CRUCIAL here */}
            <style jsx>{`
                .model-filter-desktop-pane {
                    display: flex;
                    flex-direction: column;
                    height: 100%; /* This component will try to fill the height given by its parent container. */
                    /* If the parent container doesn't have a set height or max-height that causes overflow,
                       then the internal scroll won't trigger effectively. */
                }

                .model-filter-fixed-controls {
                    /* This part is fixed at the top of this component */
                    
                    background-color: #fff; /* Ensure it has a background */
                    border-bottom: 1px solid #eee; /* Visual separator */
                    flex-shrink: 0; /* IMPORTANT: Prevents this part from shrinking */
                }

                .model-filter-scrollable-cards {
                    flex-grow: 1; /* IMPORTANT: Makes this div take up all available remaining vertical space */
                    overflow-y: auto; /* IMPORTANT: MAKES THIS DIV SCROLLABLE */
                    padding: 1rem; /* Padding inside the scrollable area */
                }

                /* Card item styles */
                .model-filter-item { cursor: pointer; transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; border: 1px solid #dee2e6; }
                .model-filter-item:hover { transform: translateY(-3px); box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1)!important; border-color: #0d6efd; }
                .model-filter-item.active-model { border: 2px solid #0d6efd; box-shadow: 0 0.5rem 1.5rem rgba(13,110,253,0.25)!important; transform: translateY(-2px); }
                .model-filter-item.active-model .model-filter-name { font-weight: bold; color: #0d6efd; }
                .model-filter-image { height: 100px; object-fit: contain; padding: 5px; background-color: #f8f9fa; }
                .model-filter-body { background-color: #fff; }
                .model-filter-name { font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .btn-custom-primary-all-models {
        background-color: #002C5E !important; /* Your desired background color */
        border-color: #002C5E !important;     /* Match border color */
        color: #fff !important;               /* Text color, usually white for dark backgrounds */
    }

    /* Optional: Hover and active states for the custom button */
    .btn-custom-primary-all-models:hover {
        background-color: #001f45 !important; /* A slightly darker shade for hover */
        border-color: #001f45 !important;
        color: #fff !important;
    }

    .btn-custom-primary-all-models:active,
    .btn-custom-primary-all-models:focus {
        background-color: #001f45 !important;
        border-color: #001a38 !important; /* Even darker for active/focus */
        color: #fff !important;
        box-shadow: 0 0 0 0.25rem rgba(0, 44, 94, 0.5) !important; /* Focus shadow, adjust color */
    }

    /* Ensure outline-secondary still looks as expected if it's the alternative */
    .btn-outline-secondary {
        /* Default Bootstrap outline-secondary styles should apply,
           but you can override if needed */
    }
            `}</style>
        </div>
    );
}