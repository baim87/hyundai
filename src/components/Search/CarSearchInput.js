// app/price-list/components/CarSearchInput.js
'use client'; // If it has its own internal state for the input value, or just takes props

export default function CarSearchInput({ searchTerm, onSearchChange, placeholder }) {
    return (
        <div className="row mb-3">
            <div className="col-md-12">
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder || "Cari berdasarkan model, variasi, atau transmisi..."}
                    value={searchTerm}
                    onChange={onSearchChange}
                    aria-label="Search car models"
                />
            </div>
        </div>
    );
}