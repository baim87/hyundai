// app/price-list/components/PriceListFooter.js
export default function PriceListFooter() {
    return (
        <footer className="text-center mt-5 pt-4 border-top">
            <ul>
                <li>
                    Harga di atas berlaku untuk BBN wilayah Jakarta.
                </li>
                <li>
                    Harga BBN yang tertera hanya berlaku untuk kepemilikan kendaraan pertama (I).
                </li>
                <li>
                    Harga BBN tidak mengikat, apabila terjadi selisih BBN sepenuhnya menjadi beban Customer.
                </li>
                <li>
                    Daftar harga sewaktu-waktu dapat berubah.
                </li>

            </ul>
            <a href="/contact-dealer" className="btn btn-primary btn-lg mt-3"> {/* Ensure this link is valid for your static site */}
                Find a Dealer or Request a Quote
            </a>
            <p className="mt-3">
                <small>All information is illustrative. Features and specifications may vary by market.</small>
            </p>
        </footer>
    );
}