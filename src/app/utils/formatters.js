// app/price-list/utils.js
export const formatPrice = (price, currency = 'IDR') => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};