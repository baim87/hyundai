// app/booking-service/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
// Assuming these components are correctly implemented and don't throw errors themselves
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import allCarModelsData from '@/data/carModels.json'; // CRITICAL: Path and JSON validity
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

// formatDate is defined but not used in this version of the code if we "forget the date"
// and also if bookingDate is the only date field and we don't show its formatted version yet.
// However, it's used in handleSubmit.
const formatDate = (date) => {
    if (!date) return ''; // Handles empty date string
    // Check if 'date' is a valid date string or already a Date object
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) { // Check if date is invalid
        console.error("Invalid date passed to formatDate:", date);
        return 'Invalid Date';
    }
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString('id-ID', options);
};

const STEPS = {
    SELECT_MODEL: 1,
    SELECT_VARIANT: 2,
    FILL_FORM: 3,
    // CONFIRMATION: 4, // Not actively used in step progression logic
};

const initialFormData = {
    model: '',
    variant: '',
    transmission: '',
    fullName: '',
    email: '',
    whatsapp: '',
    location: 'Dealer', // Default was Rumah in previous, now Dealer. Not a breaking change.
    bookingDate: '', // This is present. If you meant "forget the time", this is fine.
    // If you meant "forget date and time", this should be removed.
    // For now, I will assume "forget the time selection field" but keep bookingDate.
};

