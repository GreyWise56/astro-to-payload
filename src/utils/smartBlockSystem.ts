// src/utils/smartBlockSystem.ts
// 🧠 SMART BLOCK SYSTEM - Reduces 148 components to 20 logical blocks

export interface ComponentCategory {
  name: string
  components: string[]
  cards?: string[]  // Auto-included child components
  defaultComponent: string
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    name: 'Hero Section',
    defaultComponent: 'HeroV16',
    components: [
      'Hero',
      'Hero-v7', 
      'HeroV2',
      'HeroV5',
      'HeroV6', 
      'HeroV8',
      'HeroV10',
      'HeroV15',
      'HeroV16',
      'HeroV19',
      'HeroV20',
      'HeroSkewedMarquee'
    ]
  },
  {
    name: 'About Section',
    defaultComponent: 'AboutV16',
    components: [
      'AboutV10',
      'AboutV12', 
      'AboutV13',
      'AboutV16',
      'AboutV20',
      'AboutV6',
      'AboutWithLogo',
      'AboutWithStatsV8',
      'AboutDescriptionV5',
      'AboutMarqueeV2'
    ]
  },
  {
    name: 'Services Section', 
    defaultComponent: 'ServicesV16',
    components: [
      'Services-v7',
      'ServicesV10',
      'ServicesV15', 
      'ServicesV16',
      'ServicesV6',
      'ServicesAccordionV2',
      'ServicesAccordionV8',
      'ServicesGrid'
    ],
    cards: ['ServiceCard', 'ServiceAccordionItem']
  },
  {
    name: 'Blog Section',
    defaultComponent: 'BlogV16', 
    components: [
      'BlogV10',
      'BlogV16',
      'BlogV19',
      'BlogV5'
    ],
    cards: ['BlogCard']
  },
  {
    name: 'Portfolio Section',
    defaultComponent: 'PortfolioV5',
    components: [
      'PortfolioGrid',
      'PortfolioV5', 
      'ProjectsV10',
      'FeaturedProjectsV19',
      'FeaturedWorkV6'
    ]
  },
  {
    name: 'Testimonials Section',
    defaultComponent: 'TestimonialsV10',
    components: [
      'Testimonials',
      'Testimonials-v7',
      'TestimonialsV6',
      'TestimonialsV10', 
      'TestimonialsV19'
    ],
    cards: ['TestimonialCard', 'TestimonialCard-v7']
  },
  {
    name: 'Team Section',
    defaultComponent: 'TeamGridV2',
    components: [
      'TeamGridV2',
      'TeamV5',
      'TeamMemberDetail'
    ]
  },
  {
    name: 'FAQ Section',
    defaultComponent: 'FaqV2',
    components: [
      'Faq',
      'FaqV2'
    ],
    cards: ['FaqItem']
  },
  {
    name: 'Call to Action',
    defaultComponent: 'CtaV20',
    components: [
      'Cta',
      'CtaV2',
      'CtaV20',
      'CtaFormV6'
    ]
  },
  {
    name: 'Contact Section',
    defaultComponent: 'ContactForm-v7',
    components: [
      'ContactForm-v7'
    ]
  },
  {
    name: 'Pricing Section',
    defaultComponent: 'Pricing-v7',
    components: [
      'Pricing-v7',
      'PricingV19'
    ]
  },
  {
    name: 'Process Section',
    defaultComponent: 'ProcessV19',
    components: [
      'ProcessV19',
      'ProcessV6',
      'ProcessV8',
      'BrandingProcessV15'
    ]
  },
  {
    name: 'Logo Display',
    defaultComponent: 'LogoMarqueeV8',
    components: [
      'LogoGrid',
      'LogoMarqueeV8',
      'ClientsV2'
    ]
  },
  {
    name: 'Case Studies',
    defaultComponent: 'CaseStudiesV16',
    components: [
      'CaseStudiesV16'
    ]
  },
  {
    name: 'Awards Section',
    defaultComponent: 'AwardsV10',
    components: [
      'AwardsV10',
      'AwardVideoV5',
      'AchievementsV3'
    ]
  },
  {
    name: 'Video/Promo',
    defaultComponent: 'PromoVideoV2',
    components: [
      'PromoVideo',
      'PromoVideoV2'
    ]
  }
]

