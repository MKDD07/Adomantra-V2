/**
 * news_config.js
 * Bridge between NewsAPI and Adomantra's Blog Engine.
 */

const NEWS_API_KEY = '3fab9a4b03304a9dac59945e86b88186';
const NEWS_CACHE_KEY = 'adomantra_news_cache';

// ─────────────────────────────────────────────
// PEXELS IMAGE FETCHER
// Fetches 3 relevant images per article from Pexels
// ─────────────────────────────────────────────
const PEXELS_API_KEY = 'y6WP5reQNH7abdL2uzdLTyV8pq0kMmF3CHf7ZNkiHo98DXIvORUOBSfi'; 

async function fetchPexelsImages(query, count = 3) {
    try {
        let safeQuery = encodeURIComponent(query.split(' ').slice(0, 3).join(' ')); 
        let res = await fetch(`https://api.pexels.com/v1/search?query=${safeQuery}&per_page=${count}&orientation=landscape`, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        let data = await res.json();
        
        // If no results for specific title, try a generic brand-aligned search
        if (!data.photos || data.photos.length === 0) {
            safeQuery = encodeURIComponent("digital advertising");
            res = await fetch(`https://api.pexels.com/v1/search?query=${safeQuery}&per_page=${count}&orientation=landscape`, {
                headers: { Authorization: PEXELS_API_KEY }
            });
            data = await res.json();
        }

        if (data.photos && data.photos.length > 0) {
            return data.photos.map(p => ({
                src: p.src.large,
                alt: p.alt || query,
                photographer: p.photographer
            }));
        }
    } catch (e) {
        console.warn('[Pexels] Image fetch failed:', e);
    }
    // Fallback: return placeholder images
    return Array.from({ length: count }, (_, i) => ({
        src: `assets/imgs/inner/blog-details/blog-details1_1.jpg`,
        alt: query,
        photographer: ''
    }));
}

// ─────────────────────────────────────────────
// GALLERY LAYOUT GENERATOR
// Randomly picks one of 3 layouts for the 3 images
// Layout A: 2 side-by-side (col-6) + 1 full-width below
// Layout B: 3 equal columns (col-4)
// Layout C: 1 large left (col-8) + 1 stacked right (col-4)
// ─────────────────────────────────────────────
function buildGalleryHTML(images, layoutSeed) {
    const layout = layoutSeed % 3; // 0, 1, or 2

    const img = (image, extraClass = '') =>
        `<div class="image parallax-view ${extraClass}">
            <img src="${image.src}" alt="${image.alt}" data-speed="0.8">
        </div>`;

    if (layout === 0) {
        // Layout A: col-6 + col-6 | full-width
        return `
        <div class="gallery-wrapper">
            <div class="row g-3 mb-3">
                <div class="col-6">${img(images[0])}</div>
                <div class="col-6">${img(images[1])}</div>
            </div>
            <div class="row">
                <div class="col-12">${img(images[2])}</div>
            </div>
        </div>`;
    } else if (layout === 1) {
        // Layout B: 3 equal columns col-4 each
        return `
        <div class="gallery-wrapper">
            <div class="row g-3">
                <div class="col-4">${img(images[0])}</div>
                <div class="col-4">${img(images[1])}</div>
                <div class="col-4">${img(images[2])}</div>
            </div>
        </div>`;
    } else {
        // Layout C: col-8 large left + col-4 two stacked right
        return `
        <div class="gallery-wrapper">
            <div class="row g-3">
                <div class="col-8">${img(images[0])}</div>
                <div class="col-4 d-flex flex-column gap-3">
                    ${img(images[1])}
                    ${img(images[2])}
                </div>
            </div>
        </div>`;
    }
}

/**
 * Fetches dynamic news and transforms it into the premium blog structure.
 */
async function fetchAdomantraNews() {
    // 1. Check Cache
    const cached = sessionStorage.getItem(NEWS_CACHE_KEY);
    if (cached) {
        return JSON.parse(cached);
    }

    try {
        // We query for 'digital marketing' or 'adtech' to stay on brand
        const response = await fetch(`https://newsapi.org/v2/everything?q=digital%20marketing%20OR%20adtech%20OR%20programmatic%20advertising%20OR%20performance%20marketing%20OR%20SEO%20OR%20influencer%20marketing&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();

        if (data.status !== 'ok') throw new Error(data.message);

        // Fetch all Pexels image sets in parallel (one per article)
        const imageRequests = data.articles.map(article => {
            const imageQuery = article.title.split(' ').slice(0, 4).join(' ');
            return fetchPexelsImages(imageQuery, 3);
        });
        const allImages = await Promise.all(imageRequests);

        // Transform NewsAPI articles to Adomantra's Blog Schema
        const blogs = data.articles.map((article, index) => {
            const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // Text Completion & Editorial Logic
            // Strip NewsAPI truncation marker e.g. " [+1234 chars]" and use
            // description as fallback so the text always reads complete.
            let rawContent = (article.content || article.description || "Detailed insights arriving soon.")
                .replace(/\s*\[\+\d+\s*chars?\]/gi, '')   // remove "[+N chars]"
                .replace(/\s*\[…\]/gi, '')                  // remove "[…]"
                .trim();

            // If content is still too short after stripping, prefer description
            if (rawContent.length < 50) {
                rawContent = article.description || rawContent;
            }

            // Ensure the text ends with proper punctuation
            if (rawContent && !/[.!?]$/.test(rawContent)) {
                rawContent = rawContent + '.';
            }

            // Simple Topic-Based Synthesis to "Make Text Complete"
            let editorialExpansion = "";
            const lowerTitle = article.title.toLowerCase();
            if (lowerTitle.includes('ai') || lowerTitle.includes('intelligence') || lowerTitle.includes('tech')) {
                editorialExpansion = " The rapid integration of these advanced technologies marks a pivotal shift in operational efficiency. As organizations pivot toward algorithmic governance, the balance between human creativity and technical automation becomes the primary differentiator for market leaders.";
            } else if (lowerTitle.includes('marketing') || lowerTitle.includes('brand') || lowerTitle.includes('social')) {
                editorialExpansion = " In an era of fragmented attention scales, the ability to maintain cohesive brand narratives across multi-touchpoint ecosystems is critical. Success now hinges on emotional resonance and consistent community engagement rather than simple reach metrics.";
            } else {
                editorialExpansion = " These developments underscore a broader trend toward data transparency and strategic agility. Businesses that leverage these insights to refine their user experience profiles will likely see the highest retention and competitive advantage in the coming year.";
            }

            const completeText = rawContent + editorialExpansion;

            // 3 Pexels images for this article
            const articleImages = allImages[index];

            // Hero image = first Pexels image (replaces pexels-hero)
            // Thumb image = second Pexels image (replaces pexels-thumb)
            // Gallery = all 3 images with random layout (replaces gallery-wrapper)
            const galleryHTML = buildGalleryHTML(articleImages, index);

            return {
                id: index + 1,
                slug: slug,
                author: article.author || article.source.name || "Adomantra News",
                category: article.source.name || "Industry Insights",
                year: new Date(article.publishedAt).getFullYear() || "2026",
                title: article.title,
                images: {
                    hero: articleImages[0],      // Full-width hero banner
                    thumb: articleImages[1],     // Thumb inside thumb-text-wrapper
                    gallery: articleImages,      // All 3 for the gallery section
                    galleryHTML: galleryHTML     // Pre-built HTML for direct injection
                },
                seo: {
                    title: article.title,
                    description: article.description || completeText.substring(0, 160) + "...",
                    tags: ["Live Feed", "Market Analysis", "2026 Strategy"]
                },
                content: {
                    introduction: (article.description || rawContent).substring(0, 300) + (article.description && article.description.length > 300 ? "..." : " This report delves into the underlying mechanics of this shift and its implications for the global marketing landscape."),
                    sections: [
                        {
                            title: "Strategic Overview",
                            text: completeText,
                            thumb_wrapper: {
                                text_one: "Analyzing market signals in real-time allows for unprecedented strategic pivots.",
                                text_two: "The data suggests a transition from reactive measures to proactive, technology-first frameworks."
                            }
                        },
                        {
                            title: "Industry Trajectory",
                            text: "The current trajectory indicates that these changes are not merely transactional but foundational. Market participants must align their infrastructure with these emerging standards to ensure long-term scalability and security.",
                            feature_list: [
                                "Alignment with emerging industry standards",
                                "Optimization of digital touchpoints for high engagement",
                                "Integration of ethical data governance frameworks",
                                "Scalable delivery of personalized user experiences",
                                "Mitigation of risk through predictive analysis"
                            ]
                        },
                        {
                            title: "Consultant Insight",
                            text: "From a consulting perspective, the primary challenge remains the execution of these strategies at scale. However, the potential for ROI in the current climate makes this a high-priority initiative for any forward-looking brand.",
                            closing_text: `Comprehensive details and real-time data sets are available through the primary publisher. <a href="${article.url}" target="_blank" style="color:var(--primary); text-decoration:underline;">View Complete Original Source</a>`
                        }
                    ],
                    faqs: [
                        {
                            question: "What is the immediate takeaway for stakeholders?",
                            answer: "The focus should be on agility and the audit of current technical workflows to accommodate these new developments effectively."
                        },
                        {
                            question: "How frequently are these insights updated?",
                            answer: "Our engine synchronizes with global news feeds hourly to provide the most current context possible."
                        }
                    ]
                },
                url: article.url
            };
        });

        const finalData = { blogs };
        sessionStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(finalData));
        return finalData;

    } catch (err) {
        console.error('NewsAPI fetch error:', err);
        return { blogs: [] };
    }
}