export default function BookingServicePage() {
    console.log("BookingServicePage component rendering/re-rendering"); // DEBUG

    const [currentStep, setCurrentStep] = useState(STEPS.SELECT_MODEL);
    const [formData, setFormData] = useState(initialFormData);
    const [availableVariants, setAvailableVariants] = useState([]);

    useEffect(() => {
        console.log("EFFECT: formData updated to:", formData);
    }, [formData]);

    useEffect(() => {
        console.log("EFFECT: currentStep updated to:", currentStep);
    }, [currentStep]);

    const uniqueModels = useMemo(() => {
        console.log("Calculating uniqueModels..."); // DEBUG
        if (!allCarModelsData || !Array.isArray(allCarModelsData)) {
            console.error("! uniqueModels: allCarModelsData is invalid!", allCarModelsData);
            return [];
        }
        const modelNames = new Set();
        allCarModelsData.forEach(car => {
            if (car && typeof car.model_name === 'string') {
                modelNames.add(car.model_name);
            }
        });
        console.log("uniqueModels calculated:", Array.from(modelNames)); // DEBUG
        return Array.from(modelNames);
    }, []); // Correct: depends only on static import

    const handleNextStep = () => {
        console.log("handleNextStep called. Current step:", currentStep, "formData.model:", formData.model, "formData.variant:", formData.variant); // DEBUG
        if (currentStep === STEPS.SELECT_MODEL && !formData.model) {
            console.log("Validation fail: Model not selected."); // DEBUG
            Swal.fire('Oops...', 'Please select a car model.', 'error');
            return;
        }
        if (currentStep === STEPS.SELECT_VARIANT && !formData.variant) {
            console.log("Validation fail: Variant not selected."); // DEBUG
            Swal.fire('Oops...', 'Please select a variant.', 'error');
            return;
        }
        console.log("Proceeding to next step."); // DEBUG
        setCurrentStep((prev) => prev + 1);
    };

    const handlePrevStep = () => {
        console.log("handlePrevStep called."); // DEBUG
        setCurrentStep((prev) => prev - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`handleInputChange: name=${name}, value=${value}`); // DEBUG
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModelSelect = (e) => {
        const selectedModelName = e.target.value;
        console.log("handleModelSelect: Selected model from event:", selectedModelName); // DEBUG
        setFormData(prevData => { // Using prevData in updater to be safe, though initialFormData is static
            const newState = {
                ...initialFormData, // Reset other fields
                model: selectedModelName,
            };
            console.log("handleModelSelect: New formData state to be set:", newState); // DEBUG
            return newState;
        });

        const modelData = allCarModelsData.find(m => m.model_name === selectedModelName);
        const variants = modelData && Array.isArray(modelData.variants) ? modelData.variants : [];
        setAvailableVariants(variants);
        console.log("handleModelSelect: Available variants set to:", variants); // DEBUG

        // setCurrentStep(STEPS.SELECT_MODEL); // This line is NOT the issue. It correctly keeps you on step 1
        // to allow changing the model before hitting "Next".
        // The button's disabled state depends on formData.model.
    };

    const handleVariantSelect = (e) => {
        const selectedVariantName = e.target.value;
        console.log("handleVariantSelect: Selected variant:", selectedVariantName); // DEBUG
        const selectedVariantData = availableVariants.find(v => v.variant_name === selectedVariantName);
        setFormData((prev) => {
            const newState = {
                ...prev,
                variant: selectedVariantName,
                transmission: selectedVariantData && selectedVariantData.transmission ? selectedVariantData.transmission : '',
            };
            console.log("handleVariantSelect: New formData state to be set:", newState); // DEBUG
            return newState;
        });
        // setCurrentStep(STEPS.SELECT_VARIANT); // Correctly keeps you on step 2.
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handleSubmit called. formData:", formData); // DEBUG
        // If `bookingDate` is truly meant to be forgotten, this validation needs an update.
        // For now, assuming it's still required as per initialFormData.
        if (!formData.fullName || !formData.email || !formData.whatsapp || !formData.bookingDate) {
            Swal.fire('Incomplete Form', 'Please fill out all required fields.', 'warning');
            return;
        }

        Swal.fire({
            title: 'Important Information',
            html: `
                <div style="text-align: left;">
                    <p>Proses booking test drive hanya tersedia pada hari Senin-Sabtu pada jam 09.00-14.00 WIB.</p>
                    <p>Hari Minggu atau hari libur nasional proses booking tidak tersedia.</p>
                    <p>Pelaksanaan test drive akan dilakukan pada H+2 (hari kerja) setelah proses booking.</p>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Understood, Proceed',
            showCancelButton: true,
            cancelButtonText: 'Cancel Booking',
        }).then((result) => {
            if (result.isConfirmed) {
                const messageParts = [
                    `Halo Hyundai, saya minta jadwal test drive untuk:`,
                    `Model: ${formData.model}`,
                    `Variant: ${formData.variant}`,
                    `Transmission: ${formData.transmission}`,
                    `Nama: ${formData.fullName}`,
                    `Email: ${formData.email}`,
                    `No. WhatsApp: ${formData.whatsapp}`,
                    `Lokasi Test Drive: ${formData.location}`,
                    // If bookingDate is forgotten, this line will cause issues or show "Invalid Date".
                    `Tanggal Booking: ${formatDate(formData.bookingDate)}`,
                ];
                const message = encodeURIComponent(messageParts.join('\n'));
                const whatsappLink = `https://wa.me/6281914438888?text=${message}`;
                window.open(whatsappLink, '_blank');
                Swal.fire('Booking Processed!', 'Your test drive request has been initiated via WhatsApp.', 'success');
                setFormData(initialFormData);
                setCurrentStep(STEPS.SELECT_MODEL);
            }
        });
    };

    const progress = useMemo(() => {
        return ((currentStep - 1) / (STEPS.FILL_FORM)) * 100;
    }, [currentStep]);

    // DEBUG: Log formData and currentStep whenever they change to see updates.
    useEffect(() => {
        console.log("EFFECT: formData updated to:", formData);
    }, [formData]);

    useEffect(() => {
        console.log("EFFECT: currentStep updated to:", currentStep);
    }, [currentStep]);


    const renderStepContent = () => {
        console.log("renderStepContent called for step:", currentStep); // DEBUG
        switch (currentStep) {
            case STEPS.SELECT_MODEL:
                if (uniqueModels.length === 0) {
                    console.warn("renderStepContent (SELECT_MODEL): uniqueModels is empty!"); // DEBUG
                }
                return (
                    <Form.Group controlId="modelSelect" className="mb-4">
                        <Form.Label className="text-white fs-5 mb-2">1. Select Car Model</Form.Label>
                        <Form.Select name="model" value={formData.model} onChange={handleModelSelect} required>
                            <option value="">-- Choose Model --</option>
                            {uniqueModels.map((modelName) => (
                                <option key={modelName} value={modelName}>{modelName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                );
            case STEPS.SELECT_VARIANT:
                if (availableVariants.length === 0 && formData.model) {
                    console.warn(`renderStepContent (SELECT_VARIANT): availableVariants is empty for model ${formData.model}!`); // DEBUG
                }
                return (
                    <Form.Group controlId="variantSelect" className="mb-4">
                        <Form.Label className="text-white fs-5 mb-2">2. Select Variant for {formData.model}</Form.Label>
                        <Form.Select name="variant" value={formData.variant} onChange={handleVariantSelect} required
                            disabled={!formData.model || availableVariants.length === 0} // Disable if no model or no variants for model
                        >
                            <option value="">-- Choose Variant --</option>
                            {availableVariants.map((variant) => (
                                <option key={variant.variant_name} value={variant.variant_name}>
                                    {variant.variant_name} (Transmission: {variant.transmission || 'N/A'})
                                </option>
                            ))}
                        </Form.Select>
                        {!formData.model && <Form.Text className="text-warning">Please select a model first.</Form.Text>}
                        {formData.model && availableVariants.length === 0 && <Form.Text className="text-warning">No variants available for the selected model.</Form.Text>}
                    </Form.Group>
                );
            case STEPS.FILL_FORM:
                return (
                    <>
                        <h3 className="mb-4 text-white">3. Your Information</h3>
                        <p className="text-white mb-3">Booking for: <strong>{formData.model} - {formData.variant} ({formData.transmission})</strong></p>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="fullName">
                                    <Form.Label className='text-white'>Nama Lengkap</Form.Label>
                                    <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className='text-white'>Email</Form.Label>
                                    <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="whatsapp">
                                    <Form.Label className='text-white'>No. WhatsApp</Form.Label>
                                    <Form.Control type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} required placeholder="e.g., 08123456789" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="location">
                                    <Form.Label className='text-white'>Lokasi Test Drive</Form.Label>
                                    <Form.Select name="location" value={formData.location} onChange={handleInputChange}>
                                        <option value="Rumah">Rumah</option>
                                        <option value="Dealer">Dealer</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* If "forget the date" means remove date input, comment out/remove this Form.Group */}
                        <Form.Group className="mb-3" controlId="bookingDate">
                            <Form.Label className='text-white'>Tanggal Booking Test Drive</Form.Label>
                            <Form.Control type="date" name="bookingDate" value={formData.bookingDate} onChange={handleInputChange} required />
                            {/* Displaying formatted date can cause issues if formData.bookingDate is not a valid date string for new Date() */}
                            {formData.bookingDate && <Form.Text className="text-white">Selected: {formatDate(formData.bookingDate)}</Form.Text>}
                        </Form.Group>
                    </>
                );
            default:
                console.error("renderStepContent: Reached default case! currentStep:", currentStep); // DEBUG
                return <p className="text-danger">Error: Invalid step.</p>; // Show an error
        }
    };

    return (
        <>
            <div className="d-flex flex-column min-vh-100 booking-service-page">
                <Header />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <Container className="py-5" style={{ maxHeight: '90vh' }}>
                        <Row className="justify-content-center">
                            <Col md={8} lg={7}>
                                <Card className="shadow-lg bg-blur">
                                    <Card.Header className="bg-primary text-white text-center"> {/* Corrected: Added -primary */}
                                        <h2 className="mb-0 text-white">Book a Test Drive</h2>
                                    </Card.Header>
                                    <Card.Body className="p-4 p-md-5">
                                        <div className="mb-4">
                                            <ProgressBar now={progress} label={`${Math.round(progress)}%`} animated variant="success" />
                                            <div className="d-flex justify-content-between small mt-1 text-muted">
                                                <span className='text-white'>Select Model</span>
                                                <span className='text-white'>Select Variant</span>
                                                <span className='text-white'>Your Info</span>
                                            </div>
                                        </div>
                                        <Form onSubmit={handleSubmit}>
                                            {renderStepContent()}
                                            <div className="d-flex justify-content-between mt-5">
                                                {currentStep > STEPS.SELECT_MODEL && (
                                                    <Button variant="outline-secondary" onClick={handlePrevStep} className="px-4">
                                                        Previous
                                                    </Button>
                                                )}
                                                {/* This div ensures the Next/Book Now button aligns to the right when Previous is not shown */}
                                                {currentStep === STEPS.SELECT_MODEL && <div></div>}

                                                {currentStep < STEPS.FILL_FORM && (
                                                    <Button
                                                        variant="primary"
                                                        onClick={handleNextStep}
                                                        className="px-4"
                                                        disabled={
                                                            (currentStep === STEPS.SELECT_MODEL && !formData.model) ||
                                                            (currentStep === STEPS.SELECT_VARIANT && !formData.variant)
                                                        }
                                                    >
                                                        Next
                                                    </Button>
                                                )}
                                                {currentStep === STEPS.FILL_FORM && (
                                                    <Button variant="success" type="submit" className="px-5">
                                                        Book Now
                                                    </Button>
                                                )}
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Footer />
                <style jsx global>{`
                    /* ... Your existing styles ... */
                    .booking-service-page {
                        background-image: url('https://hyundaimobil.co.id/vehicle/assets/images/all-new-santafe/turbo-hybrid-technology.jpg');
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        position: relative;
                    }
                    .booking-service-page::before {
                        content: "";
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background-color: rgba(0, 0, 0, 0.4);
                        z-index: 0;
                    }
                    .booking-service-page > * {
                        position: relative;
                        z-index: 1;
                    }
                    .bg-blur {
                        background-color: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(4px);
                        border-radius: 10px;
                    }
                    .card-header.bg-primary { /* Ensures this specific selector is targeted */
                        background-color: #002C5E !important;
                    }
                    .progress-bar.bg-success { background-color: #00438e !important; }
                    .btn-primary { background-color: #002C5E !important; border-color: #002C5E !important; }
                    .btn-primary:hover { background-color: #001f45 !important; border-color: #001a38 !important; }
                `}</style>
            </div>
        </>
    );
}