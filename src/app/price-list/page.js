// app/price-list/page.js (This is now a Server Component)

import PriceListClientPage from "@/components/Pages/PriceListClientPage";

// SEO Metadata is defined HERE in the Server Component
export const metadata = {
    title: 'Hyundai Car Price List Indonesia | Latest Model Prices',
    description: 'View the official Hyundai car price list for Indonesia. Compare prices for Venue, CRETA, IONIQ 5, TUCSON, SANTA FE, and more. Find the best deals on new Hyundai cars.',
    keywords: 'Hyundai price list, car prices Indonesia, Hyundai OTR prices, Venue price, CRETA price, IONIQ 5 price, TUCSON price, SANTA FE price, Kona Electric price, Stargazer price, Palisade price',
};

export default function PriceListPage() {
    // This Server Component now just renders the Client Component
    return <PriceListClientPage />;
}