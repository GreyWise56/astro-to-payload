// src/lib/payload-api.ts - Complete API Integration (Official Docs Style)

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000/api';

// Get a single page by slug (following official docs pattern)
export async function getPageBySlug(slug: string) {
  const res = await fetch(`${PAYLOAD_API_URL}/pages?where[slug][equals]=${slug}&depth=2`);
  const data = await res.json();
  return data.docs[0] || null;
}

// Get all pages (for static generation)
export async function getAllPages() {
  const res = await fetch(`${PAYLOAD_API_URL}/pages?limit=100`);
  const data = await res.json();
  return data.docs;
}

// Get page slugs for static generation
export async function getPageSlugs() {
  const res = await fetch(`${PAYLOAD_API_URL}/pages?select[slug]=true&limit=100`);
  const data = await res.json();
  return data.docs.map((page: any) => page.slug).filter(Boolean);
}

// Get global settings
export async function getSiteSettings() {
  const res = await fetch(`${PAYLOAD_API_URL}/globals/site-settings`);
  return await res.json();
}

export async function getCompanyInfo() {
  const res = await fetch(`${PAYLOAD_API_URL}/globals/company-info`);
  return await res.json();
}

export async function getSEOSettings() {
  const res = await fetch(`${PAYLOAD_API_URL}/globals/seo-settings`);
  return await res.json();
}

// Get all globals at once
export async function getAllGlobals() {
  try {
    const [siteSettings, companyInfo, seoSettings] = await Promise.all([
      getSiteSettings(),
      getCompanyInfo(), 
      getSEOSettings(),
    ]);

    return {
      siteSettings,
      companyInfo,
      seoSettings,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch globals';
    console.error('Error fetching globals:', errorMessage);
    return {
      siteSettings: null,
      companyInfo: null,
      seoSettings: null,
    };
  }
}

// Get blog posts
export async function getBlogPosts(limit = 6) {
  const res = await fetch(`${PAYLOAD_API_URL}/blog?limit=${limit}&depth=1`);
  const data = await res.json();
  return data.docs;
}

// Get media by ID
export async function getMediaById(id: string) {
  const res = await fetch(`${PAYLOAD_API_URL}/media/${id}`);
  return await res.json();
}

// Test connection to Payload
export async function testConnection() {
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/pages?limit=1`);
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Connection failed';
    return { success: false, error: errorMessage };
  }
}

// Block data processor for BlogV16
export async function processBlogV16Block(block: any) {
  // Process the posts array to get full media data
  if (block.posts && Array.isArray(block.posts)) {
    const processedPosts = await Promise.all(
      block.posts.map(async (post: any) => {
        // If image is just an ID, fetch the full media object
        if (typeof post.image === 'string') {
          try {
            const mediaData = await getMediaById(post.image);
            return {
              ...post,
              image: mediaData.url || mediaData.filename,
              altText: mediaData.alt || post.title,
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch media';
            console.warn(`Failed to fetch media for post ${post.title}:`, errorMessage);
            return {
              ...post,
              image: '/placeholder-image.jpg',
              altText: post.title,
            };
          }
        }
        
        // If image is already an object with url
        if (post.image && typeof post.image === 'object') {
          return {
            ...post,
            image: post.image.url || post.image.filename,
            altText: post.image.alt || post.title,
          };
        }

        return post;
      })
    );

    return {
      ...block,
      posts: processedPosts,
    };
  }

  return block;
}