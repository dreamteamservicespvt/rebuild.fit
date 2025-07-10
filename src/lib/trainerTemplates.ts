import { TrainerProfile } from '@/lib/firebaseServices';

export type TrainerProfileTemplate = 'modern' | 'classic' | 'minimal' | 'athlete';

export interface TrainerTemplateConfig {
  id: TrainerProfileTemplate;
  name: string;
  description: string;
  preview: string;
  heroStyle: 'full-height' | 'compact' | 'split';
  galleryLayout: 'grid' | 'masonry' | 'carousel';
  bioLayout: 'centered' | 'sidebar' | 'tabs';
  colorScheme: 'default' | 'blue' | 'green' | 'purple';
  features: string[];
}

export const TRAINER_TEMPLATES: TrainerTemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design with bold typography and dynamic layouts',
    preview: '/templates/modern-preview.jpg',
    heroStyle: 'full-height',
    galleryLayout: 'grid',
    bioLayout: 'centered',
    colorScheme: 'default',
    features: ['Full-height hero', 'Grid gallery', 'Social media integration', 'Interactive stats']
  },
  {
    id: 'classic',
    name: 'Classic Trainer',
    description: 'Traditional, trustworthy design focusing on credentials and experience',
    preview: '/templates/classic-preview.jpg',
    heroStyle: 'compact',
    galleryLayout: 'carousel',
    bioLayout: 'sidebar',
    colorScheme: 'blue',
    features: ['Compact hero', 'Carousel gallery', 'Certification showcase', 'Timeline view']
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple, distraction-free design emphasizing content and readability',
    preview: '/templates/minimal-preview.jpg',
    heroStyle: 'split',
    galleryLayout: 'masonry',
    bioLayout: 'tabs',
    colorScheme: 'default',
    features: ['Split hero', 'Masonry gallery', 'Tabbed content', 'Typography focus']
  },
  {
    id: 'athlete',
    name: 'Athletic Performance',
    description: 'Dynamic, energetic design perfect for performance trainers and athletes',
    preview: '/templates/athlete-preview.jpg',
    heroStyle: 'full-height',
    galleryLayout: 'grid',
    bioLayout: 'centered',
    colorScheme: 'green',
    features: ['Action hero', 'Performance metrics', 'Video emphasis', 'Achievement highlights']
  }
];

export const getTemplateConfig = (templateId: TrainerProfileTemplate): TrainerTemplateConfig => {
  return TRAINER_TEMPLATES.find(t => t.id === templateId) || TRAINER_TEMPLATES[0];
};

export const applyTemplateToTrainer = (
  trainer: TrainerProfile, 
  templateId: TrainerProfileTemplate
): Partial<TrainerProfile> => {
  const template = getTemplateConfig(templateId);
  
  // Return updates that would be applied to the trainer profile
  // This could include layout preferences, styling options, etc.
  return {
    // Add template-specific metadata
    // In a real implementation, you might store template preferences
    // in a separate field or as part of the trainer profile
    ...trainer,
    // You could add a template field to the TrainerProfile interface
    // template: templateId,
    // templateConfig: template
  };
};

// Hook for template-based styling
export const useTemplateStyles = (templateId: TrainerProfileTemplate) => {
  const template = getTemplateConfig(templateId);
  
  const getHeroClasses = () => {
    switch (template.heroStyle) {
      case 'full-height':
        return 'min-h-screen flex items-center';
      case 'compact':
        return 'h-[60vh] flex items-center';
      case 'split':
        return 'min-h-[80vh] grid lg:grid-cols-2 items-center';
      default:
        return 'min-h-screen flex items-center';
    }
  };

  const getGalleryClasses = () => {
    switch (template.galleryLayout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6';
      case 'carousel':
        return 'flex overflow-x-auto space-x-6 pb-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  const getBioClasses = () => {
    switch (template.bioLayout) {
      case 'centered':
        return 'max-w-4xl mx-auto text-center';
      case 'sidebar':
        return 'grid lg:grid-cols-3 gap-12';
      case 'tabs':
        return 'max-w-6xl mx-auto';
      default:
        return 'max-w-4xl mx-auto text-center';
    }
  };

  const getColorScheme = () => {
    switch (template.colorScheme) {
      case 'blue':
        return {
          primary: 'bg-blue-600',
          primaryHover: 'hover:bg-blue-700',
          accent: 'text-blue-400',
          gradient: 'from-blue-600 to-blue-800'
        };
      case 'green':
        return {
          primary: 'bg-green-600',
          primaryHover: 'hover:bg-green-700',
          accent: 'text-green-400',
          gradient: 'from-green-600 to-green-800'
        };
      case 'purple':
        return {
          primary: 'bg-purple-600',
          primaryHover: 'hover:bg-purple-700',
          accent: 'text-purple-400',
          gradient: 'from-purple-600 to-purple-800'
        };
      default:
        return {
          primary: 'bg-rebuild-yellow',
          primaryHover: 'hover:bg-yellow-400',
          accent: 'text-rebuild-yellow',
          gradient: 'from-rebuild-yellow to-yellow-600'
        };
    }
  };

  return {
    template,
    heroClasses: getHeroClasses(),
    galleryClasses: getGalleryClasses(),
    bioClasses: getBioClasses(),
    colorScheme: getColorScheme()
  };
};
