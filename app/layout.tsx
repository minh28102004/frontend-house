import './globals.css';
import { Suspense } from 'react';
import QueryProvider from '@/modules/admin/common/providers/QueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { CartModalProvider } from '@/context/CartModalContext';
import { TrafficPageViewReporter } from '@/common/components/TrafficPageViewReporter';
import AppToaster from '@/common/components/ui/toast/AppToaster';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Another House",
  description: "Another House - Creative boutique homestay với các phòng concept độc đáo: Romantic, Sky, Cinema, Nature, Minimal. Đặt phòng ngay!",
  keywords: "homestay, boutique homestay, booking homestay, phong nguyen, phong concept, phong dep, dao tau, romantic, cinema, nature, minimal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/img/logo.png" sizes="any" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Outfit:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        {/* Google Tag Manager */}
        <Script
          id="gtm-base"
          strategy="afterInteractive"
        >{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NJBDFSFB');
        `}</Script>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-NQTLJ2DQ24"></Script>
        <Script id="gtag-base">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NQTLJ2DQ24');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NJBDFSFB"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Đang tải...</div>}>
          <QueryProvider>
            <AuthProvider>
<LanguageProvider>
                  <CartProvider>
                    <CartModalProvider>
                      <TrafficPageViewReporter />
                      <AppToaster />
                      {children}
                    </CartModalProvider>
                  </CartProvider>
                </LanguageProvider>
            </AuthProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
