import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

export function SEOHead({
  title = 'Requin & Asociados | Premium Financial Architecture',
  description = 'Impulsamos el crecimiento de tu empresa o patrimonio con estructura, eficiencia y menor carga tributaria. Expertos en Arquitectura Financiera de Élite.',
  url = 'https://www.requinspa.com',
  image = 'https://www.requinspa.com/og-image.jpg'
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector);

      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    });

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    let schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Requin & Asociados",
      "description": description,
      "url": url,
      "logo": "https://www.requinspa.com/Logo-Requin-V2.png",
      "image": image,
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CL",
        "addressLocality": "Chile"
      },
      "sameAs": [
        "https://www.linkedin.com/company/requin-asociados"
      ]
    });
  }, [title, description, url, image]);

  return null;
}
