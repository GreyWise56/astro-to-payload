// src/utils/payload.ts
// 🔗 Simple Payload API Client - Connect to your JAM CMS

export interface PayloadPage {
  id: string
  title: string
  slug: string
  pageBlocks?: PayloadBlock[]
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

export interface PayloadBlock {
  blockType: string
  id: string
  componentName?: string
  title?: string
  subtitle?: string
  content?: string
  description?: string
  heading?: string
  subheading?: string
  image?: {
    id: string
    filename: string
    url: string
    alt?: string
    width?: number
    height?: number
  }
  primaryButton?: {
    text?: string
    url?: string
  }
  button?: {
    text?: string
    url?: string
  }
  customData?: Record<string, any>
  [key: string]: any // Allow any additional properties
}

class PayloadAPI {
  private baseUrl: string

  constructor() {
    // Your Payload CMS is running on localhost:3000
    this.baseUrl = 'http://localhost:3000'
  }

  // 🚀 GET SINGLE PAGE BY SLUG
  async getPageBySlug(slug: string): Promise<PayloadPage | null> {
    try {
      console.log(`🔍 Fetching page: ${slug}`)
      
      const response = await fetch(
        `${this.baseUrl}/api/pages?where[slug][equals]=${slug}&limit=1&depth=2`
      )
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`)
        return null
      }
      
      const data = await response.json()
      console.log(`✅ Found page:`, data.docs[0]?.title || 'No page found')
      
      return data.docs[0] || null
    } catch (error) {
      console.error(`❌ Failed to fetch page "${slug}":`, error)
      return null
    }
  }

  // 🚀 GET ALL PAGES (for static generation)
  async getAllPages(): Promise<PayloadPage[]> {
    try {
      console.log('🔍 Fetching all pages...')
      
      const response = await fetch(`${this.baseUrl}/api/pages?limit=1000&depth=1`)
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`)
        return []
      }
      
      const data = await response.json()
      console.log(`✅ Found ${data.docs.length} pages`)
      
      return data.docs
    } catch (error) {
      console.error('❌ Failed to fetch pages:', error)
      return []
    }
  }

  // 🧱 GET ALL COMPONENTS (for reference)
  async getAllComponents() {
    try {
      const response = await fetch(`${this.baseUrl}/api/components?limit=200`)
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`)
        return []
      }
      
      const data = await response.json()
      console.log(`✅ Found ${data.docs.length} components`)
      
      return data.docs
    } catch (error) {
      console.error('❌ Failed to fetch components:', error)
      return []
    }
  }

  // 🎯 TEST CONNECTION
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔌 Testing Payload connection...')
      
      const response = await fetch(`${this.baseUrl}/api/access`)
      
      if (response.ok) {
        console.log('✅ Payload connection successful!')
        return true
      } else {
        console.log('❌ Payload connection failed - is your CMS running?')
        return false
      }
    } catch (error) {
      console.log('❌ Cannot connect to Payload CMS - is it running on localhost:3000?')
      return false
    }
  }
}

// 🎯 SINGLETON INSTANCE
export const payloadAPI = new PayloadAPI()

// 🚀 HELPER FUNCTIONS FOR ASTRO PAGES
export async function getStaticPaths() {
  try {
    const pages = await payloadAPI.getAllPages()
    
    return pages.map(page => ({
      params: { 
        slug: page.slug === 'home' ? undefined : page.slug 
      },
      props: { page }
    }))
  } catch (error) {
    console.error('Failed to generate static paths:', error)
    return []
  }
}

export async function getPageData(slug: string = 'home') {
  try {
    // Test connection first
    const isConnected = await payloadAPI.testConnection()
    if (!isConnected) {
      console.log('🚨 Payload CMS not connected - using fallback data')
      return null
    }

    const page = await payloadAPI.getPageBySlug(slug)
    
    if (!page) {
      console.log(`❌ Page "${slug}" not found`)
      return null
    }

    console.log(`✅ Page data loaded:`, {
      title: page.title,
      blocks: page.pageBlocks?.length || 0
    })
    
    return { page }
  } catch (error) {
    console.error(`❌ Failed to get page data for "${slug}":`, error)
    return null
  }
}