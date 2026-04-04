import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, image, url }) {
  const siteName = "D VEG WOK - Premium Veg Dining";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "Experience the best Premium Vegetarian cuisines including Indian, Chinese, and Pav Bhaji at D VEG WOK in Nalasopara East.";
  const defaultImage = "https://images.unsplash.com/photo-1555126634-ae3c1ac348a0?w=1200&h=630&fit=crop";

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || "vegetarian restaurant, nalasopara east food, indian veg food, chinese veg, pav bhaji, premium dining, d veg wok"} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://dvegwok.com"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || "https://dvegwok.com"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
}
