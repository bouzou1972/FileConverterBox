import { useEffect } from "react";

interface ToolSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export function ToolSEO({ title, description, keywords = [], canonicalUrl }: ToolSEOProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} - File Converter Box | Free Online Tools`;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = [...keywords, 'file converter', 'online tools', 'free tools', 'privacy-focused'].join(', ');

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: `${title} - File Converter Box` },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'File Converter Box' },
      { property: 'og:image', content: '/favicon-192x192.png' }
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: `${title} - File Converter Box` },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: '/favicon-192x192.png' }
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": title,
      "description": description,
      "applicationCategory": "Utility",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "File Converter Box"
      }
    };

    let jsonLd = document.querySelector('#tool-structured-data') as HTMLScriptElement;
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.id = 'tool-structured-data';
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, canonicalUrl]);

  return null;
}