// 🎯 GENERATE PAYLOAD BLOCKS FROM CATEGORIES
export function generatePayloadBlocks() {
  return COMPONENT_CATEGORIES.map(category => ({
    slug: category.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    labels: {
      singular: category.name,
      plural: `${category.name}s`
    },
    fields: [
      // 🎨 COMPONENT VARIANT SELECTOR
      {
        name: 'variant',
        type: 'select',
        label: 'Design Variant',
        defaultValue: category.defaultComponent,
        options: category.components.map(comp => ({
          label: comp.replace(/([A-Z])/g, ' $1').trim(), // Convert CamelCase to readable
          value: comp
        })),
        admin: {
          description: `Choose which ${category.name} design to use`
        }
      },
      
      // 📝 CONTENT FIELDS
      {
        name: 'title',
        type: 'text',
        admin: {
          description: 'Section title/heading'
        }
      },
      {
        name: 'subtitle', 
        type: 'text',
        admin: {
          description: 'Section subtitle'
        }
      },
      {
        name: 'content',
        type: 'richText',
        admin: {
          description: 'Main content/description'
        }
      },
      
      // 🖼️ MEDIA FIELDS
      {
        name: 'primaryImage',
        type: 'upload',
        relationTo: 'media',
        admin: {
          description: 'Main image for this section'
        }
      },
      {
        name: 'backgroundImage',
        type: 'upload', 
        relationTo: 'media',
        admin: {
          description: 'Background image (if applicable)'
        }
      },
      
      // 🔗 BUTTON FIELDS
      {
        name: 'primaryButton',
        type: 'group',
        label: 'Primary Button',
        fields: [
          { name: 'text', type: 'text' },
          { name: 'url', type: 'text' },
          { 
            name: 'style', 
            type: 'select',
            defaultValue: 'primary',
            options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Secondary', value: 'secondary' },
              { label: 'Outline', value: 'outline' }
            ]
          }
        ]
      },
      {
        name: 'secondaryButton',
        type: 'group', 
        label: 'Secondary Button',
        fields: [
          { name: 'text', type: 'text' },
          { name: 'url', type: 'text' },
          { 
            name: 'style',
            type: 'select', 
            defaultValue: 'secondary',
            options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Secondary', value: 'secondary' }, 
              { label: 'Outline', value: 'outline' }
            ]
          }
        ]
      },
      
      // ⚙️ LAYOUT SETTINGS
      {
        name: 'settings',
        type: 'group',
        label: 'Section Settings',
        admin: { position: 'sidebar' },
        fields: [
          {
            name: 'layout',
            type: 'select',
            defaultValue: 'default',
            options: [
              { label: 'Default', value: 'default' },
              { label: 'Centered', value: 'centered' },
              { label: 'Full Width', value: 'full-width' },
              { label: 'Narrow', value: 'narrow' }
            ]
          },
          {
            name: 'spacing',
            type: 'select', 
            defaultValue: 'normal',
            options: [
              { label: 'Tight', value: 'tight' },
              { label: 'Normal', value: 'normal' },
              { label: 'Loose', value: 'loose' },
              { label: 'Extra Loose', value: 'extra-loose' }
            ]
          },
          {
            name: 'backgroundColor',
            type: 'select',
            defaultValue: 'none',
            options: [
              { label: 'None/Transparent', value: 'none' },
              { label: 'White', value: 'white' },
              { label: 'Light Gray', value: 'light-gray' },
              { label: 'Dark', value: 'dark' },
              { label: 'Brand Primary', value: 'brand-primary' },
              { label: 'Brand Secondary', value: 'brand-secondary' }
            ]
          }
        ]
      },
      
      // 🔧 COMPONENT-SPECIFIC DATA
      {
        name: 'componentData',
        type: 'json',
        admin: {
          description: 'Component-specific configuration (advanced)'
        }
      }
    ]
  }))
}

// 🎯 HELPER TO GET COMPONENT PATH
export function getComponentPath(categorySlug: string, variant: string): string {
  return `../components/blocks/${variant}.astro`
}

// 🚀 HELPER TO GET CARD COMPONENTS
export function getCardComponents(categorySlug: string): string[] {
  const category = COMPONENT_CATEGORIES.find(cat => 
    cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === categorySlug
  )
  return category?.cards || []
}