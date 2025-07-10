import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, Eye, Check, Layout, Grid, Users, Star, 
  Monitor, Smartphone, Image, Video, Type, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  TRAINER_TEMPLATES, 
  TrainerProfileTemplate, 
  TrainerTemplateConfig,
  useTemplateStyles 
} from '@/lib/trainerTemplates';

interface TemplateOption {
  id: TrainerProfileTemplate;
  config: TrainerTemplateConfig;
  selected: boolean;
}

interface TrainerTemplateSelectorProps {
  currentTemplate?: TrainerProfileTemplate;
  onTemplateSelect: (templateId: TrainerProfileTemplate) => void;
  disabled?: boolean;
}

const TrainerTemplateSelector: React.FC<TrainerTemplateSelectorProps> = ({
  currentTemplate = 'modern',
  onTemplateSelect,
  disabled = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TrainerProfileTemplate>(currentTemplate);
  const [previewTemplate, setPreviewTemplate] = useState<TrainerProfileTemplate | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const templates: TemplateOption[] = TRAINER_TEMPLATES.map(template => ({
    id: template.id,
    config: template,
    selected: template.id === selectedTemplate
  }));

  const handleTemplateSelect = (templateId: TrainerProfileTemplate) => {
    setSelectedTemplate(templateId);
    onTemplateSelect(templateId);
  };

  const TemplatePreview: React.FC<{ template: TrainerTemplateConfig }> = ({ template }) => {
    const { heroClasses, galleryClasses, colorScheme } = useTemplateStyles(template.id);
    
    return (
      <div className="w-full h-48 bg-gray-900 rounded-lg overflow-hidden relative">
        {/* Mock preview based on template config */}
        <div className={cn("relative h-full", template.heroStyle === 'split' ? 'grid grid-cols-2' : 'flex flex-col')}>
          {/* Hero preview */}
          <div className={cn(
            "flex-1 relative",
            template.colorScheme === 'blue' && "bg-gradient-to-br from-blue-900 to-blue-700",
            template.colorScheme === 'green' && "bg-gradient-to-br from-green-900 to-green-700",
            template.colorScheme === 'purple' && "bg-gradient-to-br from-purple-900 to-purple-700",
            template.colorScheme === 'default' && "bg-gradient-to-br from-gray-900 to-gray-700"
          )}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-4 bg-white/30 rounded mb-2 mx-auto" />
                <div className="w-24 h-6 bg-white/50 rounded mb-1 mx-auto" />
                <div className="w-20 h-3 bg-white/30 rounded mx-auto" />
              </div>
            </div>
          </div>
          
          {/* Gallery preview */}
          {template.heroStyle !== 'full-height' && (
            <div className="flex-1 bg-gray-800 p-2">
              <div className={cn(
                "h-full",
                template.galleryLayout === 'grid' && "grid grid-cols-3 gap-1",
                template.galleryLayout === 'carousel' && "flex space-x-1",
                template.galleryLayout === 'masonry' && "grid grid-cols-2 gap-1"
              )}>
                {Array.from({ length: template.galleryLayout === 'carousel' ? 4 : 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded aspect-square" />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Template overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-end p-3">
          <div className="text-white text-xs">
            <div className="font-medium">{template.name}</div>
            <div className="text-white/70">{template.heroStyle} • {template.galleryLayout}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Profile Template</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current template display */}
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div>
            <div className="font-medium">{TRAINER_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {TRAINER_TEMPLATES.find(t => t.id === selectedTemplate)?.description}
            </div>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={disabled}>
                <Settings className="w-4 h-4 mr-2" />
                Change Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Choose Profile Template</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: templates.indexOf(template) * 0.1 }}
                  >
                    <Card 
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-lg",
                        template.selected && "ring-2 ring-rebuild-yellow",
                        "group"
                      )}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Template preview */}
                          <TemplatePreview template={template.config} />
                          
                          {/* Template info */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{template.config.name}</h3>
                              {template.selected && (
                                <Check className="w-5 h-5 text-rebuild-yellow" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {template.config.description}
                            </p>
                            
                            {/* Features */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {template.config.features.slice(0, 3).map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            
                            {/* Template specs */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Layout className="w-3 h-3" />
                                <span>{template.config.heroStyle}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Grid className="w-3 h-3" />
                                <span>{template.config.galleryLayout}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsOpen(false)} className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400">
                  Apply Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick template features */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Template Features:</div>
          <div className="flex flex-wrap gap-1">
            {TRAINER_TEMPLATES.find(t => t.id === selectedTemplate)?.features.map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainerTemplateSelector;
