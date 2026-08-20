import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSiteContent } from '@/lib/contentStore';
import { SiteContentProvider } from '@/context/SiteContentContext';

// Force dynamic rendering to prevent prerender context collisions during cloud builds
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const company = content?.company || {
    name: 'GLX Industries (Pvt) Ltd',
    tagline: "Sri Lanka's Premier Commercial Vehicle Body Builders",
  };

  return {
    title: {
      default: `${company.name} | Commercial Vehicle Body Builders Sri Lanka`,
      template: `%s | ${company.name}`,
    },
    description:
      'Premier commercial vehicle body fabrication in Sri Lanka. Three-wheelers, Tata Dimo Batta, Mahindra Maxximo, 10.5ft & 14.5ft lorry bodies, freezer boxes, and instant PDF quotations.',
    keywords: [
      'Lorry body builders Sri Lanka',
      'Dimo batta body price Sri Lanka',
      'Three wheel canopy GLX',
      'Commercial vehicle fabrication Ja-Ela',
      'Freezer box manufacture Sri Lanka',
      '10.5 ft lorry body',
      '14.5 ft lorry body',
      'GLX Truck Body Engineers',
      'Instant lorry quotation PDF',
    ],
    authors: [{ name: 'GLX Industries (Pvt) Ltd' }],
    creator: 'GLX Industries',
    publisher: 'GLX Industries',
    metadataBase: new URL('https://glxindustries.lk'),
    openGraph: {
      title: `${company.name} — Commercial Vehicle Body Builders`,
      description:
        'Engineered for strength and built for the road. Instant PDF quotation download with GLX SMS Gateway notification.',
      url: 'https://glxindustries.lk',
      siteName: company.name,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'GLX Industries Commercial Vehicle Bodies',
        },
      ],
      locale: 'en_LK',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialContent = await getSiteContent();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoBodyShop',
    name: 'GLX Industries (Pvt) Ltd - GLX Truck Body Engineers',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    telephone: '+94772268608',
    email: 'info@glxindustries.lk',
    url: 'https://glxindustries.lk',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'No.2020/3L, 2, Seeduwa Road, Kotugoda',
        addressLocality: 'Ja-Ela',
        addressRegion: 'Western Province',
        postalCode: '11350',
        addressCountry: 'LK',
      },
    ],
    priceRange: 'LKR 95,000 - 1,500,000',
    openingHours: 'Mo-Sa 08:00-18:00',
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <SiteContentProvider initialContent={initialContent}>
          {children}
        </SiteContentProvider>
      </body>
    </html>
  );
}
