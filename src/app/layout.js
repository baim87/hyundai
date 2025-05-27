// src/app/layout.js (Simplified Example)
import Script from 'next/script';

import './styles/style.css'; // Your primary custom global styles (e.g., your old style.css renamed or new)
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/animate.css';
import './styles/nice-select.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles/magnific-popup.css';

export const metadata = {
  title: 'Hyundai - New Way, New Possibilities',
  description: 'Hyundai vehicle lineup and information.',
  icons: { // For favicon
    icon: 'https://hyundaimobil.co.id/assets/favicon/apple-icon-180x180.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Links to CSS in public (Alternative to direct import) */}
      </head>
      <body className="home_hyundai" suppressHydrationWarning={true}>
        <div id="thetop"></div> {/* Back to top placeholder */}
        {/* BackToTop component would go here */}

        {/* Header component would go here */}
        {children} {/* This is where page.js content will be injected */}
        {/* Footer component would go here */}

        {/* Global JS - Load carefully, aim to replace functionality */}
        <Script src="/assets/js/jquery-3.5.1.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/popper.min.js" strategy="afterInteractive" /> {/* Popper after jQuery */}
        <Script src="/assets/js/bootstrap.min.js" strategy="afterInteractive" /> {/* Bootstrap JS after Popper */}
        <Script src="/assets/js/mCustomScrollbar.js" strategy="lazyOnload" />
        {/* Google Maps - Requires careful handling, consider a React wrapper */}
        {/* <Script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&ver=2.1.6" strategy="lazyOnload" /> */}
        {/* <Script src="/assets/js/gmaps.min.js" strategy="lazyOnload" /> */}
        <Script src="/assets/js/parallaxie.js" strategy="lazyOnload" />
        <Script src="/assets/js/wow.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/nice-select.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/slick.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/countdown.js" strategy="lazyOnload" />
        <Script src="/assets/js/magnific-popup.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/isotope.pkgd.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/masonry.pkgd.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/imagesloaded.pkgd.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/jquery-ui.js" strategy="lazyOnload" />
        <Script src="/assets/js/custom.js" strategy="lazyOnload" /> {/* Your custom jQuery */}
      </body>
    </html>
  );
}