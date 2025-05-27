// src/app/vehicle/[slug]/page.js
import { notFound } from 'next/navigation';
import VehicleDetailContent from '@/components/VehicleDetail/VehicleDetail'; // Your Client Component
import vehicleDataJson from '@/data/vehicleData.json'; // Import the JSON data

// This function reads from the imported JSON. It's synchronous.
function getVehicleDataBySlug(slug) {
    return vehicleDataJson[slug] || null;
}

// Generates metadata for each page at build time or on demand for server rendering
export async function generateMetadata({ params }) {
    const vehicleSlug = params.slug;
    const pageData = getVehicleDataBySlug(vehicleSlug);

    if (!pageData) {
        return { title: "Vehicle Not Found" };
    }
    return {
        title: pageData.pageTitle,
        description: pageData.metaDescription,
        // Add other metadata as needed
    };
}

// This is the Server Component for the page.
// For SSG, this runs at build time for each path from generateStaticParams.
export default function VehiclePage({ params }) {
    const vehicleSlug = params.slug;
    const pageData = getVehicleDataBySlug(vehicleSlug);

    if (!pageData) {
        // This will trigger the not-found.js page during build or server render
        notFound();
    }

    // Pass the static data and slug to the client component
    return <VehicleDetailContent pageDataProps={pageData} vehicleSlug={vehicleSlug} />;
}

// Tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
    const slugs = Object.keys(vehicleDataJson); // ["ioniq-5", "tucson", ...]

    return slugs.map((slug) => ({
        slug: slug, // Each object must have a property matching the dynamic segment name
    }));
}