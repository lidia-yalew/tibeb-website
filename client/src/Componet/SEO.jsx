// src/Components/SEO.jsx
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = "website",
  author = "Tibeb Consultancy & Training PLC"
}) {
  const siteTitle = "Tibeb Consultancy";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription = description || "Expert consulting, training, and project management services in Ethiopia.";
  const siteImage = image || "https://www.tibeb.com/og-image.jpg";
  const siteUrl = url || "https://www.tibeb.com";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
    </Helmet>
  );
}